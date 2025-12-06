import { NextRequest, NextResponse } from "next/server";
import InterviewResult from "@/models/interviewModel";
import mongoose from "mongoose";
import { connect } from "@/dbConfig/dbConfig";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ results: [] });
  if (mongoose.connection.readyState === 0) await connect();
  const results = await InterviewResult.find({ user: userId }).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ results });
}
