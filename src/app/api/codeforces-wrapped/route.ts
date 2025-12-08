import { NextRequest, NextResponse } from "next/server";
import { generateContentWithConfig } from "@/lib/gemini";

async function fetchCFData(handle: string) {
  // Fetch user info
  const userInfoRes = await fetch(
    `https://codeforces.com/api/user.info?handles=${handle}`
  );
  const userInfoData = await userInfoRes.json();

  if (userInfoData.status !== "OK") {
    throw new Error("User not found on Codeforces");
  }

  const user = userInfoData.result[0];

  // Fetch rating history
  const ratingRes = await fetch(
    `https://codeforces.com/api/user.rating?handle=${handle}`
  );
  const ratingData = await ratingRes.json();
  const ratings = ratingData.status === "OK" ? ratingData.result : [];

  // Fetch submissions
  const submissionsRes = await fetch(
    `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=10000`
  );
  const submissionsData = await submissionsRes.json();
  const submissions = submissionsData.status === "OK" ? submissionsData.result : [];

  return { user, ratings, submissions };
}

function analyzeStats(data: { user: any; ratings: any[]; submissions: any[] }) {
  const { user, ratings, submissions } = data;
  const currentYear = new Date().getFullYear();

  // Filter 2024 data
  const ratings2024 = ratings.filter((r) => {
    const date = new Date(r.ratingUpdateTimeSeconds * 1000);
    return date.getFullYear() === currentYear;
  });

  const submissions2024 = submissions.filter((s) => {
    const date = new Date(s.creationTimeSeconds * 1000);
    return date.getFullYear() === currentYear;
  });

  // Rating change in 2024
  let ratingChange = 0;
  if (ratings2024.length > 0) {
    const firstRating = ratings2024[0].oldRating;
    const lastRating = ratings2024[ratings2024.length - 1].newRating;
    ratingChange = lastRating - firstRating;
  }

  // Contests participated
  const contestsParticipated = ratings2024.length;

  // Best/worst/avg rank
  let bestContestRank = Infinity;
  let worstContestRank = 0;
  let totalRank = 0;
  ratings2024.forEach((r) => {
    if (r.rank < bestContestRank) bestContestRank = r.rank;
    if (r.rank > worstContestRank) worstContestRank = r.rank;
    totalRank += r.rank;
  });
  const avgContestRank = contestsParticipated > 0 
    ? Math.round(totalRank / contestsParticipated) 
    : 0;
  if (bestContestRank === Infinity) bestContestRank = 0;

  // Problems solved (unique accepted)
  const solvedProblems = new Set<string>();
  const tagCounts: Record<string, number> = {};
  const difficultyCounts: Record<string, number> = {};
  let accepted = 0;
  let wrongAnswer = 0;
  let tle = 0;

  submissions2024.forEach((s) => {
    const problemId = `${s.problem.contestId}-${s.problem.index}`;
    
    if (s.verdict === "OK") {
      accepted++;
      if (!solvedProblems.has(problemId)) {
        solvedProblems.add(problemId);
        
        // Count tags
        s.problem.tags?.forEach((tag: string) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
        
        // Count difficulty
        const rating = s.problem.rating || "unrated";
        difficultyCounts[rating] = (difficultyCounts[rating] || 0) + 1;
      }
    } else if (s.verdict === "WRONG_ANSWER") {
      wrongAnswer++;
    } else if (s.verdict === "TIME_LIMIT_EXCEEDED") {
      tle++;
    }
  });

  // Favorite tag
  const favoriteTag = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)[0]?.[0] || "implementation";

  // Solved by difficulty
  const solvedByDifficulty = Object.entries(difficultyCounts)
    .filter(([rating]) => rating !== "unrated")
    .sort(([a], [b]) => parseInt(a) - parseInt(b))
    .map(([rating, count]) => ({ rating, count }));

  return {
    handle: user.handle,
    rating: user.rating || 0,
    maxRating: user.maxRating || 0,
    rank: user.rank || "newbie",
    maxRank: user.maxRank || "newbie",
    contribution: user.contribution || 0,
    friendOfCount: user.friendOfCount || 0,
    avatar: user.avatar || user.titlePhoto,
    problemsSolved: solvedProblems.size,
    contestsParticipated,
    bestContestRank,
    worstContestRank,
    avgContestRank,
    ratingChange,
    favoriteTag,
    solvedByDifficulty,
    submissionStats: {
      total: submissions2024.length,
      accepted,
      wrongAnswer,
      tle,
    },
  };
}

async function generateCreativeContent(stats: any) {
  const prompt = `You are generating fun, engaging content for a Codeforces Wrapped (like Spotify Wrapped but for competitive programmers).

User's Codeforces stats:
- Handle: ${stats.handle}
- Rating: ${stats.rating} (${stats.rank})
- Max Rating: ${stats.maxRating} (${stats.maxRank})
- Problems Solved: ${stats.problemsSolved}
- Contests: ${stats.contestsParticipated}
- Best Rank: ${stats.bestContestRank}
- Rating Change: ${stats.ratingChange >= 0 ? '+' : ''}${stats.ratingChange}
- Favorite Tag: ${stats.favoriteTag}

Generate creative content in JSON format:
{
  "creativeTaglines": {
    "welcome": "Short welcome message about their CP journey",
    "rating": "Comment about their rating progress",
    "contests": "Comment about contest participation",
    "problems": "Comment about problem solving",
    "personality": "Fun personality assessment",
    "share": "Encouraging share message"
  },
  "funFacts": [
    "3 fun facts about their stats"
  ],
  "coderTitle": "A fun title like 'Rating Grinder', 'Contest Warrior', 'Problem Crusher' etc based on stats"
}

Be witty but not mean. Keep taglines under 80 characters. Be encouraging. Return ONLY valid JSON.`;

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
      welcome: `${stats.problemsSolved} problems crushed. You're on fire!`,
      rating: `Rating ${stats.ratingChange >= 0 ? 'up' : 'down'} by ${Math.abs(stats.ratingChange)}. Keep grinding!`,
      contests: `${stats.contestsParticipated} contests joined. That's dedication!`,
      problems: `${stats.favoriteTag} is definitely your jam.`,
      personality: `A true competitive programmer at heart.`,
      share: `Show off your CP stats!`,
    },
    funFacts: [
      `You solved ${stats.problemsSolved} problems this year!`,
      `Your best contest rank was ${stats.bestContestRank}.`,
      `${stats.favoriteTag} problems are your specialty.`,
    ],
    coderTitle: stats.rating >= 1900 ? "Contest Master" : stats.rating >= 1400 ? "Rising Star" : "Problem Solver",
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { handle } = body;

    if (!handle) {
      return NextResponse.json(
        { error: "Handle is required" },
        { status: 400 }
      );
    }

    const data = await fetchCFData(handle);
    const stats = analyzeStats(data);
    const creative = await generateCreativeContent(stats);

    return NextResponse.json({
      ...stats,
      creativeTaglines: creative.creativeTaglines,
      funFacts: creative.funFacts,
      coderTitle: creative.coderTitle,
    });
  } catch (error: any) {
    console.error("CF Wrapped error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate Codeforces Wrapped" },
      { status: error.message?.includes("not found") ? 404 : 500 }
    );
  }
}
