"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  Trophy, Zap, Target, TrendingUp, Award, Star,
  Share2, Download, Twitter, Linkedin, Copy, Check,
  ChevronRight, ChevronLeft, Loader2, Calendar, Flame,
  ArrowLeft, Users, BarChart3, Clock, Medal
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import html2canvas from "html2canvas";
import {useRouter} from "next/navigation";
import useCurrentUser from "@/lib/useCurrentUser";

// Types
interface CFStats {
  handle: string;
  rating: number;
  maxRating: number;
  rank: string;
  maxRank: string;
  contribution: number;
  friendOfCount: number;
  avatar: string;
  problemsSolved: number;
  contestsParticipated: number;
  bestContestRank: number;
  worstContestRank: number;
  avgContestRank: number;
  ratingChange: number;
  favoriteTag: string;
  solvedByDifficulty: { rating: string; count: number }[];
  monthlyActivity: { month: string; count: number }[];
  submissionStats: {
    total: number;
    accepted: number;
    wrongAnswer: number;
    tle: number;
  };
  creativeTaglines: {
    welcome: string;
    rating: string;
    contests: string;
    problems: string;
    personality: string;
    share: string;
  };
  funFacts: string[];
  coderTitle: string;
}

// Codeforces rank colors
const getRankColor = (rank: string): string => {
  const colors: Record<string, string> = {
    "newbie": "#808080",
    "pupil": "#008000",
    "specialist": "#03a89e",
    "expert": "#0000ff",
    "candidate master": "#aa00aa",
    "master": "#ff8c00",
    "international master": "#ff8c00",
    "grandmaster": "#ff0000",
    "international grandmaster": "#ff0000",
    "legendary grandmaster": "#ff0000",
  };
  return colors[rank?.toLowerCase()] || "#808080";
};

// Loading messages
const loadingMessages = [
  "🔍 Fetching your CF profile...",
  "📊 Analyzing your submissions...",
  "🏆 Counting your contests...",
  "⚡ Calculating rating changes...",
  "🎯 Finding your favorite problems...",
  "✨ Generating insights...",
  "🚀 Almost there..."
];

