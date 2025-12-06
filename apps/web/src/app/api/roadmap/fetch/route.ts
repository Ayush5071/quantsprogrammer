import { connect } from "@/dbConfig/dbConfig";
import Roadmap from "@/models/roadmapModel";
import { NextResponse, NextRequest } from "next/server";
import { getDataFromToken } from "@/helpers/getToken";

// Connect to the database
connect();

// Handle the GET request to fetch roadmap based on userId and topic
export async function GET(request: NextRequest) {
  try {
    const userId = getDataFromToken(request);  // Get the user ID from the token

    // Retrieve topic from URL or query parameters (assumes query string is sent)
    const { searchParams } = new URL(request.url);
    const topic = searchParams.get("topic");  // Extract topic from query string (e.g., ?topic=FrontEndWeb)

    // If topic is not provided
    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    // If user is not logged in, return an error
    if (!userId) {
      console.error("User not logged in. No token found in request.");
      return NextResponse.json({ error: "User is not logged in" }, { status: 401 });
    }

    console.log("Fetching roadmap data for userId: ", userId, " and topic: ", topic);

    // Find the roadmap by both userId and topic
    const roadmap = await Roadmap.findOne({ userId, topic });

    // If no roadmap found
    if (!roadmap) {
      console.error(`Roadmap not found for userId: ${userId} with topic: ${topic}`);
      return NextResponse.json({ error: "Roadmap not found" }, { status: 404 });
    }

    // Extract and return only the topic and checkedData
    const { checkedData } = roadmap;

    console.log("Found roadmap. Returning roadmap data: ", { topic, checkedData });
    return NextResponse.json({
      topic,
      checkedData: checkedData || [], // Fallback to empty array if no checkedData exists
      source: "mongoDB",
    });

  } catch (error: any) {
    // Handle any server-side errors
    console.error("Error while fetching roadmap data: ", error.message);
    return NextResponse.json({
      error: error.message || "Internal server error"
    }, { status: 500 });
  }
}
