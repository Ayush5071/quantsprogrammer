import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import jwt from "jsonwebtoken";
import { getPricing } from "@/helpers/getPricing";

connect();

// Helper to get user from request
async function getUserFromRequest(request: NextRequest) {
  try {
    const cookieToken = request.cookies.get("token")?.value;
    if (!cookieToken) return null;

    const decoded = jwt.verify(cookieToken, process.env.TOKEN_SECRET!) as { id: string };
    const user = await User.findById(decoded.id);
    return user;
  } catch (error) {
    return null;
  }
}

// GET - Verify payment after redirect
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get("payment_id");
    const paymentRequestId = searchParams.get("payment_request_id");
    const paymentStatus = searchParams.get("payment_status");
    const product = searchParams.get("product"); // 'resume-screening' or default (oa-questions)

    const user = await getUserFromRequest(request);
    
    // Fetch dynamic pricing
    const pricing = await getPricing();

    // If payment status is Credit, verify with Instamojo API
    if (paymentStatus === "Credit" && paymentId && paymentRequestId) {
      
      // Verify payment with Instamojo using API Key + Auth Token
      const response = await fetch(
        `https://www.instamojo.com/api/1.1/payment-requests/${paymentRequestId}/`,
        {
          headers: {
            "X-Api-Key": process.env.INSTAMOJO_API_KEY!,
            "X-Auth-Token": process.env.INSTAMOJO_AUTH_TOKEN!,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        
        // Find the payment in the payment request
        const payment = data.payment_request?.payments?.find(
          (p: any) => p.payment_id === paymentId
        );

        // Verify payment is successful
        if (payment?.status === "Credit" || data.payment_request?.status === "Completed") {
          // Extract user ID and product type from purpose
          const purpose = data.payment_request?.purpose || "";
          const isResumeScreening = purpose.startsWith("RESUME_SCREENING_PREMIUM_") || product === "resume-screening";
          const purposeUserId = purpose.replace("OA_QUESTIONS_", "").replace("RESUME_SCREENING_PREMIUM_", "");

          // Update user if logged in or use purpose userId
          const targetUserId = user?._id || purposeUserId;
          
          if (targetUserId) {
            const updateField = isResumeScreening ? "purchases.resumeScreeningPremium" : "purchases.oaQuestions";
            await User.findByIdAndUpdate(targetUserId, {
              $set: {
                [updateField]: {
                  purchased: true,
                  purchasedAt: new Date(),
                  paymentId: paymentId,
                  paymentRequestId: paymentRequestId,
                  amount: parseFloat(data.payment_request?.amount) || (isResumeScreening ? pricing.resumeScreeningPremium : pricing.oaQuestions),
                }
              }
            });
          }

          return NextResponse.json({
            success: true,
            verified: true,
            message: "Payment verified successfully",
            paymentId,
            product: isResumeScreening ? "resume-screening" : "oa-questions",
          });
        }
      }

      // If API verification failed but status was Credit, trust the redirect
      // (Webhook should have already updated the database)
      if (user) {
        const isResumeScreening = product === "resume-screening";
        const purchaseField = isResumeScreening ? "resumeScreeningPremium" : "oaQuestions";
        const updateField = isResumeScreening ? "purchases.resumeScreeningPremium" : "purchases.oaQuestions";
        
        const updatedUser = await User.findById(user._id);
        if (updatedUser?.purchases?.[purchaseField]?.purchased) {
          return NextResponse.json({
            success: true,
            verified: true,
            message: "Payment already recorded",
            product: isResumeScreening ? "resume-screening" : "oa-questions",
          });
        }

        // Update anyway since status was Credit
        await User.findByIdAndUpdate(user._id, {
          $set: {
            [updateField]: {
              purchased: true,
              purchasedAt: new Date(),
              paymentId: paymentId,
              paymentRequestId: paymentRequestId,
              amount: isResumeScreening ? pricing.resumeScreeningPremium : pricing.oaQuestions,
            }
          }
        });

        return NextResponse.json({
          success: true,
          verified: true,
          message: "Payment recorded successfully",
          product: isResumeScreening ? "resume-screening" : "oa-questions",
        });
      }

      return NextResponse.json({
        success: true,
        verified: true,
        message: "Payment successful. Please login to access.",
      });
    }

    // Payment failed
    if (paymentStatus === "Failed") {
      return NextResponse.json({
        success: false,
        verified: false,
        message: "Payment failed. Please try again.",
      });
    }

    return NextResponse.json({
      success: false,
      verified: false,
      message: "Invalid payment verification request",
    });

  } catch (error: any) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }
}
