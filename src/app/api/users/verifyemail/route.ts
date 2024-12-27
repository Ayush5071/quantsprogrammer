import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import {NextResponse,NextRequest} from 'next/server'

connect();
export async function POST(request:NextRequest){
    try {
        const reqBody = await request.json(); //same as req.body
        const {token} = reqBody;
        console.log(token,"--> Got the Token");
        
        const user = await User.findOne({verifyToken: token,
            verifyTokenExpiry: {$gt: Date.now()} // jo time stored h wo abhi ke time se jada to hona hi chahiye
        })
        console.log("Found User ->", user);

        if(!user){
            return NextResponse.json({error:"Invalid token details"},{
                status:400
            }) ;            
        }

        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;

        await user.save();

        console.log("new user",user)

        return NextResponse.json({message:"email verified successfully",success: true},{status:200});
        
    } catch (error: any) {
        return NextResponse.json({error:error.message},{
            status:500
        })              
    }
}