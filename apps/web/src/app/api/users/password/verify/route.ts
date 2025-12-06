import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import bcryptjs from "bcryptjs";

connect();

export async function POST(request: NextRequest) {
    try {
        const { token, newPassword, confirmPassword } = await request.json();

        // Input validation
        if (!token || !newPassword || !confirmPassword) {
            return NextResponse.json({ error: "Please provide all required fields." }, { status: 400 });
        }

        // Password validation
        if (newPassword.length < 6) {
            return NextResponse.json({ error: "Password must be at least 6 characters long." }, { status: 400 });
        }

        if (newPassword !== confirmPassword) {
            return NextResponse.json({ error: "Passwords do not match. Please try again." }, { status: 400 });
        }

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            forgotPasswordToken: hashedToken,
            forgotPasswordTokenExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return NextResponse.json({ 
                error: "This password reset link is invalid or has expired. Please request a new one." 
            }, { status: 400 });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedpassword = await bcryptjs.hash(newPassword,salt);

        user.password = hashedpassword;
        user.forgotPasswordToken = undefined;
        user.forgotPasswordTokenExpiry = undefined;

        await user.save();

        return NextResponse.json({ 
            message: "Your password has been reset successfully! You can now login with your new password." 
        }, { status: 200 });
    } catch (error: any) {
        console.error("❌ Password reset verification error:", error);
        
        // Handle network/connection errors
        if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
            return NextResponse.json({ 
                error: "Database connection failed. Please check your internet connection and try again." 
            }, { status: 503 });
        }
        
        return NextResponse.json({ 
            error: "An unexpected error occurred while resetting your password. Please try again." 
        }, { status: 500 });
    }
}
