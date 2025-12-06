import { connect } from "@/dbConfig/dbConfig";
import { sendEmail } from "@/helpers/mailer";
import User from "@/models/userModel";
import { NextResponse, NextRequest } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email } = reqBody;

    if (!email) {
      return NextResponse.json(
        { error: "Please provide your email address." },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "No account found with this email address." },
        { status: 404 }
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        { error: "Your email is already verified. You can login now." },
        { status: 400 }
      );
    }

    // Resend the verification email
    try {
      await sendEmail({ email, emailType: "VERIFY", userId: user._id });
      return NextResponse.json({
        message: "Verification email sent successfully! Please check your inbox.",
        success: true,
      });
    } catch (emailError: any) {
      console.error("❌ Failed to resend verification email:", emailError);
      return NextResponse.json({ 
        error: "Failed to send verification email. Please try again later or contact support." 
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error("❌ Resend verification error:", error);
    
    // Handle network/connection errors
    if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
      return NextResponse.json({ 
        error: "Database connection failed. Please check your internet connection and try again." 
      }, { status: 503 });
    }
    
    return NextResponse.json({ 
      error: "An unexpected error occurred. Please try again later." 
    }, { status: 500 });
  }
}
