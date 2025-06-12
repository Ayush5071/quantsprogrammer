import { connect } from "@/dbConfig/dbConfig";
import Roadmap from "@/models/roadmapModel";
import { NextResponse, NextRequest } from "next/server";

// Connect to the database
connect();

// Create a new roadmap (admin only)
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { title, description, createdBy, phases } = reqBody;
    if (!title || !createdBy) {
      return NextResponse.json({ error: "Title and createdBy are required" }, { status: 400 });
    }
    const roadmap = new Roadmap({ title, description, createdBy, phases });
    await roadmap.save();
    return NextResponse.json({ message: "Roadmap created", roadmap });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

// Get all roadmaps
export async function GET() {
  try {
    const roadmaps = await Roadmap.find({});
    return NextResponse.json({ roadmaps });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
