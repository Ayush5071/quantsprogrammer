import User from '@/models/userModel';
import nodemailer from 'nodemailer';
import bcryptjs from "bcryptjs";

export const sendEmail = async ({ email, emailType, userId }: any) => {
    try {
        // Hash the userId as a token
        const hashedToken = await bcryptjs.hash(userId.toString(), 10);

        // Update the user with appropriate token and expiry
        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId, {
                verifyToken: hashedToken,
                verifyTokenExpiry: Date.now() + 3600000, // 1 hour expiry
            });
        }

        console.log("details getting at user -->", email, " ", emailType, " ",userId);

        // Create a transport instance for sending emails
        console.log("email and pass ->",process.env.EMAIL_USER,process.env.EMAIL_PASS);
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER, // Your Gmail address
                pass: process.env.EMAIL_PASS, // App-specific password
            },
        });

        console.log("transporter--->",transporter);
        console.log("token inside ->",hashedToken);


const mailOptions = {
    from: process.env.EMAIL_USER, 
    to: email, 
    subject: emailType === "VERIFY" ? "Verify Your Email with QuantsProgrammer" : "Reset Your Password on QuantsProgrammer", // Email subject
    html: `
        <div style="background-color: #000; color: #fff; padding: 20px; font-family: Arial, sans-serif; background-image: url('https://www.nasa.gov/sites/default/files/thumbnails/image/pia22810-16.jpg'); background-size: cover;">
            <div style="max-width: 600px; margin: auto; background-color: rgba(0, 0, 0, 0.8); border-radius: 10px; overflow: hidden;">
                <div style="padding: 20px; text-align: center;">
                    <h1 style="font-size: 32px; color: #00d8ff; margin-bottom: 10px;">QuantsProgrammer</h1>
                    <p style="font-size: 18px; color: #fff;">Exploring the universe of knowledge, one step at a time.</p>
                </div>
                <div style="padding: 20px; text-align: center;">
                    <h2 style="color: #00ff44; font-size: 24px; margin-bottom: 10px;">
                        ${emailType === "VERIFY" ? "Verify Your Email!" : "Reset Your Password!"}
                    </h2>
                    <p style="font-size: 16px; color: #fff; margin-bottom: 20px;">
                        We're excited to have you on board! Click the link below to ${emailType === 'VERIFY' ? 'verify your email' : 'reset your password'} 
                        and start exploring the platform.
                    </p>
                    <a href="${process.env.DOMAIN}/${emailType === 'VERIFY' ? 'verifyemail' : 'resetpassword'}?token=${hashedToken}" 
                       style="display: inline-block; text-decoration: none; color: #fff; background: linear-gradient(to right, #6a11cb, #2575fc); 
                              padding: 12px 20px; font-size: 16px; border-radius: 5px; font-weight: bold;">
                        ${emailType === 'VERIFY' ? 'Verify Now' : 'Reset Password'}
                    </a>
                    <p style="color: #ccc; font-size: 14px; margin-top: 10px;">
                        This link is valid for 1 hour. Once verified, you can log in and start exploring.
                    </p>
                </div>
                <div style="padding: 20px; text-align: center; background-color: #0b0b3b;">
                    <p style="color: #aaa; font-size: 14px; margin-bottom: 10px;">Made with 💖 by the QuantsProgrammer Team</p>
                    <p style="color: #aaa; font-size: 14px;">Explore knowledge, shape the future.</p>
                </div>
            </div>
        </div>
    `, 
};


        // Send the email
        console.log("now sending makil response");
        const mailResponse = await transporter.sendMail(mailOptions);
        console.log("it is mail response",mailResponse);
        return mailResponse;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
