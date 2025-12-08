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

// GET - Check subscription status and daily usage
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request);
    
    if (!userId) {
      return NextResponse.json(
        { subscribed: false, canInterview: false, message: "Not authenticated" },
        { status: 200 }
      );
    }
    
    const user = await User.findById(userId).select("purchases mockInterviewUsage");
    
    if (!user) {
      return NextResponse.json(
        { subscribed: false, canInterview: false, message: "User not found" },
        { status: 200 }
      );
    }
    
    const subscribed = user.purchases?.mockInterviews?.purchased || false;
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    
    // Check daily usage
    const usageDate = user.mockInterviewUsage?.date;
    const usageCount = usageDate === today ? (user.mockInterviewUsage?.count || 0) : 0;
    
    // Free users can do 1 interview per day
    const canInterview = subscribed || usageCount < 1;
    const remainingFreeInterviews = subscribed ? "unlimited" : Math.max(0, 1 - usageCount);
    
    return NextResponse.json({
      subscribed,
      canInterview,
      usageToday: usageCount,
      remainingFreeInterviews,
      subscribedAt: user.purchases?.mockInterviews?.purchasedAt || null,
    });
  } catch (error: any) {
    console.error("Error checking mock interview status:", error);
    return NextResponse.json(
      { error: "Failed to check subscription status" },
      { status: 500 }
    );
  }
}

// POST - Record successful payment / subscription activation
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { paymentId, status, amount } = body;
    
    if (status !== "success") {
      return NextResponse.json(
        { error: "Payment was not successful" },
        { status: 400 }
      );
    }
    
    // Get dynamic pricing for fallback
    const pricing = await getPricing();
    
    // Update user's subscription status
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          "purchases.mockInterviews": {
            purchased: true,
            purchasedAt: new Date(),
            paymentId: paymentId || `MI_${Date.now()}`,
            amount: amount || pricing.mockInterviews,
          }
        }
      },
      { new: true }
    );
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: "Mock interview subscription activated successfully",
      subscribed: true,
    });
  } catch (error: any) {
    console.error("Error recording subscription:", error);
    return NextResponse.json(
      { error: "Failed to record subscription" },
      { status: 500 }
    );
  }
}
