import { connect } from "@/dbConfig/dbConfig";
import { TestAttempt } from "@/models/roadmapTestModel";
import User from "@/models/userModel";
import { NextResponse, NextRequest } from "next/server";
import { getDataFromToken } from "@/helpers/getToken";

connect();

// POST: Admin allows a user to retry a test
export async function POST(request: NextRequest) {
  try {
    const adminId = await getDataFromToken(request);
    if (!adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if requester is admin
    const admin = await User.findById(adminId);
    if (!admin?.isAdmin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { userId, roadmapId } = await request.json();

    if (!userId || !roadmapId) {
      return NextResponse.json(
        { error: "userId and roadmapId are required" },
        { status: 400 }
      );
    }

    // Find the user's attempt
    const attempt = await TestAttempt.findOne({
      userId,
      roadmapId,
      submittedAt: { $exists: true },
    });

    if (!attempt) {
      return NextResponse.json(
        { error: "No test attempt found for this user and roadmap" },
        { status: 404 }
      );
    }

    // Allow retry
    attempt.canRetry = true;
    await attempt.save();

    return NextResponse.json({
      success: true,
      message: "User can now retry the test",
      attempt,
    });
  } catch (error: any) {
    console.error("Error allowing retry:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// GET: Get all test attempts (for admin)
export async function GET(request: NextRequest) {
  try {
    const adminId = await getDataFromToken(request);
    if (!adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if requester is admin
    const admin = await User.findById(adminId);
    if (!admin?.isAdmin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const roadmapId = searchParams.get("roadmapId");
    const userId = searchParams.get("userId");

    let query: any = { submittedAt: { $exists: true } };
    if (roadmapId) query.roadmapId = roadmapId;
    if (userId) query.userId = userId;

    const attempts = await TestAttempt.find(query)
      .sort({ submittedAt: -1 })
      .limit(100);

    // Get user details for each attempt
    const attemptsWithUsers = await Promise.all(
      attempts.map(async (attempt) => {
        const user = await User.findById(attempt.userId).select(
          "username email fullName"
        );
        return {
          ...attempt.toObject(),
          user: user
            ? {
                username: user.username,
                email: user.email,
                fullName: user.fullName,
              }
            : null,
        };
      })
    );

    return NextResponse.json({ attempts: attemptsWithUsers });
  } catch (error: any) {
    console.error("Error getting attempts:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
