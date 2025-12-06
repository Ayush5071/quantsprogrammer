import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getToken";

export async function POST(request: NextRequest) {
  try {
    await connect();
    const userId = getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const updateFields = {
      fullName: body.fullName,
      address: body.address,
      age: body.age,
      college: body.college,
      gender: body.gender,
      contactNumber: body.contactNumber,
    };
    const user = await User.findByIdAndUpdate(userId, updateFields, { new: true });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
