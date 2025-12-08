import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { getDataFromToken } from "@/helpers/getToken";

connect();

// Fetch GitHub stats
async function fetchGitHubStats(username: string) {
  try {
    const userRes = await fetch(`https://api.github.com/users/${username}`, {
      headers: { 
        'Accept': 'application/vnd.github.v3+json',
        ...(process.env.GITHUB_TOKEN ? { 'Authorization': `token ${process.env.GITHUB_TOKEN}` } : {})
      },
    });
    
    if (!userRes.ok) return null;
    const user = await userRes.json();

    // Fetch repos to calculate stars
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, {
      headers: { 
        'Accept': 'application/vnd.github.v3+json',
        ...(process.env.GITHUB_TOKEN ? { 'Authorization': `token ${process.env.GITHUB_TOKEN}` } : {})
      },
    });
    const repos = reposRes.ok ? await reposRes.json() : [];
    const totalStars = Array.isArray(repos) ? repos.reduce((acc: number, repo: any) => acc + (repo.stargazers_count || 0), 0) : 0;

    // Estimate commits (GitHub API doesn't provide total commits easily)
    const eventsRes = await fetch(`https://api.github.com/users/${username}/events?per_page=100`, {
      headers: { 
        'Accept': 'application/vnd.github.v3+json',
        ...(process.env.GITHUB_TOKEN ? { 'Authorization': `token ${process.env.GITHUB_TOKEN}` } : {})
      },
    });
    const events = eventsRes.ok ? await eventsRes.json() : [];
    const pushEvents = Array.isArray(events) ? events.filter((e: any) => e.type === 'PushEvent') : [];
    const totalCommits = pushEvents.reduce((acc: number, e: any) => acc + (e.payload?.commits?.length || 0), 0);

    return {
      totalCommits: totalCommits * 10, // Estimate (recent events only)
      totalStars,
      publicRepos: user.public_repos || 0,
      followers: user.followers || 0,
      avatarUrl: user.avatar_url,
      name: user.name,
      bio: user.bio,
    };
  } catch (error) {
    console.error("GitHub fetch error:", error);
    return null;
  }
}

// Fetch LeetCode stats
async function fetchLeetCodeStats(username: string) {
  try {
    const query = `
      query userProfile($username: String!) {
        matchedUser(username: $username) {
          username
          profile {
            ranking
          }
          submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
            }
          }
        }
      }
    `;

    const res = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { username } }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    const user = data?.data?.matchedUser;
    if (!user) return null;

    const submissions = user.submitStatsGlobal?.acSubmissionNum || [];
    const easy = submissions.find((s: any) => s.difficulty === 'Easy')?.count || 0;
    const medium = submissions.find((s: any) => s.difficulty === 'Medium')?.count || 0;
    const hard = submissions.find((s: any) => s.difficulty === 'Hard')?.count || 0;

    return {
      totalSolved: easy + medium + hard,
      easySolved: easy,
      mediumSolved: medium,
      hardSolved: hard,
      ranking: user.profile?.ranking || 0,
    };
  } catch (error) {
    console.error("LeetCode fetch error:", error);
    return null;
  }
}

// Fetch Codeforces stats
async function fetchCodeforcesStats(username: string) {
  try {
    const userRes = await fetch(`https://codeforces.com/api/user.info?handles=${username}`);
    if (!userRes.ok) return null;
    const userData = await userRes.json();
    if (userData.status !== 'OK') return null;
    const user = userData.result[0];

    // Fetch submissions for problems solved count
    const subsRes = await fetch(`https://codeforces.com/api/user.status?handle=${username}&from=1&count=10000`);
    const subsData = subsRes.ok ? await subsRes.json() : { result: [] };
    const submissions = subsData.status === 'OK' ? subsData.result : [];
    
    // Count unique problems solved
    const solvedProblems = new Set();
    submissions.forEach((sub: any) => {
      if (sub.verdict === 'OK') {
        solvedProblems.add(`${sub.problem.contestId}-${sub.problem.index}`);
      }
    });

    // Fetch rating history for contests count
    const ratingRes = await fetch(`https://codeforces.com/api/user.rating?handle=${username}`);
    const ratingData = ratingRes.ok ? await ratingRes.json() : { result: [] };
    const contests = ratingData.status === 'OK' ? ratingData.result.length : 0;

    return {
      rating: user.rating || 0,
      maxRating: user.maxRating || 0,
      rank: user.rank || 'unrated',
      problemsSolved: solvedProblems.size,
      contestsParticipated: contests,
    };
  } catch (error) {
    console.error("Codeforces fetch error:", error);
    return null;
  }
}

