import { NextResponse, NextRequest } from "next/server";

export const dynamic = 'force-dynamic';

// GET: Debug token and admin status
export async function GET(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  
  if (!token) {
    return NextResponse.json({
      hasToken: false,
      message: "No token found in cookies"
    });
  }

  try {
    // Decode JWT payload (middle part)
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    // Check admin emails from env
    const adminEmails = process.env.ADMINS ? process.env.ADMINS.split(",").map(e => e.trim().toLowerCase()) : [];
    const userEmail = payload.email?.trim().toLowerCase() || "";
    
    return NextResponse.json({
      hasToken: true,
      tokenPayload: {
        id: payload.id,
        email: payload.email,
        isAdmin: payload.isAdmin,
        exp: payload.exp,
        expiresAt: new Date(payload.exp * 1000).toISOString()
      },
      envCheck: {
        adminEmails: adminEmails,
        userEmailLower: userEmail,
        isInAdminList: adminEmails.includes(userEmail),
      },
      message: payload.isAdmin ? "Token has admin access" : "Token does NOT have admin access - please log out and log back in"
    });
  } catch (error: any) {
    return NextResponse.json({
      hasToken: true,
      error: "Failed to decode token",
      message: error.message
    });
  }
}
