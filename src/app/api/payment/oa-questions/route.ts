import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import jwt from "jsonwebtoken";
import { getPricing } from "@/helpers/getPricing";

connect();

// Helper to get user ID from request
async function getUserIdFromRequest(request: NextRequest): Promise<string | null> {
  try {
    // Try to get token from cookie first
    const cookieToken = request.cookies.get("token")?.value;
    
    // Try Authorization header as fallback
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

// GET - Check if user has purchased OA questions
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request);
    
    if (!userId) {
      return NextResponse.json(
        { purchased: false, message: "Not authenticated" },
        { status: 200 }
      );
    }
    
    const user = await User.findById(userId).select("purchases");
    
    if (!user) {
      return NextResponse.json(
        { purchased: false, message: "User not found" },
        { status: 200 }
      );
    }
    
    const purchased = user.purchases?.oaQuestions?.purchased || false;
    
    return NextResponse.json({
      purchased,
      purchasedAt: user.purchases?.oaQuestions?.purchasedAt || null,
    });
  } catch (error: any) {
    console.error("Error checking purchase status:", error);
    return NextResponse.json(
      { error: "Failed to check purchase status" },
      { status: 500 }
    );
  }
}

// POST - Record successful payment
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
    
    // Get dynamic pricing
    const pricing = await getPricing();
    
    // Update user's purchase status
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          "purchases.oaQuestions": {
            purchased: true,
            purchasedAt: new Date(),
            paymentId: paymentId || `INS_${Date.now()}`,
            amount: amount || pricing.oaQuestions,
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
      message: "Purchase recorded successfully",
      purchased: true,
    });
  } catch (error: any) {
    console.error("Error recording purchase:", error);
    return NextResponse.json(
      { error: "Failed to record purchase" },
      { status: 500 }
    );
  }
}
