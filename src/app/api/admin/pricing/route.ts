import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import PricingSettings from "@/models/pricingSettingsModel";
import User from "@/models/userModel";
import jwt from "jsonwebtoken";

connect();

// Helper to verify admin
async function verifyAdmin(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) return null;

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as { id: string };
    const user = await User.findById(decoded.id);
    
    if (!user || !user.isAdmin) return null;
    return user;
  } catch (error) {
    return null;
  }
}

// GET - Get current pricing (public endpoint)
export async function GET(request: NextRequest) {
  try {
    await connect();
    
    let pricing = await PricingSettings.findOne({ key: "pricing" });
    
    // Create default pricing if doesn't exist
    if (!pricing) {
      pricing = await PricingSettings.create({
        key: "pricing",
        oaQuestions: 10,
        resumeScreeningPremium: 10,
        topInterviews: 10,
        mockInterviews: 10,
      });
    }

    return NextResponse.json({
      success: true,
      pricing: {
        oaQuestions: pricing.oaQuestions,
        resumeScreeningPremium: pricing.resumeScreeningPremium,
        topInterviews: pricing.topInterviews,
        mockInterviews: pricing.mockInterviews || 10,
        updatedAt: pricing.updatedAt,
      },
    });
  } catch (error: any) {
    console.error("Error fetching pricing:", error);
    return NextResponse.json(
      { error: "Failed to fetch pricing" },
      { status: 500 }
    );
  }
}

// PUT - Update pricing (admin only)
export async function PUT(request: NextRequest) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { oaQuestions, resumeScreeningPremium, topInterviews, mockInterviews } = body;

    // Validate minimum prices (Instamojo requires minimum ₹9)
    const minPrice = 9;
    if (oaQuestions < minPrice || resumeScreeningPremium < minPrice || topInterviews < minPrice || mockInterviews < minPrice) {
      return NextResponse.json(
        { error: `Minimum price is ₹${minPrice} (payment gateway requirement)` },
        { status: 400 }
      );
    }

    // Update or create pricing
    let pricing = await PricingSettings.findOne({ key: "pricing" });
    
    if (pricing) {
      pricing.oaQuestions = oaQuestions;
      pricing.resumeScreeningPremium = resumeScreeningPremium;
      pricing.topInterviews = topInterviews;
      pricing.mockInterviews = mockInterviews;
      pricing.updatedBy = admin._id.toString();
      await pricing.save();
    } else {
      pricing = await PricingSettings.create({
        key: "pricing",
        oaQuestions,
        resumeScreeningPremium,
        topInterviews,
        mockInterviews,
        updatedBy: admin._id.toString(),
      });
    }

    return NextResponse.json({
      success: true,
      message: "Pricing updated successfully",
      pricing: {
        oaQuestions: pricing.oaQuestions,
        resumeScreeningPremium: pricing.resumeScreeningPremium,
        topInterviews: pricing.topInterviews,
        mockInterviews: pricing.mockInterviews,
        updatedAt: pricing.updatedAt,
      },
    });
  } catch (error: any) {
    console.error("Error updating pricing:", error);
    return NextResponse.json(
      { error: "Failed to update pricing" },
      { status: 500 }
    );
  }
}
