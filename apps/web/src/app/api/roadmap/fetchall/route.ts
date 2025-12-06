import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import Roadmap from "@/models/roadmapModel";
import { NextResponse, NextRequest } from "next/server";
import { getDataFromToken } from "@/helpers/getToken";

export async function GET(request: NextRequest) {
  try {
    await connect();
    const roadmaps = await Roadmap.find({});
    return NextResponse.json({ roadmaps });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
