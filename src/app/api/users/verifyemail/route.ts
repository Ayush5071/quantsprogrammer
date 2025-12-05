import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import {NextResponse,NextRequest} from 'next/server'

connect();
export async function POST(request:NextRequest){
    try {
        const reqBody = await request.json();
        const {token} = reqBody;
        
        // Input validation
        if (!token) {
            return NextResponse.json({
                error: "Verification token is required."
            }, { status: 400 });
        }
        
        console.log(token,"--> Got the Token");
        
        const user = await User.findOne({
            verifyToken: token,
            verifyTokenExpiry: {$gt: Date.now()}
        });
        
        console.log("Found User ->", user);

        if(!user){
            return NextResponse.json({
                error: "This verification link is invalid or has expired. Please use 'Resend Verification' to get a new link."
            }, { status: 400 });            
        }

        // Check if already verified
        if (user.isVerified) {
            return NextResponse.json({
                message: "Your email is already verified. You can login now.",
                success: true
            }, { status: 200 });
        }

        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;

        await user.save();

        console.log("new user",user)

        return NextResponse.json({
            message: "Email verified successfully! You can now login to your account.",
            success: true
        }, { status: 200 });
        
    } catch (error: any) {
        console.error("❌ Email verification error:", error);
        
        // Handle network/connection errors
        if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
            return NextResponse.json({
                error: "Database connection failed. Please check your internet connection and try again."
            }, { status: 503 });
        }
        
        return NextResponse.json({
            error: "An unexpected error occurred during email verification. Please try again."
        }, { status: 500 });
    }
}