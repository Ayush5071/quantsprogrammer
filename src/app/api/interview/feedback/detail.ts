import { NextRequest, NextResponse } from "next/server";
import InterviewResult from "@/models/interviewModel";
import mongoose from "mongoose";
import { connect } from "@/dbConfig/dbConfig";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({});
  if (mongoose.connection.readyState === 0) await connect();
  const result = await InterviewResult.findById(id).lean();
  if (!result) return NextResponse.json({});
  return NextResponse.json(result);
}
