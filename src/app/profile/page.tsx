"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-hot-toast";
import Certificate from "@/components/component/Certificate";
import ReactConfetti from "react-confetti";
import InterviewHistory from "./InterviewHistory";

interface User {
  username: string;
  email: string;
  isVerified: boolean;
  checkedData: Array<{ module: string; completed: boolean }> | null;
  fullName?: string;
  address?: string;
  age?: string;
  college?: string;
  gender?: string;
  contactNumber?: string;
  _id?: string;
  isAdmin?: boolean;
}

// Cache management
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Enhanced cached fetch with improved error handling
const cachedFetch = async (url: string, options?: RequestInit) => {
  const cacheKey = `${url}_${JSON.stringify(options)}`;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    
    cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
    
    return data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
};

export default function ProfilePage() {
  // All hooks and logic above

  // All hooks and logic above

  const router = useRouter();
  const [userData, setUserData] = useState<User | null>(null);
  const [frontendCheckedItems, setFrontendCheckedItems] = useState<string[]>([]);
  const [FullStackCheckedItems, setFullStackCheckedItems] = useState<string[]>([]);
  const [backendCheckedItems, setBackendCheckedItems] = useState<string[]>([]);
  const [dataAnalysisCheckedItems, setDataAnalysisCheckedItems] = useState<string[]>([]);
  const [loadingFrontend, setLoadingFrontend] = useState<boolean>(true);
  const [loadingFullStack, setLoadingFullStack] = useState<boolean>(true);
  const [loadingBackend, setLoadingBackend] = useState<boolean>(true);
  const [loadingDataAnalysis, setLoadingDataAnalysis] = useState<boolean>(true);
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, { completedTasks: string[]; completedAssignments: string[] }>>({});
  const [loadingRoadmaps, setLoadingRoadmaps] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<User | null>(null);
  const [blogRequest, setBlogRequest] = useState<any>(null);
  const [canCreateBlog, setCanCreateBlog] = useState(false);

  // Cached user data fetching
  const fetchUserDetails = useCallback(async () => {
    try {
      const res = await axios.get("/api/users/me");
      setUserData(res.data.user);
    } catch (error: any) {
      console.error(error.message);
      toast.error("Failed to fetch user details");
    }
  }, []);

  // Cached roadmaps and progress fetching
  const fetchRoadmapsAndProgress = useCallback(async () => {
    setLoadingRoadmaps(true);
    try {
      const data = await cachedFetch("/api/roadmap/fetchall");
      setRoadmaps(data.roadmaps || []);
      
      // Fetch progress for each roadmap with caching
      const progressObj: Record<string, { completedTasks: string[]; completedAssignments: string[] }> = {};
      for (const roadmap of data.roadmaps) {
        try {
          const progressData = await cachedFetch(`/api/roadmap/progress?roadmapId=${roadmap._id}`);
          progressObj[roadmap._id] = progressData.progress || { completedTasks: [], completedAssignments: [] };
        } catch {
          progressObj[roadmap._id] = { completedTasks: [], completedAssignments: [] };
        }
      }
      setProgressMap(progressObj);
    } catch (error) {
      console.error("Error fetching roadmaps or progress", error);
    }
    setLoadingRoadmaps(false);
  }, []);

  useEffect(() => {
    fetchUserDetails();
    fetchRoadmapsAndProgress();
  }, [fetchUserDetails, fetchRoadmapsAndProgress]);

  useEffect(() => {
    if (userData) setEditData(userData);
  }, [userData]);

  useEffect(() => {
    const fetchBlogRequest = async () => {
      if (!userData) return;
      try {
        const res = await axios.get(`/api/blogs/request?userId=${userData._id}`);
        setBlogRequest(res.data.request || null);
        setCanCreateBlog(!!userData.isAdmin || (res.data.request && res.data.request.status === "accepted"));
      } catch {
        setBlogRequest(null);
        setCanCreateBlog(!!userData.isAdmin);
      }
    };
    fetchBlogRequest();
  }, [userData]);

  // Calculate progress for each roadmap from DB data
  const progressData = useMemo(() =>
    roadmaps.map((roadmap) => {
      const totalTasks = roadmap.phases?.reduce((acc: number, phase: any) => acc + (phase.tasks?.length || 0), 0) || 0;
      const totalAssignments = roadmap.phases?.reduce((acc: number, phase: any) => acc + (phase.assignments?.length || 0), 0) || 0;
      const progress = progressMap[roadmap._id] || { completedTasks: [], completedAssignments: [] };
      const completedTasks = progress.completedTasks.length;
      const completedAssignments = progress.completedAssignments.length;
      const percent = totalTasks + totalAssignments === 0 ? 0 : Math.round(((completedTasks + completedAssignments) / (totalTasks + totalAssignments)) * 100);
      return {
        label: roadmap.title,
        percent,
        color: "from-blue-500 to-purple-700", // You can customize per roadmap if needed
      };
    }),
    [roadmaps, progressMap]
  );

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editData) return;
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await axios.post("/api/users/updateprofile", editData);
      toast.success("Profile updated");
      setEditMode(false);
      setUserData(editData);
    } catch (error: any) {
      toast.error("Failed to update profile");
    }
  };

  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logout successful");
      router.push("/auth/login");
    } catch (error: any) {
      console.error(error.message);
      toast.error(error.message);
    }
  };

  // --- All hooks and logic above ---

  // --- Main Render ---
  // Main Render
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 relative overflow-hidden">
      {/* Enhanced Background Effects - matching HeroPage exactly */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-900 to-black"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(37,99,235,0.12),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(29,78,216,0.08),transparent_70%)]"></div>
      
      {/* Animated Grid Pattern - matching HeroPage exactly */}
      <div className="absolute inset-0 opacity-20">
        <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)]"></div>
      </div>

      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        onClick={() => router.back()}
        className="fixed top-6 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        <span className="hidden sm:inline">Back</span>
      </motion.button>

      <div className="relative z-10 max-w-7xl mx-auto w-full py-16">
        {/* Header - matching hero section style */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6 sm:mb-8"
          >
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full text-sm text-zinc-300 mb-4 sm:mb-6 hover:bg-white/15 transition-all duration-300">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Your Developer Profile</span>
            </div>
            
            {/* Main Heading - Hero style */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-blue-300 mb-4 sm:mb-6 leading-[0.85] tracking-tight text-center">
              Master Your
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600">
                Tech Journey
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-zinc-300 font-medium max-w-2xl md:max-w-4xl mx-auto mb-6 sm:mb-8 leading-relaxed px-4 text-center">
              Track progress, manage learning paths, and accelerate your development career
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="lg:col-span-1"
            >
              <div className="p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl">
                {/* Avatar */}
                <div className="text-center mb-8">
                  <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl font-bold text-white shadow-2xl mb-4">
                    {userData?.username?.[0]?.toUpperCase()}
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {userData?.fullName || userData?.username}
                  </h2>
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                    userData?.isVerified 
                      ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                      : "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                  }`}>
                    {userData?.isVerified ? "✓ Verified" : "⚠ Not Verified"}
                  </span>
                </div>

                {/* Profile Information */}
                {editMode ? (
                  <div className="space-y-4">
                    <input
                      name="fullName"
                      value={editData?.fullName || ""}
                      onChange={handleEditChange}
                      placeholder="Full Name"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-zinc-400 focus:border-purple-500 focus:outline-none"
                    />
                    <input
                      name="address"
                      value={editData?.address || ""}
                      onChange={handleEditChange}
                      placeholder="Address"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-zinc-400 focus:border-purple-500 focus:outline-none"
                    />
                    <input
                      name="age"
                      value={editData?.age || ""}
                      onChange={handleEditChange}
                      placeholder="Age"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-zinc-400 focus:border-purple-500 focus:outline-none"
                    />
                    <input
                      name="college"
                      value={editData?.college || ""}
                      onChange={handleEditChange}
                      placeholder="College"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-zinc-400 focus:border-purple-500 focus:outline-none"
                    />
                    <input
                      name="gender"
                      value={editData?.gender || ""}
                      onChange={handleEditChange}
                      placeholder="Gender"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-zinc-400 focus:border-purple-500 focus:outline-none"
                    />
                    <input
                      name="contactNumber"
                      value={editData?.contactNumber || ""}
                      onChange={handleEditChange}
                      placeholder="Contact Number"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-zinc-400 focus:border-purple-500 focus:outline-none"
                    />
                    <input
                      value={userData?.email}
                      disabled
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                    />
                    
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleSave}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-500 hover:to-emerald-500 transition-all duration-300"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditMode(false)}
                        className="flex-1 px-4 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500 transition-all duration-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                      {[
                        { label: "Email", value: userData?.email },
                        { label: "Address", value: userData?.address || "Not provided" },
                        { label: "Age", value: userData?.age || "Not provided" },
                        { label: "College", value: userData?.college || "Not provided" },
                        { label: "Gender", value: userData?.gender || "Not provided" },
                        { label: "Contact", value: userData?.contactNumber || "Not provided" }
                      ].map((item, index) => (
                        <div key={item.label} className="p-3 bg-white/5 rounded-lg border border-white/10">
                          <p className="text-xs text-zinc-400 mb-1">{item.label}</p>
                          <p className="text-white font-medium">{item.value}</p>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => setEditMode(true)}
                      className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2l-6 6m-2 2h6a2 2 0 002-2v-6a2 2 0 00-2-2H7a2 2 0 00-2 2v6a2 2 0 002 2z" />
                      </svg>
                      Edit Profile
                    </button>

                    {canCreateBlog && (
                      <button
                        onClick={() => router.push('/blogs/create')}
                        className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-lg hover:from-green-500 hover:to-teal-500 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Create Blog
                      </button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Progress Section */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  Roadmap Progress
                </h3>

                {loadingRoadmaps ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                  </div>
                ) : progressData.length === 0 ? (
                  <div className="text-center text-zinc-400 py-12">
                    <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-lg">No roadmaps found</p>
                    <p className="text-sm">Start learning with our interactive roadmaps!</p>
                  </div>
                ) : (
                  <div className="space-y-6 max-h-96 overflow-y-auto custom-scrollbar">
                    {progressData.map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        className="p-6 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-300"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-lg font-semibold text-white">{item.label}</h4>
                          <span className="text-2xl font-bold text-purple-400">{item.percent}%</span>
                        </div>
                        <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.percent}%` }}
                            transition={{ duration: 1, delay: idx * 0.2 }}
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                          />
                        </div>
                        <div className="mt-2 text-sm text-zinc-400">
                          {item.percent === 100 ? "Completed! 🎉" : `${100 - item.percent}% remaining`}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Interview History Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-12"
          >
            <InterviewHistory userId={userData?._id} />
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-12 text-center bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl"
          >
            <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">
              Ready to Advance Your Career?
            </h3>
            <p className="text-zinc-300 mb-6 max-w-2xl mx-auto text-base">
              Access all the tools you need to accelerate your tech journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/forgotpassword"
                className="px-8 py-4 bg-white/10 backdrop-blur-lg border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                <a href="/auth/changepassword" className="text-blue-400 hover:underline font-medium">Change Password</a>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-xl hover:shadow-blue-500/25 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
  );
}
