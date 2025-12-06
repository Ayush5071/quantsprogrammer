import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import jwt from "jsonwebtoken";

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

// POST - Create a payment request
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
    if (user.purchases?.oaQuestions?.purchased) {
      return NextResponse.json(
        { error: "You have already purchased OA Questions access" },
        { status: 400 }
      );
    }

    // Determine redirect URL based on environment
    const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || process.env.DOMAIN || "https://www.prepsutra.tech")?.replace(/\/$/, "");
    const redirectUrl = `${baseUrl}/payment/verify`;
    
    // Webhook only works with public URLs (not localhost)
    const isLocalhost = baseUrl.includes("localhost") || baseUrl.includes("127.0.0.1");
    const webhookUrl = isLocalhost ? undefined : `${baseUrl}/api/payment/webhook`;

    // Build request body
    const bodyParams: Record<string, string> = {
      amount: "10", // ₹10 as requested
      purpose: `OA_QUESTIONS_${user._id}`,
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

    // Create payment request using API Key + Auth Token
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
      return NextResponse.json(
        { error: data.message || "Failed to create payment request. Please try again." },
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
