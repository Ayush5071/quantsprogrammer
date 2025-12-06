import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getToken";
import jwt from "jsonwebtoken";

connect();

// Helper to get userId from either cookie or Authorization header
function getUserIdFromRequest(request: NextRequest): string | null {
  // First try cookie (via getDataFromToken)
  try {
    const userId = getDataFromToken(request);
    if (userId) return userId;
  } catch (e) {
    // Cookie token failed, try Authorization header
  }
  
  // Try Authorization header
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      const token = authHeader.substring(7);
      const decoded: any = jwt.verify(token, process.env.TOKEN_SECRET!);
      return decoded.id;
    } catch (e) {
      // Authorization header token also failed
    }
  }
  
  return null;
}

// GET: Get completed tasks/assignments for a roadmap
export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);
    
    if (!userId) {
      console.log("Progress GET: No valid user token found");
      return NextResponse.json({ error: "Not authenticated", progress: { completedTasks: [], completedAssignments: [] } }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const roadmapId = searchParams.get("roadmapId");
    
    if (!roadmapId) {
      return NextResponse.json({ error: "Missing roadmap id" }, { status: 400 });
    }
    
    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    
    const progress = user.completedRoadmaps?.find((r: any) => r.roadmapId === roadmapId) || { completedTasks: [], completedAssignments: [] };
    console.log(`Progress API GET - User: ${userId}, Roadmap: ${roadmapId}, Progress:`, JSON.stringify(progress));
    
    return NextResponse.json({ progress });
  } catch (error: any) {
    console.error("Error in progress GET:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

// POST: Update completed tasks/assignments for a roadmap
export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);
    
    if (!userId) {
      console.log("Progress POST: No valid user token found");
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    const { roadmapId, completedTasks, completedAssignments } = await request.json();
    
    if (!roadmapId) {
      return NextResponse.json({ error: "Missing roadmap id" }, { status: 400 });
    }
    
    console.log(`Progress POST - User: ${userId}, Roadmap: ${roadmapId}`);
    console.log(`  - Completed Tasks: ${completedTasks?.length || 0}`);
    console.log(`  - Completed Assignments: ${completedAssignments?.length || 0}`);
    
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
    
    console.log(`Progress POST - Saved successfully for user ${userId}`);
    return NextResponse.json({ message: "Progress updated", success: true });
  } catch (error: any) {
    console.error("Error in progress POST:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
