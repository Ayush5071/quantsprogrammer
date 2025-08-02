import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextResponse, NextRequest } from 'next/server';
import { getDataFromToken } from "@/helpers/getToken";

connect();

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const userId = getDataFromToken(request);
        if (!userId) {
            return NextResponse.json(
                { error: "Authentication required", success: false },
                { status: 401 }
            );
        }

        // Additional security: Check referer to ensure request is from profile page
        const referer = request.headers.get('referer');
        if (!referer || (!referer.includes('/profile') && !referer.includes('/admin'))) {
            return NextResponse.json(
                { error: "Unauthorized access", success: false },
                { status: 403 }
            );
        }

        const user = await User.findById(userId).select("-password").lean();
        if (!user) {
            return NextResponse.json(
                { error: "User not found", success: false },
                { status: 404 }
            );
        }

        // Return detailed data only for legitimate profile/admin access
        const profileData = {
            id: (user as any)._id?.toString(),
            username: (user as any).username,
            email: (user as any).email, // Only for profile page
            isVerified: (user as any).isVerified,
            isAdmin: (user as any).isAdmin,
            completedRoadmaps: (user as any).completedRoadmaps || [],
            createdAt: (user as any).createdAt,
            updatedAt: (user as any).updatedAt
        };

        return NextResponse.json(
            { 
                message: "Profile data retrieved", 
                user: profileData,
                success: true 
            },
            { 
                status: 200,
                headers: {
                    'Cache-Control': 'private, no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
            }
        );
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Server error", success: false },
            { status: 500 }
        );
    }
}
