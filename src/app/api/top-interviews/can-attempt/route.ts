import { NextRequest, NextResponse } from "next/server";
import TopInterviewAttempt from "@/models/topInterviewAttemptModel";
import TopInterview from "@/models/topInterviewModel";
import mongoose from "mongoose";
import { connect } from "@/dbConfig/dbConfig";

// GET: Check if a user can attempt an interview
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const interviewId = searchParams.get('interviewId');
    const userId = searchParams.get('userId');

    if (!interviewId || !userId) {
      return NextResponse.json({ error: "Interview ID and User ID are required" }, { status: 400 });
    }

    if (mongoose.connection.readyState === 0) await connect();

    // Get interview details
    const interview = await TopInterview.findById(interviewId).lean() as any;
    if (!interview) {
      return NextResponse.json({ error: "Interview not found" }, { status: 404 });
    }

    // Check if interview has ended
    if (interview.isEnded) {
      return NextResponse.json({
        canAttempt: false,
        reason: "ended",
        message: "This interview has ended and is no longer accepting submissions."
      });
    }

    // Check for existing attempt
    const existingAttempt = await TopInterviewAttempt.findOne({
      topInterview: interviewId,
      user: userId
    }).lean() as any;

    if (!existingAttempt) {
      // No previous attempt, user can attempt
      return NextResponse.json({
        canAttempt: true,
        hasAttempted: false
      });
    }

    // User has attempted before, check if retry is allowed
    const canRetry = interview.allowRetryForAll || 
      interview.retryAllowedUsers?.some((id: any) => id.toString() === userId.toString());

    if (canRetry) {
      return NextResponse.json({
        canAttempt: true,
        hasAttempted: true,
        previousScore: existingAttempt.score,
        previousAttemptDate: existingAttempt.createdAt,
        retryAllowed: true
      });
    }

    // User cannot retry
    return NextResponse.json({
      canAttempt: false,
      hasAttempted: true,
      previousScore: existingAttempt.score,
      previousAttemptDate: existingAttempt.createdAt,
      reason: "already_attempted",
      message: "You have already attempted this interview. Only one attempt is allowed."
    });

  } catch (error: any) {
    console.error("Error checking attempt eligibility:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
