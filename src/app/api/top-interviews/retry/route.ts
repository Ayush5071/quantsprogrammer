import { NextRequest, NextResponse } from "next/server";
import TopInterview from "@/models/topInterviewModel";
import TopInterviewAttempt from "@/models/topInterviewAttemptModel";
import User from "@/models/userModel";
import mongoose from "mongoose";
import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getToken";

// POST: Allow a user to retry an interview (admin only)
export async function POST(req: NextRequest) {
  try {
    if (mongoose.connection.readyState === 0) await connect();
    
    const tokenUserId = getDataFromToken(req);
    const adminUser = await User.findById(tokenUserId).lean();
    const admin = Array.isArray(adminUser) ? adminUser[0] : adminUser;
    
    // Check admin via env variable or database flag
    const adminEmails = process.env.ADMINS ? process.env.ADMINS.split(",").map(e => e.trim().toLowerCase()) : [];
    const userEmail = (admin as any)?.email?.trim().toLowerCase() || "";
    const isAdmin = adminEmails.includes(userEmail) || (admin as any)?.isAdmin === true;
    
    if (!admin || !isAdmin) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const body = await req.json();
    const { interviewId, userId, action } = body;

    if (!interviewId) {
      return NextResponse.json({ error: "Interview ID is required" }, { status: 400 });
    }

    const interview = await TopInterview.findById(interviewId);
    if (!interview) {
      return NextResponse.json({ error: "Interview not found" }, { status: 404 });
    }

    // Action: allowRetryForUser - allow a specific user to retry
    if (action === "allowRetryForUser" && userId) {
      // Check if user exists
      const user = await User.findById(userId);
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Check if user is already in retry list
      const alreadyAllowed = interview.retryAllowedUsers?.some(
        (id: any) => id.toString() === userId.toString()
      );
      
      if (alreadyAllowed) {
        return NextResponse.json({ error: "User already has retry permission" }, { status: 400 });
      }

      await TopInterview.findByIdAndUpdate(interviewId, {
        $addToSet: { retryAllowedUsers: userId }
      });

      return NextResponse.json({ 
        success: true, 
        message: `Retry allowed for user ${user.username || user.email}` 
      });
    }

    // Action: removeRetryForUser - remove retry permission for a user
    if (action === "removeRetryForUser" && userId) {
      await TopInterview.findByIdAndUpdate(interviewId, {
        $pull: { retryAllowedUsers: userId }
      });

      return NextResponse.json({ 
        success: true, 
        message: "Retry permission removed" 
      });
    }

    // Action: toggleRetryForAll - toggle retry for all users
    if (action === "toggleRetryForAll") {
      const newValue = !interview.allowRetryForAll;
      await TopInterview.findByIdAndUpdate(interviewId, {
        allowRetryForAll: newValue
      });

      return NextResponse.json({ 
        success: true, 
        message: newValue ? "Retry enabled for all users" : "Retry disabled for all users",
        allowRetryForAll: newValue
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  } catch (error: any) {
    console.error("Error managing retry:", error);
    return NextResponse.json({ error: error.message || "Failed to manage retry" }, { status: 500 });
  }
}

// GET: Get interview retry settings and attempts for admin
export async function GET(req: NextRequest) {
  try {
    if (mongoose.connection.readyState === 0) await connect();
    
    const tokenUserId = getDataFromToken(req);
    const adminUser = await User.findById(tokenUserId).lean();
    const admin = Array.isArray(adminUser) ? adminUser[0] : adminUser;
    
    // Check admin via env variable or database flag
    const adminEmails = process.env.ADMINS ? process.env.ADMINS.split(",").map(e => e.trim().toLowerCase()) : [];
    const userEmail = (admin as any)?.email?.trim().toLowerCase() || "";
    const isAdmin = adminEmails.includes(userEmail) || (admin as any)?.isAdmin === true;
    
    if (!admin || !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const interviewId = searchParams.get('interviewId');

    if (!interviewId) {
      return NextResponse.json({ error: "Interview ID is required" }, { status: 400 });
    }

    const interviewResult = await TopInterview.findById(interviewId)
      .populate('retryAllowedUsers', 'username email fullName')
      .lean();
    
    // Handle array or single document
    const interview: any = Array.isArray(interviewResult) ? interviewResult[0] : interviewResult;

    if (!interview) {
      return NextResponse.json({ error: "Interview not found" }, { status: 404 });
    }

    // Get all attempts for this interview
    const attempts = await TopInterviewAttempt.find({ topInterview: interviewId })
      .populate('user', 'username email fullName')
      .sort({ score: -1, createdAt: 1 })
      .lean();

    return NextResponse.json({
      interview: {
        _id: interview._id,
        title: interview.title,
        allowRetryForAll: interview.allowRetryForAll,
        retryAllowedUsers: interview.retryAllowedUsers || []
      },
      attempts: attempts.map((a: any) => ({
        _id: a._id,
        user: a.user,
        score: a.score,
        createdAt: a.createdAt,
        hasRetryPermission: interview.allowRetryForAll || 
          interview.retryAllowedUsers?.some((u: any) => u._id?.toString() === a.user?._id?.toString())
      }))
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
