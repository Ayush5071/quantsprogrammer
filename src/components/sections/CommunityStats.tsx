import React, { useState, useEffect } from "react";

interface CommunityStatsData {
  activeUsers: number;
  totalInterviews: number;
  publishedBlogs: number;
  availableRoadmaps: number;
  certificatesEarned: number;
  cached?: boolean;
  cacheAge?: number;
}

const defaultStats = [
  {
    icon: "👥",
    number: "1,000+",
    label: "Active Learners",
    description: "Developers growing their skills",
    color: "from-blue-500 to-cyan-500",
    key: "activeUsers"
  },
  {
    icon: "🗺️",
    number: "25+",
    label: "Learning Roadmaps",
    description: "Covering all major tech stacks",
    color: "from-purple-500 to-pink-500",
    key: "availableRoadmaps"
  },
  {
    icon: "🤖",
    number: "5,000+",
    label: "Mock Interviews",
    description: "AI-powered practice sessions",
    color: "from-green-500 to-teal-500",
    key: "totalInterviews"
  },
  {
    icon: "🎓",
    number: "500+",
    label: "Certificates Earned",
    description: "Milestones achieved",
    color: "from-yellow-500 to-orange-500",
    key: "certificatesEarned"
  },
];

const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return `${Math.floor(num / 1000)}k+`;
  }
  return `${num}+`;
};

export default function CommunityStats() {
  const [statsData, setStatsData] = useState<CommunityStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommunityStats = async () => {
      try {
        const response = await fetch('/api/community/stats');
        if (!response.ok) {
          throw new Error('Failed to fetch community stats');
        }
        const data = await response.json();
        setStatsData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching community stats:', err);
        setError('Failed to load community statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityStats();
  }, []);

  const getStatValue = (key: string): string => {
    if (!statsData) return defaultStats.find(s => s.key === key)?.number || "0";
    
    const value = statsData[key as keyof CommunityStatsData] as number;
    return formatNumber(value || 0);
  };

  return (
    <section className="w-full py-20 px-4 md:px-8 flex flex-col items-center">
      <h2 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-6 text-center">
        Join a Thriving Community
      </h2>
      <p className="text-lg md:text-xl text-zinc-300 text-center max-w-3xl mb-16 font-medium">
        {loading ? "Loading community statistics..." : 
         error ? "Join thousands of developers accelerating their careers" :
         `${statsData?.activeUsers || 0}+ developers are already accelerating their careers with Dev Roadmap`}
      </p>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl mb-16">
        {defaultStats.map((stat, index) => (
          <div
            key={stat.label}
            className="group text-center p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/25"
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            <div className="text-4xl md:text-5xl mb-4">{stat.icon}</div>
            <div className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
              {loading ? "..." : getStatValue(stat.key)}
            </div>
            <h3 className="text-lg md:text-xl font-bold text-white mb-1">
              {stat.label}
            </h3>
            <p className="text-sm md:text-base text-zinc-400">
              {stat.description}
            </p>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 max-w-md mx-auto">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Join?</h3>
          <p className="text-zinc-300 mb-6">
            Start your developer journey today and become part of our growing community.
          </p>
          <button 
            onClick={() => window.location.href = '/auth/signup'}
            className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Join the Community
          </button>
          {statsData?.cached && (
            <p className="text-xs text-zinc-500 mt-2">
              Statistics cached {statsData.cacheAge}s ago
            </p>
          )}
        </div>
      </div>
    </section>
  );
}