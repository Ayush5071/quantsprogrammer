"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Trophy, 
  Medal, 
  Award, 
  Crown, 
  Menu, 
  X, 
  Users,
  Target,
  Clock,
  ChevronRight,
  Sparkles,
  Home
} from "lucide-react";

export default function TopInterviewLeaderboardPage() {
  const params = useParams();
  const router = useRouter();
  const [attempts, setAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [interview, setInterview] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!params?.id) return;
    fetch(`/api/top-interviews`)
      .then(res => res.json())
      .then(data => {
        const found = data.find((i: any) => i._id === params.id);
        setInterview(found);
      });
    fetch(`/api/top-interviews/attempts?id=${params.id}`)
      .then(res => res.json())
      .then(data => setAttempts(data))
      .finally(() => setLoading(false));
  }, [params]);

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
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-300" />;
    if (rank === 3) return <Award className="w-6 h-6 text-amber-600" />;
    return <span className="text-gray-400 font-mono text-lg">#{rank}</span>;
  };

  const getRankStyle = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-r from-yellow-500/10 to-amber-500/5 border-l-yellow-500";
    if (rank === 2) return "bg-gradient-to-r from-gray-400/10 to-gray-500/5 border-l-gray-400";
    if (rank === 3) return "bg-gradient-to-r from-amber-600/10 to-orange-500/5 border-l-amber-600";
    return "bg-white/[0.02] border-l-white/20 hover:bg-white/[0.04]";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-400">Loading leaderboard...</span>
        </div>
      </div>
    );
  }
  
  if (!interview) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-red-500/10 flex items-center justify-center">
            <Trophy className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Interview Not Found</h2>
          <p className="text-gray-400 mb-6">Could not find the leaderboard for this interview.</p>
          <Link
            href="/top-interviews"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-500 hover:to-indigo-500 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Interviews
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-600/5 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/5 rounded-full blur-[128px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <h1 className="text-lg font-bold text-white">Leaderboard</h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              <Link
                href="/"
                className="px-3 py-2 text-gray-400 hover:text-white text-sm hover:bg-white/5 rounded-lg transition-all flex items-center gap-1"
              >
                <Home className="w-4 h-4" />
                Home
              </Link>
              <Link
                href="/top-interviews"
                className="px-3 py-2 text-gray-400 hover:text-white text-sm hover:bg-white/5 rounded-lg transition-all"
              >
                All Interviews
              </Link>
              <Link
                href={`/top-interviews/${params?.id}`}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-blue-500 hover:to-indigo-500 transition-all"
              >
                Attempt Interview
              </Link>
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden pt-4 pb-2 border-t border-white/5 mt-3 space-y-1"
            >
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 text-gray-400 hover:text-white transition-colors"
              >
                <Home className="w-4 h-4" />
                Home
              </Link>
              <Link
                href="/top-interviews"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-gray-400 hover:text-white transition-colors"
              >
                All Interviews
              </Link>
              <Link
                href={`/top-interviews/${params?.id}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                Attempt Interview
              </Link>
            </motion.nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Interview Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#111118] to-[#0d0d14] border border-white/5 rounded-2xl p-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-xs text-yellow-400 font-medium uppercase tracking-wider">Top Interview</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">{interview.title}</h2>
              <p className="text-gray-400 text-sm line-clamp-2">{interview.description}</p>
            </div>
            <Link
              href={`/top-interviews/${params?.id}`}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all whitespace-nowrap"
            >
              Attempt Now
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/5">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
                <Users className="w-4 h-4" />
              </div>
              <div className="text-xl font-bold text-white">{uniqueAttempts.length}</div>
              <div className="text-xs text-gray-500">Participants</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
                <Target className="w-4 h-4" />
              </div>
              <div className="text-xl font-bold text-white">{uniqueAttempts[0]?.score || 0}</div>
              <div className="text-xs text-gray-500">Top Score</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
                <Clock className="w-4 h-4" />
              </div>
              <div className="text-xl font-bold text-white">{interview.questions?.length || 0}</div>
              <div className="text-xs text-gray-500">Questions</div>
            </div>
          </div>
        </motion.div>

        {/* Leaderboard Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#111118] border border-white/5 rounded-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-5 border-b border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Leaderboard</h3>
                  <p className="text-sm text-gray-500">Top performers ranked by score</p>
                </div>
              </div>
              <div className="text-sm text-gray-400">
                {uniqueAttempts.length} participant{uniqueAttempts.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {uniqueAttempts.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                <Trophy className="w-10 h-10 text-blue-400" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">No attempts yet</h4>
              <p className="text-gray-400 mb-6">Be the first to attempt this interview!</p>
              <Link
                href={`/top-interviews/${params?.id}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-500 hover:to-indigo-500 transition-all"
              >
                <Target className="w-4 h-4" />
                Attempt Now
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {/* Top 3 Podium for Desktop */}
              {uniqueAttempts.length >= 3 && (
                <div className="hidden sm:flex items-end justify-center gap-4 p-8 bg-gradient-to-b from-white/[0.02] to-transparent">
                  {/* 2nd Place */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col items-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-400/20 to-gray-500/10 border-2 border-gray-400/30 flex items-center justify-center mb-2">
                      <Medal className="w-8 h-8 text-gray-300" />
                    </div>
                    <div className="text-white font-medium text-sm truncate max-w-24">
                      {uniqueAttempts[1]?.user?.name?.split(' ')[0] || 'User'}
                    </div>
                    <div className="text-gray-400 text-lg font-bold">{uniqueAttempts[1]?.score}</div>
                    <div className="mt-2 w-20 h-16 bg-gray-400/10 rounded-t-lg flex items-center justify-center">
                      <span className="text-gray-400 font-bold text-xl">2</span>
                    </div>
                  </motion.div>

                  {/* 1st Place */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col items-center -mt-4"
                  >
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400/20 to-amber-500/10 border-2 border-yellow-400/50 flex items-center justify-center mb-2 shadow-lg shadow-yellow-500/20">
                      <Crown className="w-10 h-10 text-yellow-400" />
                    </div>
                    <div className="text-white font-medium truncate max-w-28">
                      {uniqueAttempts[0]?.user?.name?.split(' ')[0] || 'User'}
                    </div>
                    <div className="text-yellow-400 text-xl font-bold">{uniqueAttempts[0]?.score}</div>
                    <div className="mt-2 w-24 h-24 bg-yellow-500/10 rounded-t-lg flex items-center justify-center">
                      <span className="text-yellow-400 font-bold text-2xl">1</span>
                    </div>
                  </motion.div>

                  {/* 3rd Place */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col items-center"
                  >
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-600/20 to-orange-500/10 border-2 border-amber-600/30 flex items-center justify-center mb-2">
                      <Award className="w-7 h-7 text-amber-600" />
                    </div>
                    <div className="text-white font-medium text-sm truncate max-w-24">
                      {uniqueAttempts[2]?.user?.name?.split(' ')[0] || 'User'}
                    </div>
                    <div className="text-amber-500 text-lg font-bold">{uniqueAttempts[2]?.score}</div>
                    <div className="mt-2 w-16 h-12 bg-amber-600/10 rounded-t-lg flex items-center justify-center">
                      <span className="text-amber-600 font-bold text-lg">3</span>
                    </div>
                  </motion.div>
                </div>
              )}

              {/* Full List */}
              {uniqueAttempts.map((a: any, i: number) => (
                <motion.div
                  key={a._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`p-4 flex items-center gap-4 border-l-4 transition-all ${getRankStyle(i + 1)}`}
                >
                  {/* Rank */}
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                    {getRankIcon(i + 1)}
                  </div>

                  {/* User info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium truncate">
                      {a.user?.name || a.user?.email || "Anonymous User"}
                    </h4>
                    <p className="text-gray-500 text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(a.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-amber-500' : 'text-blue-400'}`}>
                      {a.score}
                    </div>
                    <div className="text-xs text-gray-500">points</div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Back Button for Mobile */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/top-interviews"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Interviews
          </Link>
        </div>
      </main>
    </div>
  );
}
