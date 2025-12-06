import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import jwt from "jsonwebtoken";

connect();

// Helper to get user from request and check admin
async function getAdminUser(request: NextRequest) {
  try {
    const cookieToken = request.cookies.get("token")?.value;
    if (!cookieToken) return null;
    
    const decoded = jwt.verify(cookieToken, process.env.TOKEN_SECRET!) as { id: string };
    const user = await User.findById(decoded.id);
    
    if (!user || !user.isAdmin) return null;
    return user;
  } catch (error) {
    return null;
  }
}

// POST - Admin unlock OA questions for a user by email
export async function POST(request: NextRequest) {
  try {
    const adminUser = await getAdminUser(request);
    
    if (!adminUser) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    const { email, paymentId } = body;
    
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }
    
    // Find user by email and update purchase status
    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      {
        $set: {
          "purchases.oaQuestions": {
            purchased: true,
            purchasedAt: new Date(),
            paymentId: paymentId || `ADMIN_UNLOCK_${Date.now()}`,
            amount: 199,
          }
        }
      },
      { new: true }
    );
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found with this email" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: `OA Questions unlocked for ${email}`,
      user: {
        email: user.email,
        username: user.username,
        purchased: true,
      }
    });
  } catch (error: any) {
    console.error("Error unlocking OA questions:", error);
    return NextResponse.json(
      { error: "Failed to unlock OA questions" },
      { status: 500 }
    );
  }
}

// GET - List users who have purchased
export async function GET(request: NextRequest) {
  try {
    const adminUser = await getAdminUser(request);
    
    if (!adminUser) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }
    
    const users = await User.find({
      "purchases.oaQuestions.purchased": true
    }).select("email username purchases.oaQuestions");
    
    return NextResponse.json({
      count: users.length,
      users: users.map(u => ({
        email: u.email,
        username: u.username,
        purchasedAt: u.purchases?.oaQuestions?.purchasedAt,
        paymentId: u.purchases?.oaQuestions?.paymentId,
      }))
    });
  } catch (error: any) {
    console.error("Error fetching purchases:", error);
    return NextResponse.json(
      { error: "Failed to fetch purchases" },
      { status: 500 }
    );
  }
}
