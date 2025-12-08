"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Github, Sparkles, Rocket, Code2, GitBranch, Star, 
  GitPullRequest, Bug, Coffee, Moon, Sun, Zap, Trophy,
  Share2, Download, Twitter, Linkedin, Copy, Check,
  ChevronRight, ChevronLeft, Loader2, Calendar, Flame,
  Heart, Target, Award, Brain, Clock
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import html2canvas from "html2canvas";

// Types
interface GitHubStats {
  username: string;
  avatarUrl: string;
  totalCommits: number;
  activeDays: number;
  longestStreak: number;
  mostProductiveDay: string;
  topLanguages: { name: string; percent: number }[];
  newLanguage: string;
  mostStarredRepo: string;
  mostActiveRepo: string;
  newReposCount: number;
  totalStars: number;
  pullRequests: number;
  issuesRaised: number;
  reposContributed: number;
  codingPersona: string;
  mostCodingDay: string;
  hackerTitle: string;
  creativeTaglines: {
    welcome: string;
    contributions: string;
    languages: string;
    repos: string;
    openSource: string;
    personality: string;
    share: string;
  };
  funFacts: string[];
}

// Loading messages
const loadingMessages = [
  "🔍 Scanning your commit history...",
  "📊 Analyzing your coding patterns...",
  "🧬 Decoding your developer DNA...",
  "🌟 Counting your stars...",
  "🔥 Measuring your streak power...",
  "🎨 Painting your dev journey...",
  "✨ Generating creative insights...",
  "🚀 Almost ready for liftoff..."
];

// Confetti component
const Confetti = () => {
  const colors = ["#ff0080", "#00ff88", "#00d4ff", "#ff00ff", "#ffff00", "#ff6600"];
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full"
          style={{
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            left: `${Math.random() * 100}%`,
            top: -20,
          }}
          animate={{
            y: [0, window.innerHeight + 100],
            x: [0, (Math.random() - 0.5) * 200],
            rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
            opacity: [1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: Math.random() * 2,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
};

// Neon text component
const NeonText = ({ children, color = "cyan" }: { children: React.ReactNode; color?: string }) => {
  const glowColors: Record<string, string> = {
    cyan: "drop-shadow-[0_0_10px_rgba(0,255,255,0.8)] drop-shadow-[0_0_20px_rgba(0,255,255,0.6)]",
    pink: "drop-shadow-[0_0_10px_rgba(255,0,128,0.8)] drop-shadow-[0_0_20px_rgba(255,0,128,0.6)]",
    green: "drop-shadow-[0_0_10px_rgba(0,255,136,0.8)] drop-shadow-[0_0_20px_rgba(0,255,136,0.6)]",
    purple: "drop-shadow-[0_0_10px_rgba(168,85,247,0.8)] drop-shadow-[0_0_20px_rgba(168,85,247,0.6)]",
    yellow: "drop-shadow-[0_0_10px_rgba(255,255,0,0.8)] drop-shadow-[0_0_20px_rgba(255,255,0,0.6)]",
  };
  return <span className={`${glowColors[color] || glowColors.cyan}`}>{children}</span>;
};

// Terminal typing effect
const TerminalText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [displayText, setDisplayText] = useState("");
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        if (i <= text.length) {
          setDisplayText(text.slice(0, i));
          i++;
        } else {
          clearInterval(interval);
        }
      }, 30);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, delay]);

  return (
    <span className="font-mono">
      {displayText}
      <span className="animate-pulse">_</span>
    </span>
  );
};

