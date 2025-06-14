import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextResponse, NextRequest } from 'next/server';

connect();

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    if (!id) {
        return NextResponse.json(
            { error: "User ID required" },
            { status: 400 }
        );
    }
    const user = await User.findById(id).select("-password").lean();
    if (!user) {
        return NextResponse.json(
            { error: "User not found" },
            { status: 404 }
        );
    }
    return NextResponse.json({ user });
}
