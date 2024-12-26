import { connect } from "@/dbConfig/dbConfig";
import Roadmap from "@/models/roadmapModel";
import { NextResponse, NextRequest } from "next/server";
import { getDataFromToken } from "@/helpers/getToken";

// Connect to the database
connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { checkedData, topic } = reqBody;

    console.log("Received checkedData and topic:", checkedData, topic);

    if (!Array.isArray(checkedData) || !topic) {
      console.error("CheckedData is missing, not an array, or topic is missing in the request");
      return NextResponse.json({ error: "Missing or invalid checkedData or topic" }, { status: 400 });
    }

    const userId = getDataFromToken(request);

    if (!userId) {
      console.error("User ID not found in the token");
      return NextResponse.json({ error: "User not logged in" }, { status: 401 });
    }

    console.log(`Fetching roadmap data for userId: ${userId} and topic: ${topic}`);

    // Look for roadmap data with both userId and topic
    let roadmap = await Roadmap.findOne({ userId, topic });

    if (!roadmap) {
      roadmap = new Roadmap({ userId, checkedData, topic });
      await roadmap.save();
      console.log("New roadmap created:", roadmap);
    } else {
      roadmap.checkedData = checkedData;
      await roadmap.save();
      console.log("Roadmap updated:", roadmap);
    }

    return NextResponse.json({ message: "Roadmap data processed successfully", success: true, roadmap });

  } catch (error: any) {
    console.error("Error while updating roadmap:", error.message);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
