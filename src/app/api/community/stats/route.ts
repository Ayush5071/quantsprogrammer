import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextResponse } from "next/server";
import InterviewModel from "@/models/interviewModel";
import BlogModel from "@/models/blogModel";
import RoadmapModel from "@/models/roadmapModel";

// Connect to the database
connect();

// Cache for 5 minutes
let cachedStats: any = null;
let lastCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export async function GET() {
  try {
    // Check if we have cached data that's still valid
    const now = Date.now();
    if (cachedStats && (now - lastCacheTime) < CACHE_DURATION) {
      console.log("Returning cached community stats");
      return NextResponse.json({ 
        ...cachedStats, 
        cached: true,
        cacheAge: Math.floor((now - lastCacheTime) / 1000)
      });
    }

    console.log("Fetching fresh community stats from database");

    // Fetch real statistics from database
    const [userCount, interviewCount, blogCount, roadmapCount] = await Promise.all([
      User.countDocuments({}),
      InterviewModel.countDocuments({}),
      BlogModel.countDocuments({ status: 'published' }),
      RoadmapModel.countDocuments({})
    ]);

    // Calculate certificates earned (users with completed roadmaps)
    const usersWithCompletedRoadmaps = await User.countDocuments({
      'completedRoadmaps.0': { $exists: true }
    });

    // Get some sample activities (recent blogs and interviews)
    const recentBlogs = await BlogModel.find({ status: 'published' })
      .sort({ createdAt: -1 })
      .limit(2)
      .select('title author createdAt');

    const recentInterviews = await InterviewModel.find({})
      .sort({ createdAt: -1 })
      .limit(3)
      .select('createdAt');

    // Format the stats
    const stats = {
      activeUsers: userCount,
      totalInterviews: interviewCount,
      publishedBlogs: blogCount,
      availableRoadmaps: roadmapCount,
      certificatesEarned: usersWithCompletedRoadmaps,
      recentActivity: {
        blogs: recentBlogs,
        interviews: recentInterviews
      }
    };

    // Cache the results
    cachedStats = stats;
    lastCacheTime = now;

    console.log("Community stats fetched:", {
      activeUsers: userCount,
      totalInterviews: interviewCount,
      publishedBlogs: blogCount,
      availableRoadmaps: roadmapCount,
      certificatesEarned: usersWithCompletedRoadmaps
    });

    return NextResponse.json({ 
      ...stats, 
      cached: false,
      timestamp: now
    });

  } catch (error: any) {
    console.error("Error fetching community stats:", error.message);
    return NextResponse.json({ 
      error: "Failed to fetch community statistics",
      details: error.message 
    }, { status: 500 });
  }
}
