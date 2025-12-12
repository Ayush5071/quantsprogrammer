"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ProfileSummary } from "./profile-summary";
import { StatsCards } from "./stats-cards";
import { CodingHeatmap } from "./heatmap";
import { LanguageBarChart } from "./language-chart";
import { Github, Code2, Award, Zap, Flame, Star, BookOpen, BarChart3, Target } from "lucide-react";

const platformColors: Record<string, string> = {
  github: "from-gray-900 to-gray-800",
  leetcode: "from-orange-900 to-yellow-800",
  codeforces: "from-blue-900 to-purple-900",
  codechef: "from-amber-900 to-orange-900",
  hackerrank: "from-green-700 to-green-500",
  hackerearth: "from-cyan-700 to-blue-700",
};

const CodingDashboardPage = ({ params }: { params: { username: string } }) => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/users/profile/${params.username}`);
        setProfile(res.data.profile);
      } catch {
        setProfile(null);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [params.username]);

  // Combine stats for cards
  const stats = [];
  // aggregated total solved
  let totalSolved = 0;
  ['leetcode','codeforces','codechef','hackerrank','hackerearth'].forEach((p)=>{
    const st = (profile?.codingProfiles as any)?.[p]?.stats;
    if (st && st.totalSolved) totalSolved += st.totalSolved;
    if (st && st.problemsSolved) totalSolved += st.problemsSolved;
  });
  if (totalSolved > 0) {
    stats.push({ title: "Total Solved", value: totalSolved, icon: <Code2 className="w-6 h-6 text-white" />, color: "from-indigo-700 to-purple-700" });
  }
  if (profile?.codingProfiles?.github?.stats) {
    stats.push({
      title: "GitHub Repos",
      value: profile.codingProfiles.github.stats.publicRepos,
      icon: <Github className="w-6 h-6 text-white" />,
      color: platformColors.github,
    });
    stats.push({
      title: "GitHub Stars",
      value: profile.codingProfiles.github.stats.totalStars,
      icon: <Star className="w-6 h-6 text-yellow-400" />,
      color: platformColors.github,
    });
  }
  if (profile?.codingProfiles?.leetcode?.stats) {
    stats.push({
      title: "LeetCode Solved",
      value: profile.codingProfiles.leetcode.stats.totalSolved,
      icon: <Code2 className="w-6 h-6 text-orange-400" />,
      color: platformColors.leetcode,
    });
  }
  if (profile?.codingProfiles?.codeforces?.stats) {
    stats.push({
      title: "CF Rating",
      value: profile.codingProfiles.codeforces.stats.rating,
      icon: <Flame className="w-6 h-6 text-blue-400" />,
      color: platformColors.codeforces,
    });
    stats.push({
      title: "CF Solved",
      value: profile.codingProfiles.codeforces.stats.problemsSolved,
      icon: <BookOpen className="w-6 h-6 text-purple-400" />,
      color: platformColors.codeforces,
    });
  }
  if (profile?.codingProfiles?.codechef?.stats) {
    stats.push({
      title: "CodeChef Rating",
      value: profile.codingProfiles.codechef.stats.rating,
      icon: <Award className="w-6 h-6 text-amber-400" />,
      color: platformColors.codechef,
    });
    stats.push({
      title: "CodeChef Solved",
      value: profile.codingProfiles.codechef.stats.problemsSolved,
      icon: <Zap className="w-6 h-6 text-orange-400" />,
      color: platformColors.codechef,
    });
  }
  if (profile?.codingProfiles?.hackerrank?.stats) {
    stats.push({
      title: "HackerRank Solved",
      value: profile.codingProfiles.hackerrank.stats.problemsSolved,
      icon: <Zap className="w-6 h-6 text-green-400" />,
      color: "from-green-700 to-green-500",
    });
  }
  if (profile?.codingProfiles?.hackerearth?.stats) {
    stats.push({
      title: "HackerEarth Solved",
      value: profile.codingProfiles.hackerearth.stats.problemsSolved,
      icon: <Target className="w-6 h-6 text-cyan-400" />,
      color: "from-cyan-700 to-blue-700",
    });
  }

  // Example heatmap data (replace with real data from API if available)
  const githubHeatmap = [
    { day: "2025-12-01", value: 3 },
    { day: "2025-12-02", value: 1 },
    { day: "2025-12-03", value: 0 },
    { day: "2025-12-04", value: 5 },
    { day: "2025-12-05", value: 2 },
    { day: "2025-12-06", value: 4 },
    { day: "2025-12-07", value: 2 },
    // ...
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <span className="text-lg text-gray-400">Loading dashboard...</span>
          </div>
        ) : profile ? (
          <>
            {/* Profile summary from GitHub or fallback */}
            <ProfileSummary
              avatarUrl={profile.codingProfiles?.github?.stats?.avatarUrl || "/assets/default-avatar.png"}
              name={profile.codingProfiles?.github?.stats?.name || profile.fullName || profile.username}
              username={profile.username}
              college={profile.college}
              bio={profile.codingProfiles?.github?.stats?.bio}
              platform="GitHub"
            />

            {/* Stats cards */}
            <StatsCards stats={stats} />

            {/* Heatmaps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <CodingHeatmap
                  data={githubHeatmap}
                  from="2025-12-01"
                  to="2025-12-31"
                  platform="GitHub"
                  colors={["#065f46", "#10b981", "#34d399", "#86efac", "#bbf7d0"]}
                />
              {/* Add more heatmaps for other platforms if available */}
            </div>

            {/* Favorite languages, dev/coding persona, etc. */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-[#181825] border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-2">About This Developer</h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="mb-2 text-gray-300">Favorite Dev Language: <span className="font-semibold text-blue-400">{profile?.codingProfiles?.github?.topLanguages?.[0]?.language || 'JavaScript'}</span></div>
                  <div className="mb-2 text-gray-300">Favorite Coding Language: <span className="font-semibold text-orange-400">{profile?.codingProfiles?.leetcode?.stats?.ranking ? 'C++' : (profile?.codingProfiles?.codeforces?.stats?.rank || 'C++')}</span></div>
                  <div className="mb-2 text-gray-300">Persona: <span className="font-semibold text-green-400">More of a Dev Guy than a Competitive Coder</span></div>
                </div>
                <div className="flex-1">
                  <div className="mb-2 text-gray-300">Coding Since: <span className="font-semibold">{profile?.memberSince ? new Date(profile.memberSince).getFullYear() : '—'}</span></div>
                  <div className="mb-2 text-gray-300">Most Active Platform: <span className="font-semibold text-purple-400">GitHub</span></div>
                  <div className="mb-2 text-gray-300">Last Activity: <span className="font-semibold">{profile?.lastActivity || '—'}</span></div>
                </div>
              </div>
              {/* Languages chart */}
              <LanguageBarChart languages={profile?.codingProfiles?.github?.topLanguages || []} height={220} color="#34d399" />
            </div>
            </div>

            {/* More sections: charts, achievements, etc. */}
            <div className="bg-[#181825] border border-white/10 rounded-2xl p-6 mb-8">
              <h2 className="text-xl font-bold mb-2">Achievements & Highlights</h2>
              <ul className="list-disc pl-6 text-gray-300">
                <li>Open source contributor on GitHub</li>
                <li>Top 10% on LeetCode contests</li>
                <li>Codeforces Specialist</li>
                <li>CodeChef 3-star coder</li>
              </ul>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-96">
            <span className="text-lg text-red-400">User not found or no coding profiles connected.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodingDashboardPage;
