import { connect } from "@/dbConfig/dbConfig";
import Roadmap from "@/models/roadmapModel";
import { NextResponse, NextRequest } from "next/server";

connect();

// PATCH: Update a roadmap by ID (admin only)
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Roadmap ID is required" }, { status: 400 });
    }
    // Optionally: Add admin check here
    const updated = await Roadmap.findByIdAndUpdate(id, body, { new: true });
    if (!updated) {
      return NextResponse.json({ error: "Roadmap not found" }, { status: 404 });
    }
    return NextResponse.json({ roadmap: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
