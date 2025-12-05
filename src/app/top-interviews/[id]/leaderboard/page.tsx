"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Trophy, Medal, Award, Crown, Menu, X } from "lucide-react";

export default function TopInterviewLeaderboardPage() {
  const params = useParams();
  const router = useRouter();
  const [attempts, setAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [interview, setInterview] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!params?.id) return;
    // Fetch interview details
    fetch(`/api/top-interviews`)
      .then(res => res.json())
      .then(data => {
        const found = data.find((i: any) => i._id === params.id);
        setInterview(found);
      });
    // Fetch attempts for this interview
    fetch(`/api/top-interviews/attempts?id=${params.id}`)
      .then(res => res.json())
      .then(data => setAttempts(data))
      .finally(() => setLoading(false));
  }, [params]);

  // Only show the highest score per user
  const uniqueAttempts = Object.values(
    attempts.reduce((acc: Record<string, any>, a: any) => {
      const userId = a.user?._id || a.user?.email || a.user;
      if (!acc[userId] || a.score > acc[userId].score) {
        acc[userId] = a;
      }
      return acc;
    }, {} as Record<string, any>)
  ).sort((a: any, b: any) => b.score - a.score || new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-300" />;
    if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />;
    return <span className="text-gray-500 font-mono">#{rank}</span>;
  };

  const getRankStyle = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-r from-yellow-500/20 to-amber-500/10 border-yellow-500/30";
    if (rank === 2) return "bg-gradient-to-r from-gray-400/10 to-gray-500/5 border-gray-400/20";
    if (rank === 3) return "bg-gradient-to-r from-amber-600/10 to-orange-500/5 border-amber-600/20";
    return "bg-white/5 border-white/5 hover:bg-white/10";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-400 text-sm">Loading leaderboard...</span>
        </div>
      </div>
    );
  }
  
  if (!interview) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
            <Trophy className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Interview Not Found</h2>
          <p className="text-gray-500 mb-4">Could not find the leaderboard for this interview.</p>
          <button
            onClick={() => router.push('/top-interviews')}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium"
          >
            Back to Interviews
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back</span>
            </button>
            
            <h1 className="text-lg font-semibold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="hidden sm:inline">Leaderboard</span>
            </h1>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-4">
              <button
                onClick={() => router.push('/top-interviews')}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                All Interviews
              </button>
              <button
                onClick={() => router.push(`/top-interviews/${params?.id}`)}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Attempt Interview
              </button>
            </nav>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <nav className="md:hidden pt-4 pb-2 flex flex-col gap-2 border-t border-white/5 mt-4">
              <button
                onClick={() => { router.push('/top-interviews'); setMobileMenuOpen(false); }}
                className="text-left py-2 text-gray-400 hover:text-white transition-colors"
              >
                All Interviews
              </button>
              <button
                onClick={() => { router.push(`/top-interviews/${params?.id}`); setMobileMenuOpen(false); }}
                className="text-left py-2 text-gray-400 hover:text-white transition-colors"
              >
                Attempt Interview
              </button>
            </nav>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Interview Info */}
        <div className="bg-[#111118] border border-white/5 rounded-2xl p-6 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">{interview.title}</h2>
          <p className="text-gray-400 text-sm">{interview.description}</p>
        </div>

        {/* Leaderboard */}
        <div className="bg-[#111118] border border-white/5 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-white/5">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              Top Performers
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {uniqueAttempts.length} participant{uniqueAttempts.length !== 1 ? 's' : ''}
            </p>
          </div>

          {uniqueAttempts.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Trophy className="w-8 h-8 text-blue-400" />
              </div>
              <h4 className="text-lg font-medium text-white mb-2">No attempts yet</h4>
              <p className="text-gray-500 text-sm mb-4">Be the first to attempt this interview!</p>
              <button
                onClick={() => router.push(`/top-interviews/${params?.id}`)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium"
              >
                Attempt Now
              </button>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {uniqueAttempts.map((a: any, i: number) => (
                <div
                  key={a._id}
                  className={`p-4 flex items-center gap-4 border-l-2 transition-all ${getRankStyle(i + 1)}`}
                >
                  {/* Rank */}
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                    {getRankIcon(i + 1)}
                  </div>

                  {/* User info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium truncate">
                      {a.user?.name || a.user?.email || "Anonymous User"}
                    </h4>
                    <p className="text-gray-500 text-xs">
                      {new Date(a.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <div className={`text-xl font-bold ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-amber-500' : 'text-blue-400'}`}>
                      {a.score}
                    </div>
                    <div className="text-xs text-gray-500">points</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