// Fetch CodeChef stats
async function fetchCodeChefStats(username: string) {
  try {
    // CodeChef doesn't have an official API, using unofficial endpoint
    const res = await fetch(`https://codechef-api.vercel.app/handle/${username}`);
    if (!res.ok) return null;
    const data = await res.json();

    if (data.success === false) return null;

    return {
      rating: data.currentRating || 0,
      stars: data.stars ? parseInt(data.stars) : 0,
      globalRank: data.globalRank || 0,
      problemsSolved: data.fullysolvedcount || 0,
    };
  } catch (error) {
    console.error("CodeChef fetch error:", error);
    return null;
  }
}

// GET - Get user's coding profiles
export async function GET(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await User.findById(userId).select('codingProfiles');
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      codingProfiles: user.codingProfiles || {} 
    });
  } catch (error: any) {
    console.error("Error fetching coding profiles:", error);
    return NextResponse.json({ error: "Failed to fetch profiles" }, { status: 500 });
  }
}

// POST - Connect a coding profile
export async function POST(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { platform, username } = await request.json();
    
    if (!platform || !username) {
      return NextResponse.json({ error: "Platform and username are required" }, { status: 400 });
    }

    const validPlatforms = ['github', 'leetcode', 'codeforces', 'codechef'];
    if (!validPlatforms.includes(platform)) {
      return NextResponse.json({ error: "Invalid platform" }, { status: 400 });
    }

    // Fetch stats from the platform
    let stats = null;
    switch (platform) {
      case 'github':
        stats = await fetchGitHubStats(username);
        break;
      case 'leetcode':
        stats = await fetchLeetCodeStats(username);
        break;
      case 'codeforces':
        stats = await fetchCodeforcesStats(username);
        break;
      case 'codechef':
        stats = await fetchCodeChefStats(username);
        break;
    }

    if (!stats) {
      return NextResponse.json({ 
        error: `Could not verify ${platform} username. Please check and try again.` 
      }, { status: 400 });
    }

    // Update user's coding profile
    const updatePath = `codingProfiles.${platform}`;
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          [updatePath]: {
            username,
            connected: true,
            stats,
            lastUpdated: new Date(),
          },
        },
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: `${platform} profile connected successfully!`,
      profile: user.codingProfiles[platform],
    });
  } catch (error: any) {
    console.error("Error connecting coding profile:", error);
    return NextResponse.json({ error: "Failed to connect profile" }, { status: 500 });
  }
}

// DELETE - Disconnect a coding profile
export async function DELETE(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform');

    if (!platform) {
      return NextResponse.json({ error: "Platform is required" }, { status: 400 });
    }

    const updatePath = `codingProfiles.${platform}`;
    await User.findByIdAndUpdate(userId, {
      $set: {
        [updatePath]: {
          username: null,
          connected: false,
          stats: {},
          lastUpdated: null,
        },
      },
    });

    return NextResponse.json({ success: true, message: "Profile disconnected" });
  } catch (error: any) {
    console.error("Error disconnecting profile:", error);
    return NextResponse.json({ error: "Failed to disconnect" }, { status: 500 });
  }
}

// PUT - Refresh stats for a platform
export async function PUT(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { platform } = await request.json();
    
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const profile = user.codingProfiles?.[platform];
    if (!profile?.connected || !profile?.username) {
      return NextResponse.json({ error: "Profile not connected" }, { status: 400 });
    }

    // Fetch fresh stats
    let stats = null;
    switch (platform) {
      case 'github':
        stats = await fetchGitHubStats(profile.username);
        break;
      case 'leetcode':
        stats = await fetchLeetCodeStats(profile.username);
        break;
      case 'codeforces':
        stats = await fetchCodeforcesStats(profile.username);
        break;
      case 'codechef':
        stats = await fetchCodeChefStats(profile.username);
        break;
    }

    if (!stats) {
      return NextResponse.json({ error: "Failed to fetch updated stats" }, { status: 500 });
    }

    const updatePath = `codingProfiles.${platform}`;
    await User.findByIdAndUpdate(userId, {
      $set: {
        [`${updatePath}.stats`]: stats,
        [`${updatePath}.lastUpdated`]: new Date(),
      },
    });

    return NextResponse.json({ success: true, stats });
  } catch (error: any) {
    console.error("Error refreshing stats:", error);
    return NextResponse.json({ error: "Failed to refresh" }, { status: 500 });
  }
}
