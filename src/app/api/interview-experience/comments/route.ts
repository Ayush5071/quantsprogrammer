import { NextResponse } from "next/server";
import InterviewExperience from "@/models/interviewExperienceModel";
import { connect } from "@/dbConfig/dbConfig";
import { Filter } from "bad-words";
import getUserFromRequest from "@/lib/getUserFromRequest";

export async function GET(req: Request) {
  await connect();
  try {
    const { searchParams } = new URL(req.url);
    const expId = searchParams.get("expId");
    if (!expId) return NextResponse.json({ error: "Missing expId" }, { status: 400 });
    const exp = await InterviewExperience.findById(expId);
    if (!exp) return NextResponse.json({ error: "Experience not found" }, { status: 404 });
    return NextResponse.json({ comments: exp.comments || [], count: exp.comments?.length || 0 });
  } catch (err) {
    console.error("get comments error", err);
    return NextResponse.json({ error: "Failed to get comments" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await connect();
  try {
    const { expId, content } = await req.json();
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = user._id.toString();
    const userName = user.fullName || user.username || user.email?.split('@')[0];
    if (!expId || !userId || !userName || !content) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    if (content.trim().length === 0) return NextResponse.json({ error: "Comment cannot be empty" }, { status: 400 });
    if (content.length > 1000) return NextResponse.json({ error: "Comment too long" }, { status: 400 });
    const exp = await InterviewExperience.findById(expId);
    if (!exp) return NextResponse.json({ error: "Experience not found" }, { status: 404 });
    if (!exp.comments) exp.comments = [];
    const filter = new Filter();
    const cleanContent = filter.clean(content);
    const newComment = { userId, userName, content: cleanContent, createdAt: new Date() };
    exp.comments.push(newComment as any);
    await exp.save();
    const savedComment = exp.comments[exp.comments.length - 1];
    return NextResponse.json({ success: true, comment: savedComment, commentsCount: exp.comments.length });
  } catch (err) {
    console.error("add comment error", err);
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  await connect();
  try {
    const { searchParams } = new URL(req.url);
    const expId = searchParams.get("expId");
    const commentId = searchParams.get("commentId");
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = user._id?.toString();
    if (!expId || !commentId || !userId) return NextResponse.json({ error: "Missing params" }, { status: 400 });
    const exp = await InterviewExperience.findById(expId);
    if (!exp) return NextResponse.json({ error: "Experience not found" }, { status: 404 });
    const commentIndex = exp.comments?.findIndex((c: any) => c._id.toString() === commentId && c.userId === userId);
    if (commentIndex === -1 || commentIndex === undefined) return NextResponse.json({ error: "Comment not found or unauthorized" }, { status: 404 });
    exp.comments.splice(commentIndex, 1);
    await exp.save();
    return NextResponse.json({ success: true, commentsCount: exp.comments.length });
  } catch (err) {
    console.error("delete comment error", err);
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
  }
}
