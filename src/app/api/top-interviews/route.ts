import { NextRequest, NextResponse } from "next/server";
import TopInterview from "@/models/topInterviewModel";
import mongoose from "mongoose";
import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getToken";
import User from "@/models/userModel";

// GET all top interviews
export async function GET() {
  if (mongoose.connection.readyState === 0) await connect();
  const interviews = await TopInterview.find({}).sort({ createdAt: -1 }).lean();
  return NextResponse.json(interviews);
}

// POST create a new top interview (admin only)
export async function POST(req: NextRequest) {
  if (mongoose.connection.readyState === 0) await connect();
  const tokenUserId = getDataFromToken(req);
  const adminUser = await User.findById(tokenUserId).lean();
  // If adminUser is an array, get the first element
  const admin = Array.isArray(adminUser) ? adminUser[0] : adminUser;
  if (!admin || !admin.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const body = await req.json();
  const { title, description, questions, skills, level, topics, field, company } = body;
  if (!title || !description || !questions || !skills || !level || !topics || !field || !company) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  const interview = await TopInterview.create({
    title,
    description,
    questions,
    skills,
    level,
    topics,
    field,
    company,
    createdBy: admin._id
  });
  return NextResponse.json(interview);
}
