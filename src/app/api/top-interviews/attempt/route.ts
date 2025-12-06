import { NextRequest, NextResponse } from "next/server";
import TopInterviewAttempt from "@/models/topInterviewAttemptModel";
import TopInterview from "@/models/topInterviewModel";
import mongoose from "mongoose";
import { connect } from "@/dbConfig/dbConfig";

// POST: Attempt a top interview (save answers, feedback, score)
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { topInterviewId, user, answers, feedback, score } = body;
  if (!topInterviewId || !user || !answers || !feedback || typeof score !== "number") {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (mongoose.connection.readyState === 0) await connect();
  
  // Check if interview exists and get retry settings
  const interview = await TopInterview.findById(topInterviewId);
  if (!interview) {
    return NextResponse.json({ error: "Interview not found" }, { status: 404 });
  }

  // Check if user has already attempted this interview
  const existingAttempt = await TopInterviewAttempt.findOne({
    topInterview: topInterviewId,
    user: user
  });

  if (existingAttempt) {
    // Check if retry is allowed
    const canRetry = interview.allowRetryForAll || 
      interview.retryAllowedUsers?.some((id: any) => id.toString() === user.toString());
    
    if (!canRetry) {
      return NextResponse.json({ 
        error: "You have already attempted this interview. Only one attempt is allowed.",
        alreadyAttempted: true,
        previousScore: existingAttempt.score
      }, { status: 403 });
    }
    
    // If retry is allowed, remove user from retryAllowedUsers (one-time retry)
    if (!interview.allowRetryForAll) {
      await TopInterview.findByIdAndUpdate(topInterviewId, {
        $pull: { retryAllowedUsers: user }
      });
    }
  }

  const attempt = await TopInterviewAttempt.create({
    topInterview: topInterviewId,
    user,
    answers,
    feedback,
    score
  });
  return NextResponse.json(attempt);
}

// GET: Get all attempts for a user
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }
  if (mongoose.connection.readyState === 0) await connect();
  // Populate interview title for display
  const attempts = await TopInterviewAttempt.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate({ path: "topInterview", select: "title _id" });
  // Map for frontend compatibility
  const result = attempts.map(a => ({
    ...a.toObject(),
    topInterviewId: a.topInterview?._id || a.topInterview,
    interviewTitle: a.topInterview?.title || "Top Interview"
  }));
  return NextResponse.json(result);
}
