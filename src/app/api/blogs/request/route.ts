import { NextResponse } from "next/server";
import BlogRequest from "@/models/blogRequestModel";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";

export async function POST(req: Request) {
  await connect();
  const { userId } = await req.json();
  if (!userId) return NextResponse.json({ error: "User ID required" }, { status: 400 });

  // Check if already requested
  const existing = await BlogRequest.findOne({ userId });
  if (existing) {
    return NextResponse.json({ error: "Request already exists", status: existing.status }, { status: 409 });
  }

  // Check if user is admin
  const user = await User.findById(userId);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (user.isAdmin) return NextResponse.json({ error: "Admins can create blogs directly" }, { status: 403 });

  const reqDoc = await BlogRequest.create({ userId });
  return NextResponse.json({ message: "Request sent", request: reqDoc });
}

export async function GET(req: Request) {
  await connect();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "User ID required" }, { status: 400 });
  const request = await BlogRequest.findOne({ userId });
  if (!request) return NextResponse.json({ request: null });
  return NextResponse.json({ request });
}
