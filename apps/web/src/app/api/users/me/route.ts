import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextResponse, NextRequest } from 'next/server';
import { getDataFromToken } from "@/helpers/getToken";

connect();

export const dynamic = 'force-dynamic'; // Tell Next.js this is a dynamic route

export async function GET(request: NextRequest) {
    try {
        const userId = getDataFromToken(request);
        if (!userId) {
            return NextResponse.json(
                { error: "Authentication required", success: false },
                { status: 401 }
            );
        }
        const user = await User.findById(userId).select("-password").lean();
        if (!user) {
            return NextResponse.json(
                { error: "Invalid Token", success: false },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { message: "User Found", user },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Authentication required", success: false },
            { status: 401 }
        );
    }
}
