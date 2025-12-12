import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import InterviewExperience from "@/models/interviewExperienceModel";
import User from "@/models/userModel";
import jwt from "jsonwebtoken";

connect();

async function getUserFromRequest(r: NextRequest) {
  try {
    const cookieToken = r.cookies.get("token")?.value;
    if (!cookieToken) return null;
    const decoded = jwt.verify(cookieToken, process.env.TOKEN_SECRET!) as { id: string };
    const user = await User.findById(decoded.id);
    return user;
  } catch (err) {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || !user.isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const list = await InterviewExperience.find({}).sort({ createdAt: -1 }).populate("authorId", "username email");
    return NextResponse.json({ experiences: list });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
