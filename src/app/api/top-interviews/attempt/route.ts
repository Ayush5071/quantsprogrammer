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
  // Optionally: check if topInterviewId exists
  const attempt = await TopInterviewAttempt.create({
    topInterview: topInterviewId,
    user,
    answers,
    feedback,
    score
  });
  return NextResponse.json(attempt);
}
