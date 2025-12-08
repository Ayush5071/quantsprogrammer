import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import jwt from "jsonwebtoken";
import { getPricing } from "@/helpers/getPricing";

connect();

// Helper to get user ID from request
async function getUserIdFromRequest(request: NextRequest): Promise<string | null> {
  try {
    const cookieToken = request.cookies.get("token")?.value;
    const authHeader = request.headers.get("authorization");
    const headerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
    
    const token = cookieToken || headerToken;
    if (!token) return null;
    
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as { id: string };
    return decoded.id;
  } catch (error) {
    return null;
  }
}

// POST - Create payment request for mock interviews subscription
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: "Please login to continue" },
        { status: 401 }
      );
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if already subscribed
    if (user.purchases?.mockInterviews?.purchased) {
      return NextResponse.json(
        { error: "You already have an active subscription" },
        { status: 400 }
      );
    }

    // Get dynamic pricing
    const pricing = await getPricing();

    // Create Instamojo payment request
    const redirectUrl = `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/payment/verify-mock-interviews`;

    const response = await fetch("https://www.instamojo.com/api/1.1/payment-requests/", {
      method: "POST",
      headers: {
        "X-Api-Key": process.env.INSTAMOJO_API_KEY!,
        "X-Auth-Token": process.env.INSTAMOJO_AUTH_TOKEN!,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        purpose: `MOCK_INTERVIEWS_${userId}`,
        amount: String(pricing.mockInterviews),
        buyer_name: user.username || user.fullName || "User",
        email: user.email,
        redirect_url: redirectUrl,
        allow_repeated_payments: "false",
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      console.error("Instamojo error:", data);
      const errorMessage = typeof data.message === 'object' ? JSON.stringify(data.message) : (data.message || "Payment gateway error");
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      );
    }

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
