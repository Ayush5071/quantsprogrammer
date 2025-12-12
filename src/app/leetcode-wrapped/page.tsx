"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  Trophy, Zap, Target, TrendingUp, Award, Star,
  Share2, Download, Twitter, Linkedin, Copy, Check,
  ChevronRight, ChevronLeft, Loader2, Calendar, Flame,
  ArrowLeft, BarChart3, Clock, CheckCircle, XCircle, Code
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import html2canvas from "html2canvas";
import { useRouter } from "next/navigation";
import useCurrentUser from "@/lib/useCurrentUser";

// Types
interface LeetCodeStats {
  username: string;
  avatar: string;
  ranking: number;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  acceptanceRate: number;
  contributionPoints: number;
  reputation: number;
  streak: number;
  totalSubmissions: number;
  activeDays: number;
  badges: string[];
  recentTopics: string[];
  creativeTaglines: {
    welcome: string;
    problems: string;
    difficulty: string;
    streak: string;
    personality: string;
    share: string;
  };
  funFacts: string[];
  coderTitle: string;
}

// LeetCode colors
const LEETCODE_ORANGE = "#FFA116";
const LEETCODE_DARK = "#1A1A1A";
const EASY_GREEN = "#00B8A3";
const MEDIUM_YELLOW = "#FFC01E";
const HARD_RED = "#FF375F";

// Loading messages
const loadingMessages = [
  "📊 Fetching your profile...",
  "🎯 Counting solved problems...",
  "🔥 Calculating your streak...",
  "💪 Analyzing difficulty distribution...",
  "✨ Generating insights...",
  "🚀 Almost ready..."
];

