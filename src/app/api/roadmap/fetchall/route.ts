import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextResponse, NextRequest } from "next/server";
import { getDataFromToken } from "@/helpers/getToken";

connect();

export async function GET(request: NextRequest) {
  try {
    const userId = getDataFromToken(request);

    if (!userId) {
      console.error("User not logged in. No token found in request.");
      return NextResponse.json({ error: "User is not logged in" }, { status: 401 });
    }

    console.log("Fetching roadmap documents for userId: ", userId);
    const user = await User.findById(userId);

    if (!user) {
      console.error(`User not found for userId: ${userId}`);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }


    const groupedCheckedData = groupCheckedDataByTopic(user.checkedData || []);

    console.log("Grouped checkedData by topic: ", groupedCheckedData);

    return NextResponse.json({ groupedCheckedData });

  } catch (error: any) {
    console.error("Error while fetching user data: ", error.message);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

function groupCheckedDataByTopic(checkedData: any[]) {
  const groupedData: { [key: string]: any[] } = {};

  checkedData.forEach((item) => {
    const topic = item.topic; 

    if (!groupedData[topic]) {
      groupedData[topic] = [];
    }
    
    groupedData[topic].push(item);
  });

  return groupedData;
}
