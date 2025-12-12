import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connect } from "@/dbConfig/dbConfig";
import InterviewExperience from "@/models/interviewExperienceModel";
import User from "@/models/userModel";
import jwt from "jsonwebtoken";

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
  await connect();
  const user = await getUserFromRequest(req);
  if (!user || !user.isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const pending = await InterviewExperience.find({ status: "pending" });
  return NextResponse.json({ pending });
}

export async function PATCH(req: Request) {
  await connect();
  const { id, action, reason } = await req.json();
  const nextReq = req as unknown as NextRequest;
  if (!id || !["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  // Validate admin from session
  const adminUser = await getUserFromRequest(nextReq);
  if (!adminUser || !adminUser.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const doc = await InterviewExperience.findById(id);
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (action === "approve") {
    doc.status = "approved";
    doc.approved = true;
    doc.approvedBy = adminUser._id;
    doc.approvedAt = new Date();
  } else {
    // Mark as rejected rather than deleting; save reason
    doc.status = "rejected";
    doc.rejectionReason = reason || undefined;
    doc.rejectedBy = adminUser._id;
    doc.rejectedAt = new Date();
    await doc.save();
    return NextResponse.json({ message: "Rejected", experience: doc });
  }
  await doc.save();
  // Revalidate public pages so list and detail reflect approval immediately
  try {
    revalidatePath('/interview-experiences');
    revalidatePath(`/interview-experiences/${doc._id}`);
  } catch (err) {
    // ignore if revalidation API not available
  }
  return NextResponse.json({ message: "Approved", experience: doc });
}
