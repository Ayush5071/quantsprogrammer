import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getToken";

connect();

// GET: Get completed tasks/assignments for a roadmap
export async function GET(request: NextRequest) {
  try {
    const userId = getDataFromToken(request);
    const { searchParams } = new URL(request.url);
    const roadmapId = searchParams.get("roadmapId");
    if (!userId || !roadmapId) {
      return NextResponse.json({ error: "Missing user or roadmap id" }, { status: 400 });
    }
    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    const progress = user.completedRoadmaps?.find((r: any) => r.roadmapId === roadmapId) || { completedTasks: [], completedAssignments: [] };
    return NextResponse.json({ progress });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

// POST: Update completed tasks/assignments for a roadmap
export async function POST(request: NextRequest) {
  try {
    const userId = getDataFromToken(request);
    const { roadmapId, completedTasks, completedAssignments } = await request.json();
    if (!userId || !roadmapId) {
      return NextResponse.json({ error: "Missing user or roadmap id" }, { status: 400 });
    }
    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    let found = false;
    user.completedRoadmaps = user.completedRoadmaps || [];
    user.completedRoadmaps = user.completedRoadmaps.map((r: any) => {
      if (r.roadmapId === roadmapId) {
        found = true;
        return { roadmapId, completedTasks, completedAssignments };
      }
      return r;
    });
    if (!found) {
      user.completedRoadmaps.push({ roadmapId, completedTasks, completedAssignments });
    }
    await user.save();
    return NextResponse.json({ message: "Progress updated" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