export default function GitHubWrappedPage() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareCardRef = React.useRef<HTMLDivElement>(null);

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

  // Fetch GitHub stats
  const fetchStats = async () => {
    if (!username.trim()) {
      toast.error("Please enter a GitHub username");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/github-wrapped", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch GitHub stats");
      }

      setStats(data);
      setCurrentPage(1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Navigation
  const nextPage = () => {
    if (currentPage < 7) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Share functions
  const copyShareLink = () => {
    const shareUrl = `${window.location.origin}/github-wrapped?u=${stats?.username}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnTwitter = () => {
    const text = `🚀 My GitHub Wrapped 2024!\n\n📊 ${stats?.totalCommits} commits\n🔥 ${stats?.longestStreak} day streak\n⭐ ${stats?.totalStars} stars earned\n\nCheck yours at:`;
    const url = `${window.location.origin}/github-wrapped`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank");
  };

  const shareOnLinkedIn = () => {
    const url = `${window.location.origin}/github-wrapped`;
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank");
  };

  const shareOnWhatsApp = () => {
    const text = `🚀 Check out my GitHub Wrapped 2024!\n\n📊 ${stats?.totalCommits} commits\n🔥 ${stats?.longestStreak} day streak\n⭐ ${stats?.totalStars} stars\n\nGet yours: ${window.location.origin}/github-wrapped`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const shareOnFacebook = () => {
    const url = `${window.location.origin}/github-wrapped`;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
  };

  const downloadCard = async () => {
    if (shareCardRef.current) {
      try {
        const canvas = await html2canvas(shareCardRef.current, {
          backgroundColor: "#0a0a0f",
          scale: 2,
        });
        const link = document.createElement("a");
        link.download = `github-wrapped-${stats?.username}-2024.png`;
        link.href = canvas.toDataURL();
        link.click();
        toast.success("Card downloaded!");
      } catch (error) {
        toast.error("Failed to download card");
      }
    }
  };

  // Page variants for animations
  const pageVariants = {
    initial: { opacity: 0, x: 100, scale: 0.95 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: -100, scale: 0.95 },
  };

  // Render page content
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
            className="text-center space-y-8"
          >
            {/* Avatar with glow */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="relative inline-block"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full blur-xl opacity-50 animate-pulse" />
              <img
                src={stats.avatarUrl}
                alt={stats.username}
                className="w-32 h-32 rounded-full border-4 border-cyan-400 relative z-10"
              />
            </motion.div>

            {/* Welcome text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-xl text-cyan-400 mb-2">
                👋 Hey <NeonText color="cyan">{stats.username}</NeonText>, ready for your GitHub Wrapped?
              </p>
              <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-6">
                Your 2024 GitHub Journey
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                {stats.creativeTaglines.welcome}
              </p>
            </motion.div>

            {/* Quick stats preview */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex justify-center gap-8 flex-wrap"
            >
              <div className="text-center">
                <div className="text-4xl font-bold text-cyan-400">{stats.totalCommits.toLocaleString()}</div>
                <div className="text-gray-500 text-sm">commits</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400">{stats.activeDays}</div>
                <div className="text-gray-500 text-sm">active days</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-pink-400">{stats.totalStars}</div>
                <div className="text-gray-500 text-sm">stars earned</div>
              </div>
            </motion.div>

            {/* Start button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              onClick={nextPage}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-lg rounded-full inline-flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all hover:scale-105"
            >
              Start the Journey <Rocket className="w-5 h-5" />
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
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-2">
                Your <NeonText color="green">Coding Rhythm</NeonText>
              </h2>
              <p className="text-gray-400">⚡ {stats.creativeTaglines.contributions}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Stats cards */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 rounded-2xl p-6"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-green-500/20 rounded-xl">
                    <Rocket className="w-8 h-8 text-green-400" />
                  </div>
                  <div>
                    <div className="text-4xl font-black text-green-400">{stats.totalCommits.toLocaleString()}</div>
                    <div className="text-gray-400">Total Commits</div>
                  </div>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-400"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-500/20 rounded-2xl p-6"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-cyan-500/20 rounded-xl">
                    <Calendar className="w-8 h-8 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-4xl font-black text-cyan-400">{stats.activeDays}</div>
                    <div className="text-gray-400">Active Days</div>
                  </div>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(stats.activeDays / 365) * 100}%` }}
                    transition={{ delay: 0.6, duration: 1 }}
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-400"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-orange-500/10 to-red-500/5 border border-orange-500/20 rounded-2xl p-6"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-orange-500/20 rounded-xl">
                    <Flame className="w-8 h-8 text-orange-400" />
                  </div>
                  <div>
                    <div className="text-4xl font-black text-orange-400">{stats.longestStreak}</div>
                    <div className="text-gray-400">Day Streak 🔥</div>
                  </div>
                </div>
                <p className="text-sm text-gray-500">Your keyboard was on fire!</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/20 rounded-2xl p-6"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-purple-500/20 rounded-xl">
                    <Target className="w-8 h-8 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-purple-400">{stats.mostProductiveDay}</div>
                    <div className="text-gray-400">Most Productive Day</div>
                  </div>
                </div>
                <p className="text-sm text-gray-500">Your peak performance day!</p>
              </motion.div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-center text-lg text-gray-300 italic"
            >
              "You weren't just coding. You were <span className="text-green-400">building your legacy</span>. One commit at a time."
            </motion.p>
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
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-2">
                Your <NeonText color="purple">Developer DNA</NeonText>
              </h2>
              <p className="text-gray-400">🧬 {stats.creativeTaglines.languages}</p>
            </div>

            {/* Language badges */}
            <div className="grid md:grid-cols-3 gap-4">
              {stats.topLanguages.slice(0, 3).map((lang, index) => (
                <motion.div
                  key={lang.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className={`relative overflow-hidden rounded-2xl p-6 ${
                    index === 0
                      ? "bg-gradient-to-br from-yellow-500/20 to-orange-500/10 border border-yellow-500/30"
                      : index === 1
                      ? "bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-500/30"
                      : "bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-500/30"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">
                      {index === 0 ? "⭐" : index === 1 ? "⚡" : "💻"}
                    </span>
                    <span className={`text-sm font-bold ${
                      index === 0 ? "text-yellow-400" : index === 1 ? "text-cyan-400" : "text-purple-400"
                    }`}>
                      #{index + 1}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{lang.name}</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${lang.percent}%` }}
                        transition={{ delay: 0.5 + index * 0.2, duration: 1 }}
                        className={`h-full ${
                          index === 0
                            ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                            : index === 1
                            ? "bg-gradient-to-r from-cyan-500 to-blue-500"
                            : "bg-gradient-to-r from-purple-500 to-pink-500"
                        }`}
                      />
                    </div>
                    <span className="text-white font-bold">{lang.percent}%</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* New language discovery */}
            {stats.newLanguage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center p-6 bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-2xl"
              >
                <p className="text-xl text-gray-300">
                  You flirted with <span className="text-pink-400 font-bold">{stats.newLanguage}</span> this year. We see you 👀
                </p>
              </motion.div>
            )}

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-center text-lg text-gray-300 italic"
            >
              "Programming isn't just a skill. It's a <span className="text-purple-400">personality type</span>."
            </motion.p>
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
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-2">
                Your Code, Their <NeonText color="yellow">Love</NeonText> 💖
              </h2>
              <p className="text-gray-400">⭐ {stats.creativeTaglines.repos}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, rotateY: -20 }}
                animate={{ opacity: 1, rotateY: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-yellow-500/10 to-amber-500/5 border border-yellow-500/20 rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Star className="w-8 h-8 text-yellow-400" />
                  <span className="text-gray-400">Most Starred Repo</span>
                </div>
                <h3 className="text-2xl font-bold text-yellow-400 truncate">{stats.mostStarredRepo}</h3>
                <p className="text-sm text-gray-500 mt-2">Your magnum opus ✨</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, rotateY: 20 }}
                animate={{ opacity: 1, rotateY: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <GitBranch className="w-8 h-8 text-green-400" />
                  <span className="text-gray-400">Most Active Repo</span>
                </div>
                <h3 className="text-2xl font-bold text-green-400 truncate">{stats.mostActiveRepo}</h3>
                <p className="text-sm text-gray-500 mt-2">Your daily companion 🛠️</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-blue-500/10 to-indigo-500/5 border border-blue-500/20 rounded-2xl p-6"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/20 rounded-xl">
                    <Code2 className="w-8 h-8 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-4xl font-black text-blue-400">{stats.newReposCount}</div>
                    <div className="text-gray-400">New Repos Created</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-pink-500/10 to-rose-500/5 border border-pink-500/20 rounded-2xl p-6"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-pink-500/20 rounded-xl">
                    <Heart className="w-8 h-8 text-pink-400" />
                  </div>
                  <div>
                    <div className="text-4xl font-black text-pink-400">{stats.totalStars}</div>
                    <div className="text-gray-400">Total Stars Earned</div>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center p-6 bg-gradient-to-r from-yellow-500/10 to-pink-500/10 border border-yellow-500/20 rounded-2xl"
            >
              <p className="text-xl text-gray-300">
                Your code attracted more stars than your Instagram selfies. 📸✨
              </p>
            </motion.div>
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
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-2">
                The <NeonText color="pink">Open Source Gladiator</NeonText> ⚔️
              </h2>
              <p className="text-gray-400">🌍 {stats.creativeTaglines.openSource}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="bg-gradient-to-br from-purple-500/20 to-violet-500/10 border border-purple-500/30 rounded-2xl p-6 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <GitPullRequest className="w-8 h-8 text-purple-400" />
                </div>
                <div className="text-4xl font-black text-purple-400 mb-2">{stats.pullRequests}</div>
                <div className="text-gray-400">Pull Requests Opened</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="bg-gradient-to-br from-red-500/20 to-orange-500/10 border border-red-500/30 rounded-2xl p-6 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
                  <Bug className="w-8 h-8 text-red-400" />
                </div>
                <div className="text-4xl font-black text-red-400 mb-2">{stats.issuesRaised}</div>
                <div className="text-gray-400">Issues Raised</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
                className="bg-gradient-to-br from-cyan-500/20 to-teal-500/10 border border-cyan-500/30 rounded-2xl p-6 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-cyan-500/20 rounded-full flex items-center justify-center">
                  <Github className="w-8 h-8 text-cyan-400" />
                </div>
                <div className="text-4xl font-black text-cyan-400 mb-2">{stats.reposContributed}</div>
                <div className="text-gray-400">Repos Contributed To</div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center p-6 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10 border border-purple-500/20 rounded-2xl"
            >
              <p className="text-xl text-gray-300">
                You're not just writing code. You're <span className="text-cyan-400 font-bold">improving the internet</span>. 🌐
              </p>
            </motion.div>
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
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-2">
                Your <NeonText color="cyan">Hacker Personality</NeonText> Scan
              </h2>
              <p className="text-gray-400">🧠 {stats.creativeTaglines.personality}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-blue-500/10 to-indigo-500/5 border border-blue-500/20 rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="w-6 h-6 text-blue-400" />
                  <span className="text-gray-400">Most Coding Day</span>
                </div>
                <div className="text-2xl font-bold text-blue-400">{stats.mostCodingDay}</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/20 rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-2">
                  {stats.codingPersona === "Night Owl" ? (
                    <Moon className="w-6 h-6 text-purple-400" />
                  ) : (
                    <Sun className="w-6 h-6 text-yellow-400" />
                  )}
                  <span className="text-gray-400">Coding Persona</span>
                </div>
                <div className="text-2xl font-bold text-purple-400">{stats.codingPersona}</div>
              </motion.div>
            </div>

            {/* Hacker Title */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="text-center"
            >
              <div className="inline-block bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20 border border-yellow-500/30 rounded-2xl p-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Trophy className="w-10 h-10 text-yellow-400" />
                  <span className="text-gray-400 text-lg">Title Earned:</span>
                </div>
                <h3 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                  {stats.hackerTitle}
                </h3>
              </div>
            </motion.div>

            {/* Fun facts */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="space-y-3"
            >
              {stats.funFacts.map((fact, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl"
                >
                  <Sparkles className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                  <p className="text-gray-300">{fact}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-center text-lg text-gray-300 italic"
            >
              "If caffeine could talk… it would ask for a raise." ☕
            </motion.p>
          </motion.div>
        );

      case 7:
        return (
          <motion.div
            key="page7"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-2">
                Show Off Your <NeonText color="pink">Dev Story</NeonText>
              </h2>
              <p className="text-gray-400">{stats.creativeTaglines.share}</p>
            </div>

            {/* Share Card */}
            <motion.div
              ref={shareCardRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-lg mx-auto bg-gradient-to-br from-[#0f0f1a] via-[#1a1a2e] to-[#0f0f1a] border border-cyan-500/30 rounded-2xl p-6 relative overflow-hidden"
            >
              {/* Glow effects */}
              <div className="absolute top-0 left-1/4 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl" />

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={stats.avatarUrl}
                    alt={stats.username}
                    className="w-16 h-16 rounded-full border-2 border-cyan-400"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-white">{stats.username}</h3>
                    <p className="text-cyan-400">GitHub Wrapped 2024</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{stats.totalCommits}</div>
                    <div className="text-xs text-gray-400">Commits</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-400">{stats.longestStreak}</div>
                    <div className="text-xs text-gray-400">Day Streak</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">{stats.totalStars}</div>
                    <div className="text-xs text-gray-400">Stars</div>
                  </div>
                </div>

                <div className="text-center mb-4">
                  <span className="inline-block px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-full text-yellow-400 font-bold">
                    {stats.hackerTitle}
                  </span>
                </div>

                <p className="text-center text-sm text-gray-400">
                  I survived 2024 with {stats.totalCommits} commits and only {Math.floor(Math.random() * 100)} emotional breakdowns.
                </p>

                <div className="text-center mt-4 text-xs text-gray-500">
                  devwrapped.quantsprogrammer.com
                </div>
              </div>
            </motion.div>

            {/* Share Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <button
                onClick={copyShareLink}
                className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                {copied ? "Copied!" : "Copy Link"}
              </button>

              <button
                onClick={shareOnTwitter}
                className="flex items-center gap-2 px-6 py-3 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white rounded-xl transition"
              >
                <Twitter className="w-5 h-5" />
                Twitter
              </button>

              <button
                onClick={shareOnLinkedIn}
                className="flex items-center gap-2 px-6 py-3 bg-[#0A66C2] hover:bg-[#094c8f] text-white rounded-xl transition"
              >
                <Linkedin className="w-5 h-5" />
                LinkedIn
              </button>

              <button
                onClick={shareOnWhatsApp}
                className="flex items-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#1da851] text-white rounded-xl transition"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </button>

              <button
                onClick={shareOnFacebook}
                className="flex items-center gap-2 px-6 py-3 bg-[#1877F2] hover:bg-[#145dbf] text-white rounded-xl transition"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>

              <button
                onClick={downloadCard}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl transition"
              >
                <Download className="w-5 h-5" />
                Download Card
              </button>
            </motion.div>

            {/* Start Over */}
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
                className="text-gray-400 hover:text-white transition"
              >
                ← Generate for another user
              </button>
            </motion.div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      <Toaster position="top-center" />
      
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(0,255,255,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(255,0,128,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.03),transparent_60%)]" />
        
        {/* Grid overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {showConfetti && <Confetti />}

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-sm mb-4">
            <Github className="w-4 h-4" />
            <span>DevWrapped 2024</span>
          </div>
        </motion.div>

        {/* Main Content */}
        {currentPage === 0 ? (
          // Input Page
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl mx-auto text-center space-y-8"
          >
            <div>
              <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
                GitHub Wrapped
              </h1>
              <p className="text-xl text-gray-400">
                Discover your 2024 coding journey in style ✨
              </p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && fetchStats()}
                  placeholder="Enter your GitHub username"
                  className="w-full pl-14 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-2xl text-white text-lg placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition"
                  disabled={loading}
                />
              </div>

              <button
                onClick={fetchStats}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-lg rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:scale-[1.02]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <TerminalText text={loadingMessage} />
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6" />
                    Generate My Wrapped
                  </>
                )}
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-green-500/10 rounded-xl flex items-center justify-center">
                  <Code2 className="w-6 h-6 text-green-400" />
                </div>
                <p className="text-sm text-gray-400">Commit Stats</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-purple-500/10 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-purple-400" />
                </div>
                <p className="text-sm text-gray-400">AI Insights</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-pink-500/10 rounded-xl flex items-center justify-center">
                  <Share2 className="w-6 h-6 text-pink-400" />
                </div>
                <p className="text-sm text-gray-400">Share Card</p>
              </div>
            </div>
          </motion.div>
        ) : (
          // Pages
          <div className="space-y-8">
            <AnimatePresence mode="wait">
              {renderPage()}
            </AnimatePresence>

            {/* Navigation */}
            {currentPage > 0 && currentPage < 7 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-between pt-8"
              >
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-xl transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back
                </button>

                {/* Page indicators */}
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5, 6, 7].map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        page === currentPage
                          ? "w-8 bg-cyan-400"
                          : page < currentPage
                          ? "bg-cyan-400/50"
                          : "bg-gray-600"
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextPage}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white rounded-xl transition"
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {/* Back button on last page */}
            {currentPage === 7 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center pt-4"
              >
                <button
                  onClick={prevPage}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back to Stats
                </button>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
