import { NextRequest, NextResponse } from "next/server";
import TopInterviewAttempt from "@/models/topInterviewAttemptModel";
import User from "@/models/userModel";
import mongoose from "mongoose";
import { connect } from "@/dbConfig/dbConfig";

// GET: All attempts for a given top interview, sorted by score desc
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json([]);
  if (mongoose.connection.readyState === 0) await connect();
  const attempts = await TopInterviewAttempt.find({ topInterview: id })
    .populate("user", "name email")
    .sort({ score: -1, createdAt: 1 })
    .lean();
  return NextResponse.json(attempts);
}