export default function LeetCodeWrappedPage() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
  const [stats, setStats] = useState<LeetCodeStats | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [copied, setCopied] = useState(false);
  const shareCardRef = React.useRef<HTMLDivElement>(null);
   const user = useCurrentUser();
  const router = useRouter();

  // Cycle loading messages should be registered unconditionally
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
            Sign in to access LeetCode Wrapped 2025.
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


  // NOTE: useEffect moved above early returns so hooks are always called in same order

  // Fetch stats
  const fetchStats = async () => {
    if (!username.trim()) {
      toast.error("Please enter a LeetCode username");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/leetcode-wrapped", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch LeetCode stats");
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
    if (currentPage < 5) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Share functions
  const copyShareLink = () => {
    const shareUrl = `${window.location.origin}/leetcode-wrapped?u=${stats?.username}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnTwitter = () => {
    const text = `🧠 My LeetCode Wrapped 2025!\n\n✅ ${stats?.totalSolved} problems solved\n🔥 ${stats?.streak} day streak\n💪 ${stats?.hardSolved} hard problems\n\nCheck yours at:`;
    const url = `${window.location.origin}/leetcode-wrapped`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank");
  };

  const shareOnLinkedIn = () => {
    const url = `${window.location.origin}/leetcode-wrapped`;
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank");
  };

  const downloadCard = async () => {
    if (shareCardRef.current) {
      try {
        const canvas = await html2canvas(shareCardRef.current, {
          backgroundColor: LEETCODE_DARK,
          scale: 2,
        });
        const link = document.createElement("a");
        link.download = `leetcode-wrapped-${stats?.username}-2024.png`;
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
                className="absolute inset-0 rounded-full blur-xl opacity-40"
                style={{ backgroundColor: LEETCODE_ORANGE }}
              />
              {stats.avatar ? (
                <img
                  src={stats.avatar}
                  alt={stats.username}
                  className="w-24 h-24 rounded-full border-3 relative z-10"
                  style={{ borderColor: LEETCODE_ORANGE }}
                />
              ) : (
                <div 
                  className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-black relative z-10"
                  style={{ backgroundColor: LEETCODE_ORANGE }}
                >
                  {stats.username[0]?.toUpperCase()}
                </div>
              )}
            </motion.div>

            {/* Welcome */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-gray-400 mb-2">
                Hey <span style={{ color: LEETCODE_ORANGE }} className="font-semibold">{stats.username}</span>!
              </p>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                Your LeetCode <span style={{ color: LEETCODE_ORANGE }}>2024</span>
              </h1>
              <p className="text-gray-500 max-w-md mx-auto text-sm">
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
              <div className="text-center">
                <div className="text-3xl font-bold" style={{ color: LEETCODE_ORANGE }}>{stats.totalSolved}</div>
                <div className="text-gray-500 text-xs">Solved</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">#{stats.ranking.toLocaleString()}</div>
                <div className="text-gray-500 text-xs">Ranking</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold" style={{ color: HARD_RED }}>{stats.hardSolved}</div>
                <div className="text-gray-500 text-xs">Hard</div>
              </div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              onClick={nextPage}
              className="px-6 py-2.5 text-black font-medium rounded-lg inline-flex items-center gap-2 transition hover:opacity-90"
              style={{ backgroundColor: LEETCODE_ORANGE }}
            >
              Continue <ChevronRight className="w-5 h-5" />
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
            className="space-y-5"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-1">
                Problem Solving
              </h2>
              <p className="text-gray-500 text-sm">{stats.creativeTaglines.problems}</p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#282828] rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400 text-sm">Total Solved</span>
                <span className="text-2xl font-bold" style={{ color: LEETCODE_ORANGE }}>
                  {stats.totalSolved}
                </span>
              </div>

              {/* Difficulty breakdown */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs w-14" style={{ color: EASY_GREEN }}>Easy</span>
                  <div className="flex-1 h-2 bg-[#3a3a3a] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(stats.easySolved / stats.totalSolved) * 100}%` }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: EASY_GREEN }}
                    />
                  </div>
                  <span className="text-white text-sm w-10 text-right">{stats.easySolved}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs w-14" style={{ color: MEDIUM_YELLOW }}>Medium</span>
                  <div className="flex-1 h-2 bg-[#3a3a3a] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(stats.mediumSolved / stats.totalSolved) * 100}%` }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: MEDIUM_YELLOW }}
                    />
                  </div>
                  <span className="text-white text-sm w-10 text-right">{stats.mediumSolved}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs w-14" style={{ color: HARD_RED }}>Hard</span>
                  <div className="flex-1 h-2 bg-[#3a3a3a] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(stats.hardSolved / stats.totalSolved) * 100}%` }}
                      transition={{ delay: 0.6, duration: 0.6 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: HARD_RED }}
                    />
                  </div>
                  <span className="text-white text-sm w-10 text-right">{stats.hardSolved}</span>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-[#282828] rounded-xl p-4"
              >
                <CheckCircle className="w-5 h-5 mb-2" style={{ color: EASY_GREEN }} />
                <div className="text-xl font-bold text-white">{stats.acceptanceRate}%</div>
                <div className="text-gray-500 text-xs">Acceptance Rate</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-[#282828] rounded-xl p-4"
              >
                <Code className="w-5 h-5 mb-2" style={{ color: LEETCODE_ORANGE }} />
                <div className="text-xl font-bold text-white">{stats.totalSubmissions}</div>
                <div className="text-gray-500 text-xs">Submissions</div>
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
            className="space-y-5"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-1">
                Consistency
              </h2>
              <p className="text-gray-500 text-sm">{stats.creativeTaglines.streak}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-[#282828] rounded-xl p-5 text-center"
              >
                <Flame className="w-8 h-8 mx-auto mb-2" style={{ color: LEETCODE_ORANGE }} />
                <div className="text-3xl font-bold text-white">{stats.streak}</div>
                <div className="text-gray-500 text-xs">Day Streak</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-[#282828] rounded-xl p-5 text-center"
              >
                <Calendar className="w-8 h-8 mx-auto mb-2" style={{ color: EASY_GREEN }} />
                <div className="text-3xl font-bold text-white">{stats.activeDays}</div>
                <div className="text-gray-500 text-xs">Active Days</div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-[#282828] rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-400 text-sm">Global Ranking</span>
                <span className="text-xl font-bold text-white">#{stats.ranking.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Reputation</span>
                <span className="text-xl font-bold" style={{ color: LEETCODE_ORANGE }}>{stats.reputation}</span>
              </div>
            </motion.div>

            {stats.badges.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-[#282828] rounded-xl p-4"
              >
                <div className="text-gray-400 text-sm mb-2">Badges Earned</div>
                <div className="flex flex-wrap gap-2">
                  {stats.badges.slice(0, 5).map((badge, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-1 text-xs rounded-full"
                      style={{ backgroundColor: `${LEETCODE_ORANGE}20`, color: LEETCODE_ORANGE }}
                    >
                      🏆 {badge}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
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
            className="space-y-5"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-1">
                Your Profile
              </h2>
              <p className="text-gray-500 text-sm">{stats.creativeTaglines.personality}</p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center py-4"
            >
              <div 
                className="inline-block px-5 py-2.5 rounded-xl"
                style={{ backgroundColor: `${LEETCODE_ORANGE}20` }}
              >
                <Award className="w-8 h-8 mx-auto mb-1" style={{ color: LEETCODE_ORANGE }} />
                <div className="text-xl font-bold text-white">{stats.coderTitle}</div>
              </div>
            </motion.div>

            {stats.recentTopics.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-[#282828] rounded-xl p-4"
              >
                <div className="text-gray-400 text-sm mb-3">Top Topics</div>
                <div className="flex flex-wrap gap-2">
                  {stats.recentTopics.slice(0, 6).map((topic, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1.5 text-xs bg-[#3a3a3a] text-gray-300 rounded-lg"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            <div className="space-y-2">
              {stats.funFacts.map((fact, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                  className="flex items-start gap-2 p-3 bg-[#282828] rounded-lg"
                >
                  <Zap className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: LEETCODE_ORANGE }} />
                  <p className="text-gray-300 text-sm">{fact}</p>
                </motion.div>
              ))}
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
            className="space-y-5"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-1">
                Share Your Stats
              </h2>
              <p className="text-gray-500 text-sm">{stats.creativeTaglines.share}</p>
            </div>

            {/* Share Card */}
            <motion.div
              ref={shareCardRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-xs mx-auto rounded-xl p-5"
              style={{ backgroundColor: LEETCODE_DARK }}
            >
              <div className="flex items-center gap-3 mb-4">
                {stats.avatar ? (
                  <img
                    src={stats.avatar}
                    alt={stats.username}
                    className="w-10 h-10 rounded-full border-2"
                    style={{ borderColor: LEETCODE_ORANGE }}
                  />
                ) : (
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-black"
                    style={{ backgroundColor: LEETCODE_ORANGE }}
                  >
                    {stats.username[0]?.toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="font-semibold" style={{ color: LEETCODE_ORANGE }}>{stats.username}</div>
                  <div className="text-gray-500 text-xs">LeetCode Wrapped 2025</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                <div>
                  <div className="text-lg font-bold" style={{ color: LEETCODE_ORANGE }}>{stats.totalSolved}</div>
                  <div className="text-[10px] text-gray-500">Solved</div>
                </div>
                <div>
                  <div className="text-lg font-bold" style={{ color: HARD_RED }}>{stats.hardSolved}</div>
                  <div className="text-[10px] text-gray-500">Hard</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-white">{stats.streak}</div>
                  <div className="text-[10px] text-gray-500">Streak</div>
                </div>
              </div>

              <div className="text-center">
                <span 
                  className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                  style={{ backgroundColor: `${LEETCODE_ORANGE}20`, color: LEETCODE_ORANGE }}
                >
                  {stats.coderTitle}
                </span>
              </div>

              <div className="text-center mt-3 text-[10px] text-gray-600">
                lcwrapped.quantsprogrammer.com
              </div>
            </motion.div>

            {/* Share Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-2"
            >
              <button
                onClick={copyShareLink}
                className="flex items-center gap-2 px-3 py-2 bg-[#282828] hover:bg-[#3a3a3a] text-white rounded-lg transition text-sm"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy"}
              </button>

              <button
                onClick={shareOnTwitter}
                className="flex items-center gap-2 px-3 py-2 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white rounded-lg transition text-sm"
              >
                <Twitter className="w-4 h-4" />
                Tweet
              </button>

              <button
                onClick={shareOnLinkedIn}
                className="flex items-center gap-2 px-3 py-2 bg-[#0A66C2] hover:bg-[#094c8f] text-white rounded-lg transition text-sm"
              >
                <Linkedin className="w-4 h-4" />
                Share
              </button>

              <button
                onClick={downloadCard}
                className="flex items-center gap-2 px-3 py-2 text-black rounded-lg transition text-sm hover:opacity-90"
                style={{ backgroundColor: LEETCODE_ORANGE }}
              >
                <Download className="w-4 h-4" />
                Save
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
                  setUsername("");
                }}
                className="text-gray-500 hover:text-white transition text-sm"
              >
                ← Try another username
              </button>
            </motion.div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: LEETCODE_DARK }}>
      <Toaster position="top-center" />

      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Home</span>
          </Link>

          <div 
            className="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{ backgroundColor: `${LEETCODE_ORANGE}15` }}
          >
            <div className="w-4 h-4 rounded" style={{ backgroundColor: LEETCODE_ORANGE }} />
            <span style={{ color: LEETCODE_ORANGE }} className="text-sm font-medium">LC Wrapped 2025</span>
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
                LeetCode <span style={{ color: LEETCODE_ORANGE }}>Wrapped</span>
              </h1>
              <p className="text-gray-500">
                Your 2024 problem-solving journey
              </p>
            </div>

            <div className="max-w-sm mx-auto space-y-3">
              <div className="relative">
                <Code className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: LEETCODE_ORANGE }} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && fetchStats()}
                  placeholder="Enter your LeetCode username"
                  className="w-full pl-12 pr-4 py-3 bg-[#282828] border border-[#3a3a3a] rounded-lg text-white placeholder-gray-500 focus:outline-none transition"
                  style={{ borderColor: username ? LEETCODE_ORANGE : '#3a3a3a' }}
                  disabled={loading}
                />
              </div>

              <button
                onClick={fetchStats}
                disabled={loading}
                className="w-full py-3 text-black font-medium rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 transition hover:opacity-90"
                style={{ backgroundColor: LEETCODE_ORANGE }}
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
          <div className="space-y-5">
            <AnimatePresence mode="wait">
              {renderPage()}
            </AnimatePresence>

            {/* Navigation */}
            {currentPage > 0 && currentPage < 5 && (
              <div className="flex items-center justify-between pt-4">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white disabled:opacity-30 transition text-sm"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back
                </button>

                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className="w-2 h-2 rounded-full transition-all"
                      style={{
                        width: page === currentPage ? 20 : 8,
                        backgroundColor: page <= currentPage ? LEETCODE_ORANGE : '#3a3a3a',
                      }}
                    />
                  ))}
                </div>

                <button
                  onClick={nextPage}
                  className="flex items-center gap-2 px-3 py-2 text-black rounded-lg transition text-sm hover:opacity-90"
                  style={{ backgroundColor: LEETCODE_ORANGE }}
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {currentPage === 5 && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={prevPage}
                  className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white transition text-sm"
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
