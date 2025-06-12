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
        // validation

        console.log(reqBody);
        
        const user = await User.findOne({email});
        if(user){
            return NextResponse.json({error: "user already exist"},{status:400});
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedpassword = await bcryptjs.hash(password,salt);

        const isAdmin = email === "ayusht5071@gmail.com";
        const newUser = new User({
            username,
            email,
            password: hashedpassword,
            isAdmin,
        })

        const savedUser = await newUser.save();
        console.log(savedUser);

        await sendEmail({email,emailType: "VERIFY",userId: savedUser._id});

        return NextResponse.json({message:"user registered successfully",success:true,savedUser});


    } catch (error:any) {
        return NextResponse.json({error: error.message},{status: 500})        
    }
}