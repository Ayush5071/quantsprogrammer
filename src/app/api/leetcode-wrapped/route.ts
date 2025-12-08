import { NextRequest, NextResponse } from "next/server";
import { generateContentWithConfig } from "@/lib/gemini";

async function fetchLeetCodeData(username: string) {
  // LeetCode GraphQL API
  const query = `
    query userProfile($username: String!) {
      matchedUser(username: $username) {
        username
        profile {
          ranking
          userAvatar
          reputation
        }
        submitStats {
          acSubmissionNum {
            difficulty
            count
            submissions
          }
          totalSubmissionNum {
            difficulty
            count
            submissions
          }
        }
        badges {
          name
        }
        userCalendar {
          streak
          totalActiveDays
        }
        tagProblemCounts {
          advanced {
            tagName
            problemsSolved
          }
          intermediate {
            tagName
            problemsSolved
          }
          fundamental {
            tagName
            problemsSolved
          }
        }
      }
    }
  `;

  const response = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: { username },
    }),
  });

  const data = await response.json();

  if (!data.data?.matchedUser) {
    throw new Error("User not found on LeetCode");
  }

  return data.data.matchedUser;
}

function analyzeStats(user: any) {
  const acStats = user.submitStats?.acSubmissionNum || [];
  const totalStats = user.submitStats?.totalSubmissionNum || [];
  
  // Get solved counts by difficulty
  let easySolved = 0;
  let mediumSolved = 0;
  let hardSolved = 0;
  let totalSolved = 0;

  acStats.forEach((stat: any) => {
    if (stat.difficulty === "Easy") easySolved = stat.count;
    if (stat.difficulty === "Medium") mediumSolved = stat.count;
    if (stat.difficulty === "Hard") hardSolved = stat.count;
    if (stat.difficulty === "All") totalSolved = stat.count;
  });

  // Total submissions
  let totalSubmissions = 0;
  let totalAccepted = 0;
  totalStats.forEach((stat: any) => {
    if (stat.difficulty === "All") {
      totalSubmissions = stat.submissions;
    }
  });
  acStats.forEach((stat: any) => {
    if (stat.difficulty === "All") {
      totalAccepted = stat.submissions;
    }
  });

  const acceptanceRate = totalSubmissions > 0 
    ? Math.round((totalAccepted / totalSubmissions) * 100) 
    : 0;

  // Badges
  const badges = user.badges?.map((b: any) => b.name) || [];

  // Top topics
  const allTags = [
    ...(user.tagProblemCounts?.advanced || []),
    ...(user.tagProblemCounts?.intermediate || []),
    ...(user.tagProblemCounts?.fundamental || []),
  ];
  
  const recentTopics = allTags
    .sort((a: any, b: any) => b.problemsSolved - a.problemsSolved)
    .slice(0, 8)
    .map((t: any) => t.tagName);

  return {
    username: user.username,
    avatar: user.profile?.userAvatar || "",
    ranking: user.profile?.ranking || 0,
    totalSolved,
    easySolved,
    mediumSolved,
    hardSolved,
    acceptanceRate,
    contributionPoints: 0,
    reputation: user.profile?.reputation || 0,
    streak: user.userCalendar?.streak || 0,
    totalSubmissions,
    activeDays: user.userCalendar?.totalActiveDays || 0,
    badges,
    recentTopics,
  };
}

async function generateCreativeContent(stats: any) {
  const prompt = `You are generating fun content for a LeetCode Wrapped (like Spotify Wrapped but for coders).

User's LeetCode stats:
- Username: ${stats.username}
- Total Solved: ${stats.totalSolved}
- Easy: ${stats.easySolved}, Medium: ${stats.mediumSolved}, Hard: ${stats.hardSolved}
- Ranking: #${stats.ranking}
- Streak: ${stats.streak} days
- Active Days: ${stats.activeDays}
- Acceptance Rate: ${stats.acceptanceRate}%

Generate content in JSON format:
{
  "creativeTaglines": {
    "welcome": "Short welcome message",
    "problems": "Comment about problem solving",
    "difficulty": "Comment about difficulty distribution",
    "streak": "Comment about consistency",
    "personality": "Fun personality assessment",
    "share": "Encouraging share message"
  },
  "funFacts": [
    "3 fun facts about their stats"
  ],
  "coderTitle": "A title like 'Problem Crusher', 'Hard Hitter', 'Consistency King' etc based on stats"
}

Be witty but encouraging. Keep taglines under 60 characters. Return ONLY valid JSON.`;

  try {
    const text = await generateContentWithConfig(prompt, {
      temperature: 0.85,
      maxOutputTokens: 1000,
    });

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (error) {
    console.error("Gemini error:", error);
  }

  // Fallback
  return {
    creativeTaglines: {
      welcome: `${stats.totalSolved} problems solved. Impressive!`,
      problems: `You're crushing it with ${stats.mediumSolved} mediums!`,
      difficulty: stats.hardSolved > 50 ? `${stats.hardSolved} hards? You're a beast!` : `Keep pushing those hards!`,
      streak: stats.streak > 30 ? `${stats.streak} day streak! Legendary!` : `${stats.streak} days strong!`,
      personality: `A true problem solver at heart.`,
      share: `Show off your LeetCode grind!`,
    },
    funFacts: [
      `You solved ${stats.totalSolved} problems this year!`,
      `Your ${stats.hardSolved} hard solutions show real skill.`,
      `${stats.activeDays} active days of grinding!`,
    ],
    coderTitle: stats.hardSolved > 100 ? "Hard Problem Destroyer" : stats.totalSolved > 500 ? "Volume King" : "Rising Coder",
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username } = body;

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    const user = await fetchLeetCodeData(username);
    const stats = analyzeStats(user);
    const creative = await generateCreativeContent(stats);

    return NextResponse.json({
      ...stats,
      creativeTaglines: creative.creativeTaglines,
      funFacts: creative.funFacts,
      coderTitle: creative.coderTitle,
    });
  } catch (error: any) {
    console.error("LeetCode Wrapped error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate LeetCode Wrapped" },
      { status: error.message?.includes("not found") ? 404 : 500 }
    );
  }
}
