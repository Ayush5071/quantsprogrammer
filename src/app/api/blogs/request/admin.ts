import { NextResponse } from "next/server";
import BlogRequest from "@/models/blogRequestModel";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";

export async function GET() {
  await connect();
  // Get all pending requests
  const requests = await BlogRequest.find({ status: "pending" });
  return NextResponse.json({ requests });
}

export async function PATCH(req: Request) {
  await connect();
  const { userId, status } = await req.json();
  if (!userId || !["accepted", "rejected"].includes(status)) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const updated = await BlogRequest.findOneAndUpdate(
    { userId },
    { status, respondedAt: new Date() },
    { new: true }
  );
  if (!updated) return NextResponse.json({ error: "Request not found" }, { status: 404 });
  return NextResponse.json({ message: `Request ${status}`, request: updated });
}
