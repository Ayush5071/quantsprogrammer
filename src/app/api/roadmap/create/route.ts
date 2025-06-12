import { connect } from "@/dbConfig/dbConfig";
import Roadmap from "@/models/roadmapModel";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

connect();

// POST: Create a new roadmap (admin only)
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { title, description, createdBy, phases } = reqBody;
    if (!title || !createdBy) {
      return NextResponse.json({ error: "Title and createdBy are required" }, { status: 400 });
   }
    // Admin check: get token from headers
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];
    let isAdmin = false;
    try {
      const payload = jwt.decode(token);
      if (payload && typeof payload === "object" && "isAdmin" in payload) {
        isAdmin = (payload as any).isAdmin === true;
      }
    } catch {}
    if (!isAdmin) {
      return NextResponse.json({ error: "Only admin can create roadmaps" }, { status: 403 });
    }
    const roadmap = new Roadmap({ title, description, createdBy, phases });
    await roadmap.save();
    return NextResponse.json({ message: "Roadmap created", roadmap });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
