import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextResponse, NextRequest } from "next/server";
import { getDataFromToken } from "@/helpers/getToken";

// Connect to the database
connect();

// Handle the POST request
export async function POST(request: NextRequest) {
  try {
    // Parse the request body and get checkedData (now an array of strings)
    const reqBody = await request.json();
    const { checkedData } = reqBody;

    console.log("Received checkedData:", checkedData);

    // Ensure checkedData exists and is an array
    if (!Array.isArray(checkedData)) {
      console.error("CheckedData is missing or not an array in the request");
      return NextResponse.json({ error: "Missing or invalid checkedData" }, { status: 400 });
    }

    // Retrieve user ID from the token
    const userId = getDataFromToken(request);

    if (!userId) {
      console.error("User ID not found in the token");
      return NextResponse.json({ error: "User not logged in" }, { status: 401 });
    }

    console.log(`Fetching user data for userId: ${userId}`);
    const user = await User.findById(userId);

    // Check if the user is found
    if (!user) {
      console.error(`User not found with ID: ${userId}`);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update the user's checkedData (since it's now an array of strings)
    user.checkedData = checkedData; // Directly assign the received array

    // Save the updated user data
    await user.save();

    console.log("User successfully updated:", user);

    return NextResponse.json({ message: "Checked data updated successfully", success: true, user });

  } catch (error: any) {
    console.error("Error while updating user data:", error.message);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
