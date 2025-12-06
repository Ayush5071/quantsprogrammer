import {connect} from "@/dbConfig/dbConfig";
import { sendEmail } from "@/helpers/mailer";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs"
import {NextResponse,NextRequest} from 'next/server'

connect();

export async function POST(request:NextRequest){
    try {
        const reqBody = await request.json();
        const {username,email,password} = reqBody;
        
        // Input validation
        if(!email || !password || !username){
            return NextResponse.json({error: "Please provide all required fields (username, email, password)"},{status:400});
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return NextResponse.json({error: "Please provide a valid email address"},{status:400});
        }

        // Password strength validation
        if(password.length < 6){
            return NextResponse.json({error: "Password must be at least 6 characters long"},{status:400});
        }

        console.log(reqBody);
        
        // Check if user already exists
        const existingUser = await User.findOne({email});
        if(existingUser){
            return NextResponse.json({error: "An account with this email already exists. Please login instead."},{status:400});
        }

        // Check if username is taken
        const existingUsername = await User.findOne({username});
        if(existingUsername){
            return NextResponse.json({error: "This username is already taken. Please choose another one."},{status:400});
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedpassword = await bcryptjs.hash(password,salt);

        // Admin check using env variable
        const adminEmails = process.env.ADMINS ? process.env.ADMINS.split(",") : [];
        const isAdmin = adminEmails.includes(email);
        const newUser = new User({
            username,
            email,
            password: hashedpassword,
            isAdmin,
        })

        const savedUser = await newUser.save();
        console.log(savedUser);

        try {
            await sendEmail({email,emailType: "VERIFY",userId: savedUser._id});
            return NextResponse.json({
                message:"Account created successfully! Please check your email to verify your account.",
                success:true,
                savedUser
            });
        } catch (emailError: any) {
            console.error("❌ Failed to send verification email:", emailError);
            // User is created but email failed - inform them to resend verification
            return NextResponse.json({
                message: "Account created successfully, but we couldn't send the verification email. Please use 'Resend Verification' to try again.",
                success: true,
                emailFailed: true,
                savedUser
            });
        }

    } catch (error:any) {
        console.error("❌ Signup error:", error);
        
        // Handle specific MongoDB errors
        if(error.code === 11000){
            return NextResponse.json({error: "An account with this email or username already exists"},{status: 400});
        }
        
        // Handle network/connection errors
        if(error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError'){
            return NextResponse.json({error: "Database connection failed. Please try again later."},{status: 503});
        }
        
        return NextResponse.json({error: "An unexpected error occurred during registration. Please try again."},{status: 500})        
    }
}