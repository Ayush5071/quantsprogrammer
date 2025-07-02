import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

    console.log(reqBody);

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 400 }
      );
    }

    console.log(user, "---> user exists");

    // Check if the user is verified
    if (!user.isVerified) {
      return NextResponse.json(
        { error: "User is not verified. Please verify your email before logging in." },
        { status: 400 }
      );
    }

    // Validate password
    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json(
        { error: "Password does not match" },
        { status: 400 }
      );
    }

    // Admin check using env variable
    const adminEmails = process.env.ADMINS ? process.env.ADMINS.split(",") : [];
    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: adminEmails.includes(user.email) || user.isAdmin === true,
    };

    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: "1d" });

    const response = NextResponse.json({
      message: "User logged in successfully",
      success: true,
      user,
      token, // Add token to response body for client-side use
    });

    // Set cookie with proper options for security and accessibility
    response.cookies.set("token", token, {
      httpOnly: false, // Temporarily disabled for debugging
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 86400, // 1 day in seconds
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
