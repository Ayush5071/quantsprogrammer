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

// POST - Create a payment request for Resume Screening Premium
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json(
        { error: "Please login to make a purchase" },
        { status: 401 }
      );
    }

    // Check if already purchased
    if (user.purchases?.resumeScreeningPremium?.purchased) {
      return NextResponse.json(
        { error: "You have already purchased Resume Screening Premium" },
        { status: 400 }
      );
    }

    // Determine redirect URL based on environment
    const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || process.env.DOMAIN || "https://www.prepsutra.tech")?.replace(/\/$/, "");
    const redirectUrl = `${baseUrl}/payment/verify-resume-screening`;
    
    // Webhook only works with public URLs (not localhost)
    const isLocalhost = baseUrl.includes("localhost") || baseUrl.includes("127.0.0.1");
    const webhookUrl = isLocalhost ? undefined : `${baseUrl}/api/payment/webhook-resume-screening`;

    // Get dynamic pricing from admin settings
    const pricing = await getPricing();

    // Build request body with dynamic pricing
    const bodyParams: Record<string, string> = {
      amount: pricing.resumeScreeningPremium.toString(), // Dynamic pricing
      purpose: `RESUME_SCREENING_${user._id}`,
      buyer_name: user.fullName || user.username || "Customer",
      email: user.email,
      phone: user.contactNumber || "9999999999",
      redirect_url: redirectUrl,
      send_email: "false",
      send_sms: "false",
      allow_repeated_payments: "false",
    };

    // Only add webhook if not localhost
    if (webhookUrl) {
      bodyParams.webhook = webhookUrl;
    }

    // Create payment request using Instamojo API
    const response = await fetch("https://www.instamojo.com/api/1.1/payment-requests/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Api-Key": process.env.INSTAMOJO_API_KEY!,
        "X-Auth-Token": process.env.INSTAMOJO_AUTH_TOKEN!,
      },
      body: new URLSearchParams(bodyParams),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      console.error("Instamojo API error:", data);
      // Handle error message which can be string or object
      let errorMsg = "Failed to create payment request. Please try again.";
      if (typeof data.message === "string") {
        errorMsg = data.message;
      } else if (data.message && typeof data.message === "object") {
        errorMsg = Object.values(data.message).flat().join(", ");
      }
      return NextResponse.json(
        { error: errorMsg },
        { status: 500 }
      );
    }

    // Return the payment URL
    return NextResponse.json({
      success: true,
      paymentUrl: data.payment_request.longurl,
      paymentRequestId: data.payment_request.id,
    });

  } catch (error: any) {
    console.error("Error creating payment request:", error);
    return NextResponse.json(
      { error: "Failed to create payment request" },
      { status: 500 }
    );
  }
}
