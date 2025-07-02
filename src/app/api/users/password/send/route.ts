import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";

connect();

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();
        console.log("email:", email);

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "Email does not exist." }, { status: 400 });
        }

        console.log("User found:", user);

        // Generate a reset token and set its expiry
        const resetToken = crypto.randomBytes(32).toString("hex");
        console.log("Reset token:", resetToken);

        user.forgotPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        user.forgotPasswordTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes

        await user.save();
        console.log("Updated user:", user);

        // Build the reset URL
        const resetUrl = `${process.env.DOMAIN}/auth/resetpassword?token=${resetToken}`;
        console.log("Reset URL:", resetUrl);

        // Create a transporter for nodemailer
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER, // Your Gmail address
                pass: process.env.EMAIL_PASS, // App-specific password
            },
        });

        console.log("Nodemailer transporter created.");

        // Email content
        const mailOptions = {
            from: process.env.EMAIL_USER, 
            to: email, 
            subject: "Reset Your Password - QuantsProgrammer", // Updated subject line
            text: `You requested to reset your password. Click the link to reset it: ${resetUrl}`,
            html: `
                <div style="background-color: #0f172a; color: #ffffff; padding: 20px; font-family: Arial, sans-serif; text-align: center;">
                    <div style="max-width: 600px; margin: auto; background-color: #1e293b; border-radius: 10px; overflow: hidden;">
                        <div style="padding: 20px;">
                            <h1 style="color: #22c55e; font-size: 28px; margin-bottom: 10px;">
                                QuantsProgrammer
                            </h1>
                            <p style="color: #94a3b8; font-size: 16px; margin-bottom: 20px;">
                                We're here to help you securely reset your password.
                            </p>
                        </div>
                        <div style="padding: 20px; text-align: center;">
                            <h2 style="color: #38bdf8; font-size: 22px; margin-bottom: 15px;">Password Reset Request</h2>
                            <p style="font-size: 16px; color: #e2e8f0; margin-bottom: 20px;">
                                We received a request to reset your password. If this was you, click the button below to reset your password:
                            </p>
                            <a href="${resetUrl}" 
                               style="display: inline-block; padding: 12px 24px; color: #ffffff; background: #6366f1; 
                                      border-radius: 5px; font-size: 16px; font-weight: bold; text-decoration: none; transition: 0.3s;">
                                Reset Password
                            </a>
                            <p style="color: #94a3b8; font-size: 14px; margin-top: 20px;">
                                If you did not make this request, you can safely ignore this email.
                            </p>
                            <p style="color: #94a3b8; font-size: 14px;">
                                <strong>Note:</strong> This link will expire in 15 minutes.
                            </p>
                        </div>
                        <div style="background-color: #0f172a; padding: 15px; text-align: center;">
                            <p style="color: #64748b; font-size: 12px;">
                                Need help? Contact us at support@quantsprogrammer.com
                            </p>
                            <p style="color: #64748b; font-size: 12px;">
                                Made with 💖 by the QuantsProgrammer Team
                            </p>
                        </div>
                    </div>
                </div>
            `,
        };
        

        console.log("Mail options prepared:", mailOptions);

        // Send the email
        const mailResponse = await transporter.sendMail(mailOptions);
        console.log("Mail response:", mailResponse);

        // Return success response
        return NextResponse.json({ message: "Password reset link sent to email." }, { status: 200 });
    } catch (error: any) {
        console.error("Error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
