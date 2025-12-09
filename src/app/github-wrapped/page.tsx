"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconArrowRight, IconArrowLeft, IconDownload, IconBrandGithub, IconHome } from "@tabler/icons-react";
import { GitPullRequest, GitCommit, Flame, Code, Star, Trophy } from "lucide-react";
import html2canvas from "html2canvas";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useCurrentUser from "@/lib/useCurrentUser";
// Interface matching the actual API response
interface GitHubData {
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

// GitHub-themed glow text
const GitHubText = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <span className={`text-[#2da44e] drop-shadow-[0_0_8px_rgba(45,164,78,0.4)] ${className}`}>
      {children}
    </span>
  );
};

// GitHub contribution grid visualization
const ContributionGrid = () => {
  const weeks = 12;
  const days = 7;
  
  return (
    <div className="flex gap-[2px]">
      {Array.from({ length: weeks }).map((_, weekIndex) => (
        <div key={weekIndex} className="flex flex-col gap-[2px]">
          {Array.from({ length: days }).map((_, dayIndex) => {
            const random = Math.random();
            let bgColor = "bg-[#161b22]";
            if (random > 0.7) bgColor = "bg-[#0e4429]";
            if (random > 0.8) bgColor = "bg-[#006d32]";
            if (random > 0.9) bgColor = "bg-[#26a641]";
            if (random > 0.95) bgColor = "bg-[#39d353]";
            
            return (
              <motion.div
                key={dayIndex}
                className={`w-2 h-2 rounded-sm ${bgColor}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: weekIndex * 0.05 + dayIndex * 0.02 }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default function GitHubWrappedPage() {

 
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<GitHubData | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const shareRef = useRef<HTMLDivElement>(null);
   const user = useCurrentUser();
  const router = useRouter();

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
            Sign in to access Github Wrapped 2025.
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


  const fetchData = async () => {
    if (!username.trim()) {
      setError("Please enter your GitHub username");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/github-wrapped", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim() }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch data");
      }

      setData(result);
      setCurrentPage(1);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async () => {
    if (!shareRef.current) return;
    
    try {
      const canvas = await html2canvas(shareRef.current, {
        backgroundColor: "#0d1117",
        scale: 2,
      });
      
      const link = document.createElement("a");
      link.download = `github-wrapped-${username}-2024.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (err) {
      console.error("Failed to download image:", err);
    }
  };

  const nextPage = () => {
    if (currentPage < 7) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Page animations
  const pageVariants = {
    enter: { opacity: 0, y: 50, scale: 0.95 },
    center: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -50, scale: 0.95 }
  };

  // Input page
  if (currentPage === 0) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background grid */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 opacity-20">
            <ContributionGrid />
          </div>
          <div className="absolute bottom-1/4 right-1/4 opacity-20">
            <ContributionGrid />
          </div>
        </div>
        
        {/* Back to home button */}
        <Link 
          href="/"
          className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded-lg text-[#8b949e] hover:text-white transition-all"
        >
          <IconHome size={18} />
          <span className="text-sm">Back to Home</span>
        </Link>
        
        <motion.div 
          className="max-w-md w-full text-center z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            animate={{ 
              boxShadow: [
                "0 0 20px rgba(45,164,78,0.3)",
                "0 0 40px rgba(45,164,78,0.5)",
                "0 0 20px rgba(45,164,78,0.3)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-[#2da44e] to-[#238636] flex items-center justify-center"
          >
            <IconBrandGithub size={48} className="text-white" />
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <GitHubText>GitHub</GitHubText>
            <span className="text-white"> Wrapped</span>
          </h1>
          <p className="text-[#8b949e] text-lg mb-2">2024</p>
          <p className="text-[#8b949e] mb-8">
            Discover your coding journey this year
          </p>
          
          <div className="space-y-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchData()}
              placeholder="Enter your GitHub username"
              className="w-full px-6 py-4 rounded-xl bg-[#161b22] border border-[#30363d] text-white placeholder-[#484f58] focus:outline-none focus:border-[#2da44e] focus:ring-1 focus:ring-[#2da44e] transition-all text-lg"
            />
            
            {error && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[#f85149] text-sm"
              >
                {error}
              </motion.p>
            )}
            
            <motion.button
              onClick={fetchData}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-xl font-semibold text-lg bg-[#238636] hover:bg-[#2ea043] text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  Unwrap My Year
                  <IconArrowRight size={20} />
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!data) return null;

  // Navigation component
  const Navigation = () => (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-50">
      <motion.button
        onClick={prevPage}
        disabled={currentPage <= 1}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-12 h-12 rounded-full bg-[#21262d] border border-[#30363d] flex items-center justify-center text-[#8b949e] hover:text-white hover:border-[#2da44e] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <IconArrowLeft size={20} />
      </motion.button>
      
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5, 6, 7].map((page) => (
          <motion.div
            key={page}
            className={`w-2 h-2 rounded-full transition-all ${
              page === currentPage ? "bg-[#2da44e] w-6" : "bg-[#30363d]"
            }`}
          />
        ))}
      </div>
      
      <motion.button
        onClick={nextPage}
        disabled={currentPage >= 7}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-12 h-12 rounded-full bg-[#21262d] border border-[#30363d] flex items-center justify-center text-[#8b949e] hover:text-white hover:border-[#2da44e] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <IconArrowRight size={20} />
      </motion.button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0d1117] text-white overflow-hidden">
      {/* Back to home button */}
      <Link 
        href="/"
        className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded-lg text-[#8b949e] hover:text-white transition-all"
      >
        <IconHome size={18} />
        <span className="text-sm">Back to Home</span>
      </Link>
      
      <AnimatePresence mode="wait">
        {/* Page 1: Welcome */}
        {currentPage === 1 && (
          <motion.div
            key="page1"
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="min-h-screen flex flex-col items-center justify-center p-8"
          >
            <motion.img
              src={data.avatarUrl}
              alt={data.username}
              className="w-32 h-32 rounded-full border-4 border-[#2da44e] mb-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
            />
            
            <motion.div
              className="mb-4 px-4 py-2 bg-gradient-to-r from-[#238636] to-[#2da44e] rounded-full"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-white font-bold flex items-center gap-2">
                <Trophy size={18} />
                {data.hackerTitle}
              </span>
            </motion.div>
            
            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Welcome, <GitHubText>@{data.username}</GitHubText>
            </motion.h1>
            
            <motion.p
              className="text-xl md:text-2xl text-[#8b949e] text-center max-w-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {data.creativeTaglines?.welcome || `You've been busy coding this year!`}
            </motion.p>
            
            <motion.div
              className="mt-8 flex items-center gap-2 text-[#2da44e]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <span className="text-lg">{data.codingPersona}</span>
            </motion.div>
            
            <motion.div
              className="mt-8 flex items-center gap-2 text-[#8b949e]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <span>Swipe to continue</span>
              <IconArrowRight size={20} />
            </motion.div>
          </motion.div>
        )}

        {/* Page 2: Commits */}
        {currentPage === 2 && (
          <motion.div
            key="page2"
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="min-h-screen flex flex-col items-center justify-center p-8"
          >
            <motion.div
              className="w-20 h-20 rounded-full bg-gradient-to-br from-[#2da44e] to-[#238636] flex items-center justify-center mb-8"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring" }}
            >
              <GitCommit size={40} className="text-white" />
            </motion.div>
            
            <motion.h2
              className="text-2xl md:text-3xl text-[#8b949e] mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              You made
            </motion.h2>
            
            <motion.div
              className="text-7xl md:text-9xl font-bold mb-4"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
            >
              <GitHubText>{data.totalCommits.toLocaleString()}</GitHubText>
            </motion.div>
            
            <motion.h3
              className="text-3xl md:text-4xl text-white mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              commits this year
            </motion.h3>
            
            <motion.p
              className="text-xl text-[#8b949e] text-center max-w-lg mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {data.creativeTaglines?.contributions || `That's about ${Math.round(data.totalCommits / 365)} commits per day!`}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-[#2da44e]">{data.activeDays}</div>
                <div className="text-sm text-[#8b949e]">Active Days</div>
              </div>
              <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-[#2da44e]">{data.mostCodingDay}</div>
                <div className="text-sm text-[#8b949e]">Favorite Day</div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Page 3: Languages */}
        {currentPage === 3 && (
          <motion.div
            key="page3"
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="min-h-screen flex flex-col items-center justify-center p-8"
          >
            <motion.div
              className="w-20 h-20 rounded-full bg-gradient-to-br from-[#2da44e] to-[#238636] flex items-center justify-center mb-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
            >
              <Code size={40} className="text-white" />
            </motion.div>
            
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Your <GitHubText>Top Languages</GitHubText>
            </motion.h2>
            
            <motion.p
              className="text-[#8b949e] text-center max-w-lg mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {data.creativeTaglines?.languages || "Here's what you've been coding in!"}
            </motion.p>
            
            <div className="w-full max-w-lg space-y-4">
              {data.topLanguages && data.topLanguages.length > 0 ? (
                data.topLanguages.slice(0, 5).map((lang, index) => (
                  <motion.div
                    key={lang.name}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <div className="flex justify-between mb-2">
                      <span className="text-white font-medium">{lang.name}</span>
                      <span className="text-[#8b949e]">{lang.percent}%</span>
                    </div>
                    <div className="h-3 bg-[#21262d] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ 
                          backgroundColor: index === 0 ? "#2da44e" : 
                                          index === 1 ? "#238636" :
                                          index === 2 ? "#1a7f37" :
                                          index === 3 ? "#116329" : "#0e4429"
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${lang.percent}%` }}
                        transition={{ delay: 0.6 + index * 0.1, duration: 0.8 }}
                      />
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.p
                  className="text-[#8b949e] text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  No language data available
                </motion.p>
              )}
            </div>
            
            {data.newLanguage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="mt-8 bg-[#161b22] border border-[#30363d] rounded-xl p-4"
              >
                <p className="text-[#8b949e] text-center">
                  You also explored <GitHubText>{data.newLanguage}</GitHubText> this year! 🎉
                </p>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Page 4: Repos & Stars */}
        {currentPage === 4 && (
          <motion.div
            key="page4"
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="min-h-screen flex flex-col items-center justify-center p-8"
          >
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Building the <GitHubText>Future</GitHubText>
            </motion.h2>
            
            <motion.p
              className="text-[#8b949e] text-center max-w-lg mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {data.creativeTaglines?.repos || "Your repositories are making an impact!"}
            </motion.p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl w-full mb-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 text-center"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2da44e] to-[#238636] flex items-center justify-center mx-auto mb-3">
                  <Star size={24} className="text-white" />
                </div>
                <div className="text-3xl font-bold text-[#2da44e]">{data.totalStars}</div>
                <p className="text-[#8b949e] text-sm">Total Stars</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 text-center"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2da44e] to-[#238636] flex items-center justify-center mx-auto mb-3">
                  <GitPullRequest size={24} className="text-white" />
                </div>
                <div className="text-3xl font-bold text-[#2da44e]">{data.pullRequests}</div>
                <p className="text-[#8b949e] text-sm">Pull Requests</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 text-center col-span-2 md:col-span-1"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2da44e] to-[#238636] flex items-center justify-center mx-auto mb-3">
                  <IconBrandGithub size={24} className="text-white" />
                </div>
                <div className="text-3xl font-bold text-[#2da44e]">{data.reposContributed}</div>
                <p className="text-[#8b949e] text-sm">Repos Contributed</p>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl w-full"
            >
              <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
                <p className="text-[#8b949e] text-sm mb-1">Most Starred Repo</p>
                <p className="text-white font-medium truncate">{data.mostStarredRepo}</p>
              </div>
              <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
                <p className="text-[#8b949e] text-sm mb-1">Most Active Repo</p>
                <p className="text-white font-medium truncate">{data.mostActiveRepo}</p>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Page 5: Streak & Activity */}
        {currentPage === 5 && (
          <motion.div
            key="page5"
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="min-h-screen flex flex-col items-center justify-center p-8"
          >
            <motion.div
              className="w-24 h-24 rounded-full bg-gradient-to-br from-[#2da44e] to-[#238636] flex items-center justify-center mb-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
            >
              <Flame size={48} className="text-white" />
            </motion.div>
            
            <motion.h2
              className="text-2xl md:text-3xl text-[#8b949e] mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Your longest streak
            </motion.h2>
            
            <motion.div
              className="text-7xl md:text-9xl font-bold mb-4"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
            >
              <GitHubText>{data.longestStreak}</GitHubText>
            </motion.div>
            
            <motion.h3
              className="text-3xl md:text-4xl text-white mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              days in a row 🔥
            </motion.h3>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-4"
            >
              <ContributionGrid />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mt-8 grid grid-cols-2 gap-4"
            >
              <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 text-center">
                <div className="text-xl font-bold text-[#2da44e]">{data.mostProductiveDay}</div>
                <div className="text-sm text-[#8b949e]">Most Productive Day</div>
              </div>
              <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 text-center">
                <div className="text-xl font-bold text-[#2da44e]">{data.issuesRaised}</div>
                <div className="text-sm text-[#8b949e]">Issues Raised</div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Page 6: Fun Facts */}
        {currentPage === 6 && (
          <motion.div
            key="page6"
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="min-h-screen flex flex-col items-center justify-center p-8"
          >
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <GitHubText>Fun Facts</GitHubText> About You
            </motion.h2>
            
            <div className="max-w-xl w-full space-y-4">
              {data.funFacts && data.funFacts.length > 0 ? (
                data.funFacts.map((fact, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.2 }}
                    className="bg-[#161b22] border border-[#30363d] rounded-xl p-6"
                  >
                    <p className="text-white text-lg">{fact}</p>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 text-center"
                >
                  <p className="text-[#8b949e]">No fun facts available</p>
                </motion.div>
              )}
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mt-8 bg-gradient-to-br from-[#238636] to-[#2da44e] rounded-xl p-6 max-w-md text-center"
            >
              <p className="text-white font-bold text-xl">
                {data.creativeTaglines?.personality || `You're a ${data.codingPersona}!`}
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* Page 7: Share */}
        {currentPage === 7 && (
          <motion.div
            key="page7"
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="min-h-screen flex flex-col items-center justify-center p-8"
          >
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Share Your <GitHubText>2024</GitHubText>
            </motion.h2>
            
            <motion.p
              className="text-[#8b949e] text-center max-w-lg mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {data.creativeTaglines?.share || "Show off your coding journey!"}
            </motion.p>
            
            {/* Share Card */}
            <motion.div
              ref={shareRef}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-[#0d1117] border border-[#30363d] rounded-2xl p-8 max-w-md w-full"
            >
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={data.avatarUrl}
                  alt={data.username}
                  className="w-16 h-16 rounded-full border-2 border-[#2da44e]"
                />
                <div>
                  <h3 className="text-xl font-bold text-white">@{data.username}</h3>
                  <p className="text-[#8b949e]">GitHub Wrapped 2025</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[#161b22] rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-[#2da44e]">{data.totalCommits}</div>
                  <div className="text-sm text-[#8b949e]">Commits</div>
                </div>
                <div className="bg-[#161b22] rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-[#2da44e]">{data.reposContributed}</div>
                  <div className="text-sm text-[#8b949e]">Repos</div>
                </div>
                <div className="bg-[#161b22] rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-[#2da44e]">{data.longestStreak}</div>
                  <div className="text-sm text-[#8b949e]">Day Streak</div>
                </div>
                <div className="bg-[#161b22] rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-[#2da44e]">{data.topLanguages?.[0]?.name || "N/A"}</div>
                  <div className="text-sm text-[#8b949e]">Top Language</div>
                </div>
              </div>
              
              <div className="text-center mb-4">
                <span className="inline-block px-4 py-2 bg-gradient-to-r from-[#238636] to-[#2da44e] rounded-full text-white font-bold text-sm">
                  🏆 {data.hackerTitle}
                </span>
              </div>
              
              <div className="text-center">
                <ContributionGrid />
              </div>
              
              <div className="mt-6 pt-4 border-t border-[#30363d] flex items-center justify-center gap-2 text-[#8b949e]">
                <IconBrandGithub size={16} />
                <span className="text-sm">quantsprogrammer.com</span>
              </div>
            </motion.div>
            
            <motion.button
              onClick={downloadImage}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 px-8 py-4 bg-[#238636] hover:bg-[#2ea043] rounded-xl font-semibold flex items-center gap-3 text-white transition-all"
            >
              <IconDownload size={20} />
              Download Card
            </motion.button>
            
            <motion.button
              onClick={() => {
                setCurrentPage(0);
                setData(null);
                setUsername("");
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-4 text-[#8b949e] hover:text-white transition-colors"
            >
              Start Over
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      
      <Navigation />
    </div>
  );
}