export default function CodeForcesWrappedPage() {
  const [handle, setHandle] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
  const [stats, setStats] = useState<CFStats | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [copied, setCopied] = useState(false);
  const shareCardRef = React.useRef<HTMLDivElement>(null);
   const user = useCurrentUser();
  const router = useRouter();

  // Cycle loading messages
  useEffect(() => {
    if (loading) {
      let i = 0;
      const interval = setInterval(() => {
        i = (i + 1) % loadingMessages.length;
        setLoadingMessage(loadingMessages[i]);
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [loading]);

 if (user === undefined) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-400 text-sm">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // Not logged in - user is null when API returns 401
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-4">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
        </div>
        <div className="relative z-10 text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-blue-500/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">Login Required</h1>
          <p className="text-gray-400 text-sm mb-6">
            Sign in to access Codeforces Wrapped 2025.
          </p>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium rounded-lg transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Login to Continue
          </Link>
        </div>
      </div>
    );
  }



  // Fetch CF stats
  const fetchStats = async () => {
    if (!handle.trim()) {
      toast.error("Please enter a Codeforces handle");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/codeforces-wrapped", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle: handle.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch Codeforces stats");
      }

      setStats(data);
      setCurrentPage(1);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Navigation
  const nextPage = () => {
    if (currentPage < 6) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Share functions
  const copyShareLink = () => {
    const shareUrl = `${window.location.origin}/codeforces-wrapped?u=${stats?.handle}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnTwitter = () => {
    const text = `🏆 My Codeforces Wrapped 2025!\n\n📊 Rating: ${stats?.rating} (${stats?.rank})\n🎯 ${stats?.problemsSolved} problems solved\n⚔️ ${stats?.contestsParticipated} contests\n\nCheck yours at:`;
    const url = `${window.location.origin}/codeforces-wrapped`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank");
  };

  const shareOnLinkedIn = () => {
    const url = `${window.location.origin}/codeforces-wrapped`;
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank");
  };

  const downloadCard = async () => {
    if (shareCardRef.current) {
      try {
        const canvas = await html2canvas(shareCardRef.current, {
          backgroundColor: "#1a1a2e",
          scale: 2,
        });
        const link = document.createElement("a");
        link.download = `codeforces-wrapped-${stats?.handle}-2024.png`;
        link.href = canvas.toDataURL();
        link.click();
        toast.success("Card downloaded!");
      } catch (error) {
        toast.error("Failed to download card");
      }
    }
  };

  // Page variants
  const pageVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  const renderPage = () => {
    if (!stats) return null;
    const rankColor = getRankColor(stats.rank);

    switch (currentPage) {
      case 1:
        return (
          <motion.div
            key="page1"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="text-center space-y-6"
          >
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="relative inline-block"
            >
              <div 
                className="absolute inset-0 rounded-full blur-xl opacity-60"
                style={{ backgroundColor: rankColor }}
              />
              <img
                src={stats.avatar || `https://userpic.codeforces.org/no-avatar.jpg`}
                alt={stats.handle}
                className="w-28 h-28 rounded-full border-4 relative z-10"
                style={{ borderColor: rankColor }}
              />
            </motion.div>

            {/* Welcome */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-lg text-gray-400 mb-2">
                Hey <span style={{ color: rankColor }} className="font-bold">{stats.handle}</span>!
              </p>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Your Codeforces <span className="text-blue-500">2024</span>
              </h1>
              <p className="text-gray-500 max-w-lg mx-auto">
                {stats.creativeTaglines.welcome}
              </p>
            </motion.div>

            {/* Quick stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex justify-center gap-6 flex-wrap"
            >
              <div className="text-center px-4">
                <div className="text-3xl font-bold" style={{ color: rankColor }}>{stats.rating}</div>
                <div className="text-gray-500 text-sm">Rating</div>
              </div>
              <div className="text-center px-4">
                <div className="text-3xl font-bold text-blue-400">{stats.problemsSolved}</div>
                <div className="text-gray-500 text-sm">Problems</div>
              </div>
              <div className="text-center px-4">
                <div className="text-3xl font-bold text-green-400">{stats.contestsParticipated}</div>
                <div className="text-gray-500 text-sm">Contests</div>
              </div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              onClick={nextPage}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg inline-flex items-center gap-2 transition"
            >
              Let's Go <ChevronRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="page2"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-2">
                Rating Journey
              </h2>
              <p className="text-gray-500">{stats.creativeTaglines.rating}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-[#1e1e2e] border border-gray-800 rounded-xl p-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="w-6 h-6 text-blue-400" />
                  <span className="text-gray-400">Current Rating</span>
                </div>
                <div className="text-4xl font-bold" style={{ color: rankColor }}>
                  {stats.rating}
                </div>
                <div className="text-sm mt-1" style={{ color: rankColor }}>
                  {stats.rank}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-[#1e1e2e] border border-gray-800 rounded-xl p-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                  <span className="text-gray-400">Max Rating</span>
                </div>
                <div className="text-4xl font-bold" style={{ color: getRankColor(stats.maxRank) }}>
                  {stats.maxRating}
                </div>
                <div className="text-sm mt-1" style={{ color: getRankColor(stats.maxRank) }}>
                  {stats.maxRank}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-[#1e1e2e] border border-gray-800 rounded-xl p-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Zap className={`w-6 h-6 ${stats.ratingChange >= 0 ? 'text-green-400' : 'text-red-400'}`} />
                  <span className="text-gray-400">2024 Change</span>
                </div>
                <div className={`text-4xl font-bold ${stats.ratingChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {stats.ratingChange >= 0 ? '+' : ''}{stats.ratingChange}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-[#1e1e2e] border border-gray-800 rounded-xl p-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Users className="w-6 h-6 text-purple-400" />
                  <span className="text-gray-400">Friends</span>
                </div>
                <div className="text-4xl font-bold text-purple-400">
                  {stats.friendOfCount}
                </div>
                <div className="text-sm text-gray-500 mt-1">people follow you</div>
              </motion.div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="page3"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-2">
                Contest Performance
              </h2>
              <p className="text-gray-500">{stats.creativeTaglines.contests}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-[#1e1e2e] border border-gray-800 rounded-xl p-5 text-center"
              >
                <BarChart3 className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white">{stats.contestsParticipated}</div>
                <div className="text-gray-500 text-sm">Contests Joined</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-[#1e1e2e] border border-gray-800 rounded-xl p-5 text-center"
              >
                <Medal className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-yellow-400">{stats.bestContestRank}</div>
                <div className="text-gray-500 text-sm">Best Rank</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-[#1e1e2e] border border-gray-800 rounded-xl p-5 text-center"
              >
                <Target className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-green-400">{stats.avgContestRank}</div>
                <div className="text-gray-500 text-sm">Average Rank</div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-[#1e1e2e] border border-gray-800 rounded-xl p-5"
            >
              <h3 className="text-white font-medium mb-4">Submission Stats</h3>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-xl font-bold text-white">{stats.submissionStats.total}</div>
                  <div className="text-xs text-gray-500">Total</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-green-400">{stats.submissionStats.accepted}</div>
                  <div className="text-xs text-gray-500">AC</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-red-400">{stats.submissionStats.wrongAnswer}</div>
                  <div className="text-xs text-gray-500">WA</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-orange-400">{stats.submissionStats.tle}</div>
                  <div className="text-xs text-gray-500">TLE</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="page4"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-2">
                Problem Solving
              </h2>
              <p className="text-gray-500">{stats.creativeTaglines.problems}</p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#1e1e2e] border border-gray-800 rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400">Total Problems Solved</span>
                <span className="text-3xl font-bold text-blue-400">{stats.problemsSolved}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Target className="w-4 h-4 text-green-400" />
                <span className="text-gray-500">Favorite: </span>
                <span className="text-green-400 font-medium">{stats.favoriteTag}</span>
              </div>
            </motion.div>

            <div className="bg-[#1e1e2e] border border-gray-800 rounded-xl p-5">
              <h3 className="text-white font-medium mb-4">By Difficulty</h3>
              <div className="space-y-3">
                {stats.solvedByDifficulty.slice(0, 6).map((item, idx) => (
                  <motion.div
                    key={item.rating}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <span className="text-gray-500 w-16 text-sm">{item.rating}</span>
                    <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((item.count / Math.max(...stats.solvedByDifficulty.map(d => d.count))) * 100, 100)}%` }}
                        transition={{ delay: 0.5 + idx * 0.1, duration: 0.5 }}
                        className="h-full bg-blue-500 rounded-full"
                      />
                    </div>
                    <span className="text-white font-medium w-10 text-right">{item.count}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            key="page5"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-2">
                Your Coder Profile
              </h2>
              <p className="text-gray-500">{stats.creativeTaglines.personality}</p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center py-6"
            >
              <div className="inline-block px-6 py-3 bg-blue-600/20 border border-blue-500/30 rounded-xl">
                <Award className="w-10 h-10 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stats.coderTitle}</div>
              </div>
            </motion.div>

            <div className="space-y-3">
              {stats.funFacts.map((fact, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-[#1e1e2e] border border-gray-800 rounded-lg"
                >
                  <Zap className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-300 text-sm">{fact}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case 6:
        return (
          <motion.div
            key="page6"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-2">
                Share Your Stats
              </h2>
              <p className="text-gray-500">{stats.creativeTaglines.share}</p>
            </div>

            {/* Share Card */}
            <motion.div
              ref={shareCardRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-sm mx-auto bg-[#1a1a2e] border border-gray-700 rounded-xl p-5"
            >
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={stats.avatar || `https://userpic.codeforces.org/no-avatar.jpg`}
                  alt={stats.handle}
                  className="w-12 h-12 rounded-full border-2"
                  style={{ borderColor: rankColor }}
                />
                <div>
                  <div className="font-bold" style={{ color: rankColor }}>{stats.handle}</div>
                  <div className="text-gray-500 text-sm">Codeforces Wrapped 2025</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                <div>
                  <div className="text-lg font-bold" style={{ color: rankColor }}>{stats.rating}</div>
                  <div className="text-xs text-gray-500">Rating</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-400">{stats.problemsSolved}</div>
                  <div className="text-xs text-gray-500">Solved</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-400">{stats.contestsParticipated}</div>
                  <div className="text-xs text-gray-500">Contests</div>
                </div>
              </div>

              <div className="text-center">
                <span className="inline-block px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-400 text-sm font-medium">
                  {stats.coderTitle}
                </span>
              </div>

              <div className="text-center mt-3 text-xs text-gray-600">
                cfwrapped.quantsprogrammer.com
              </div>
            </motion.div>

            {/* Share Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-3"
            >
              <button
                onClick={copyShareLink}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition text-sm"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy Link"}
              </button>

              <button
                onClick={shareOnTwitter}
                className="flex items-center gap-2 px-4 py-2 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white rounded-lg transition text-sm"
              >
                <Twitter className="w-4 h-4" />
                Twitter
              </button>

              <button
                onClick={shareOnLinkedIn}
                className="flex items-center gap-2 px-4 py-2 bg-[#0A66C2] hover:bg-[#094c8f] text-white rounded-lg transition text-sm"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </button>

              <button
                onClick={downloadCard}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition text-sm"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center"
            >
              <button
                onClick={() => {
                  setStats(null);
                  setCurrentPage(0);
                  setHandle("");
                }}
                className="text-gray-500 hover:text-white transition text-sm"
              >
                ← Try another handle
              </button>
            </motion.div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f17] text-white">
      <Toaster position="top-center" />

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Home</span>
          </Link>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-600/10 border border-blue-500/20 rounded-full">
            <div className="w-4 h-4 bg-blue-500 rounded" />
            <span className="text-blue-400 text-sm font-medium">CF Wrapped 2025</span>
          </div>

          <div className="w-16" />
        </div>

        {/* Main Content */}
        {currentPage === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                Codeforces <span className="text-blue-500">Wrapped</span>
              </h1>
              <p className="text-gray-500">
                See your 2024 competitive programming journey
              </p>
            </div>

            <div className="max-w-md mx-auto space-y-3">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 bg-blue-500 rounded" />
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && fetchStats()}
                  placeholder="Enter your CF handle"
                  className="w-full pl-12 pr-4 py-3 bg-[#1e1e2e] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                  disabled={loading}
                />
              </div>

              <button
                onClick={fetchStats}
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 transition"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm">{loadingMessage}</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Generate Wrapped
                  </>
                )}
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {renderPage()}
            </AnimatePresence>

            {/* Navigation */}
            {currentPage > 0 && currentPage < 6 && (
              <div className="flex items-center justify-between pt-4">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white disabled:opacity-30 transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back
                </button>

                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5, 6].map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        page === currentPage
                          ? "w-6 bg-blue-500"
                          : page < currentPage
                          ? "bg-blue-500/50"
                          : "bg-gray-600"
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextPage}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition"
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {currentPage === 6 && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={prevPage}
                  className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
