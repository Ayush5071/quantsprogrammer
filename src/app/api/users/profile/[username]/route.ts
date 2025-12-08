import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";

connect();

// GET - Get public profile by username/slug
export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;
    
    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    // Find user by username or profileSlug
    const user = await User.findOne({
      $or: [
        { username: username.toLowerCase() },
        { profileSlug: username.toLowerCase() },
      ],
    }).select(
      'username fullName profilePhoto bio college age gender linkedIn twitter portfolio codingProfiles isPublicProfile createdAt'
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.isPublicProfile) {
      return NextResponse.json({ error: "This profile is private" }, { status: 403 });
    }

    // Calculate total problems solved across all platforms
    const codingProfiles = user.codingProfiles || {};
    let totalProblemsSolved = 0;
    
    if (codingProfiles.leetcode?.connected) {
      totalProblemsSolved += codingProfiles.leetcode.stats?.totalSolved || 0;
    }
    if (codingProfiles.codeforces?.connected) {
      totalProblemsSolved += codingProfiles.codeforces.stats?.problemsSolved || 0;
    }
    if (codingProfiles.codechef?.connected) {
      totalProblemsSolved += codingProfiles.codechef.stats?.problemsSolved || 0;
    }

    // Get connected platforms count
    const connectedPlatforms = Object.values(codingProfiles).filter(
      (p: any) => p?.connected
    ).length;

    return NextResponse.json({
      success: true,
      profile: {
        username: user.username,
        fullName: user.fullName,
        profilePhoto: user.profilePhoto,
        bio: user.bio,
        college: user.college,
        age: user.age,
        gender: user.gender,
        linkedIn: user.linkedIn,
        twitter: user.twitter,
        portfolio: user.portfolio,
        codingProfiles: user.codingProfiles,
        memberSince: user.createdAt,
        stats: {
          totalProblemsSolved,
          connectedPlatforms,
          githubStars: codingProfiles.github?.stats?.totalStars || 0,
          githubRepos: codingProfiles.github?.stats?.publicRepos || 0,
          codeforcesRating: codingProfiles.codeforces?.stats?.rating || 0,
          leetcodeRanking: codingProfiles.leetcode?.stats?.ranking || 0,
        },
      },
    });
  } catch (error: any) {
    console.error("Error fetching public profile:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}
