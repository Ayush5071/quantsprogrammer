import { connect } from "@/dbConfig/dbConfig";
import Certification from "@/models/certificationModel";
import { NextResponse, NextRequest } from "next/server";

connect();

// POST: Issue a certificate
export async function POST(request: NextRequest) {
  try {
    const { userId, roadmapId } = await request.json();
    if (!userId || !roadmapId) {
      return NextResponse.json({ error: "userId and roadmapId required" }, { status: 400 });
    }
    // Prevent duplicate certificates
    const existing = await Certification.findOne({ userId, roadmapId });
    if (existing) {
      return NextResponse.json({ certification: existing, message: "Certificate already issued" });
    }
    const cert = await Certification.create({ userId, roadmapId });
    return NextResponse.json({ certification: cert, message: "Certificate issued" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

// GET: Get all certificates for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }
    const certs = await Certification.find({ userId });
    return NextResponse.json({ certifications: certs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
