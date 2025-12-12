import { NextResponse } from "next/server";
import InterviewExperience from "@/models/interviewExperienceModel";
import { connect } from "@/dbConfig/dbConfig";
import getUserFromRequest from "@/lib/getUserFromRequest";

export async function POST(req: Request) {
  await connect();
  try {
    const { expId } = await req.json();
    if (!expId) return NextResponse.json({ error: "Missing expId" }, { status: 400 });
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = user._id.toString();
    const exp = await InterviewExperience.findById(expId);
    if (!exp) {
      return NextResponse.json({ error: "Experience not found" }, { status: 404 });
    }
    if (!exp.likes) exp.likes = [];
    const hasLiked = exp.likes.includes(userId);
    if (hasLiked) {
      exp.likes = exp.likes.filter((id: string) => id !== userId);
    } else {
      exp.likes.push(userId);
    }
    await exp.save();
    return NextResponse.json({ success: true, liked: !hasLiked, likesCount: exp.likes.length });
  } catch (err) {
    console.error("exp-like error", err);
    return NextResponse.json({ error: "Failed to update like" }, { status: 500 });
  }
}
