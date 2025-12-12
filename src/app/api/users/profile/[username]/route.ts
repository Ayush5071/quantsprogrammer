import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import User from '@/models/userModel';
import { getCache, setCache } from '@/lib/server/cache';
import { getDataFromToken } from '@/helpers/getToken';

connect();

// GET - Get public profile by username/slug with caching and private-profile handling
export async function GET(request: NextRequest, { params }: { params: { username: string } }) {
  try {
    const username = params.username?.toString();
    if (!username) return NextResponse.json({ error: 'username required' }, { status: 400 });

    const cacheKey = `public:profile:${username.toLowerCase()}`;
    const cached = getCache<any>(cacheKey);
    if (cached) return NextResponse.json({ success: true, profile: cached });

    // Find user by username or profileSlug (case-insensitive)
    const user = await User.findOne({
      $or: [
        { username: new RegExp(`^${username}$`, 'i') },
        { profileSlug: new RegExp(`^${username}$`, 'i') },
      ],
    }).select('username fullName profilePhoto bio college age gender linkedIn twitter portfolio codingProfiles isPublicProfile createdAt');

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Allow private profile if the viewer is the owner
    let viewerId: string | null = null;
    try {
      viewerId = getDataFromToken(request);
    } catch (err) { viewerId = null; }
    if (!user.isPublicProfile) {
      if (!viewerId || viewerId !== user._id.toString()) {
        return NextResponse.json({ error: 'This profile is private' }, { status: 403 });
      }
    }

    // Calculate totals and connected platforms
    const codingProfiles = user.codingProfiles || {};
    let totalProblemsSolved = 0;
    if (codingProfiles.leetcode?.connected) totalProblemsSolved += codingProfiles.leetcode.stats?.totalSolved || 0;
    if (codingProfiles.codeforces?.connected) totalProblemsSolved += codingProfiles.codeforces.stats?.problemsSolved || 0;
    if (codingProfiles.codechef?.connected) totalProblemsSolved += codingProfiles.codechef.stats?.problemsSolved || 0;

    const connectedPlatforms = Object.values(codingProfiles).filter((p: any) => p?.connected).length;

    const profile = {
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
    };

    setCache(cacheKey, profile, 5 * 60 * 1000);
    return NextResponse.json({ success: true, profile });
  } catch (error: any) {
    console.error('Error fetching public profile:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}
