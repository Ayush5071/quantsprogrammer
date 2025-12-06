import { connect } from "@/dbConfig/dbConfig";
import Roadmap from "@/models/roadmapModel";
import { NextResponse, NextRequest } from "next/server";

connect();

// Get a single roadmap by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "Roadmap ID is required" }, { status: 400 });
    }
    const roadmap = await Roadmap.findById(id);
    if (!roadmap) {
      return NextResponse.json({ error: "Roadmap not found" }, { status: 404 });
    }
    return NextResponse.json({ roadmap });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
