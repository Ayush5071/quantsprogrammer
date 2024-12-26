import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextResponse, NextRequest } from "next/server";
import { getDataFromToken } from "@/helpers/getToken";

// Connect to the database
connect();

// Handle the GET request
export async function GET(request: NextRequest) {
  try {
    const userId = getDataFromToken(request);

    // Check if user is logged in
    if (!userId) {
      console.error("User not logged in. No token found in request.");
      return NextResponse.json({ error: "User is not logged in" }, { status: 401 });
    }

    console.log("Fetching user data for userId: ", userId);
    const user = await User.findById(userId);

    // If user is not found
    if (!user) {
      console.error(`User not found for userId: ${userId}`);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return the checkedData (array of strings) from MongoDB
    console.log("Found user. Returning checkedData: ", user.checkedData);
    return NextResponse.json({ checkedData: user.checkedData || [], source: "mongoDB" });

  } catch (error: any) {
    // Handle any server error
    console.error("Error while fetching user data: ", error.message);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
