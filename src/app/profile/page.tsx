"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import InterviewHistory from "./InterviewHistory";
import Certificate from "@/components/component/Certificate";
import { ProfilePhotoModal, CodingProfilesModal } from "@/components/component/CodingProfileModals";
import { 
  User, Mail, MapPin, GraduationCap, Phone, Calendar, 
  Edit3, Save, X, LogOut, Key, ChevronRight, BarChart3,
  Trophy, BookOpen, ArrowLeft, Menu, Settings, PenSquare,
  CheckCircle, AlertCircle, Award, FileText, Eye, Download,
  Camera, Code2, Share2, ExternalLink, Github, Zap
} from "lucide-react";

interface CodingProfile {
  username?: string;
  stats?: {
    totalCommits?: number;
    publicRepos?: number;
    followers?: number;
    following?: number;
    totalStars?: number;
    totalSolved?: number;
    easySolved?: number;
    mediumSolved?: number;
    hardSolved?: number;
    ranking?: number;
    acceptanceRate?: number;
    rating?: number;
    maxRating?: number;
    rank?: string;
    problemsSolved?: number;
    contests?: number;
    stars?: string;
    globalRank?: number;
  };
  lastFetched?: Date;
}

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
  profilePhoto?: {
    url?: string;
    publicId?: string;
    uploadedAt?: Date;
  };
  codingProfiles?: {
    github?: CodingProfile;
    leetcode?: CodingProfile;
    codeforces?: CodingProfile;
    codechef?: CodingProfile;
  };
  sampleTestAttempt?: {
    completed: boolean;
    score: number;
    totalMarks: number;
    percentage: number;
    passed: boolean;
    certificateId: string;
    completedAt: string;
    answers: any[];
  };
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
  const searchParams = useSearchParams();
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'history' | 'certificates' | 'tests' | 'coding'>('overview');
  const [certifications, setCertifications] = useState<any[]>([]);
  const [loadingCerts, setLoadingCerts] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState<any>(null);
  const [testAttempts, setTestAttempts] = useState<Record<string, any>>({});
  
  // Coding Profiles & Photo Modal States
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showCodingModal, setShowCodingModal] = useState(false);
  const [codingProfiles, setCodingProfiles] = useState<any>({});
  const [loadingProfiles, setLoadingProfiles] = useState(false);

  // Cached user data fetching
  const fetchUserDetails = useCallback(async () => {
    try {
      const res = await axios.get("/api/users/me");
      setUserData(res.data.user);
      // Also set coding profiles from user data
      if (res.data.user?.codingProfiles) {
        setCodingProfiles(res.data.user.codingProfiles);
      }
    } catch (error: any) {
      console.error(error.message);
      toast.error("Failed to fetch user details");
    }
  }, []);

  // Fetch coding profiles separately
  const fetchCodingProfiles = useCallback(async () => {
    setLoadingProfiles(true);
    try {
      const res = await axios.get("/api/users/coding-profiles");
      if (res.data.codingProfiles) {
        setCodingProfiles(res.data.codingProfiles);
      }
    } catch (error) {
      console.error("Error fetching coding profiles:", error);
    }
    setLoadingProfiles(false);
  }, []);

  // Handle profile photo update
  const handlePhotoUpdate = useCallback(async (photoData: { url?: string; publicId?: string } | null) => {
    if (userData) {
      setUserData({
        ...userData,
        profilePhoto: photoData ? { ...photoData, uploadedAt: new Date() } : undefined
      });
    }
    setShowPhotoModal(false);
  }, [userData]);

  // Handle coding profile update
  const handleProfilesUpdate = useCallback(async () => {
    await fetchCodingProfiles();
    await fetchUserDetails();
    setShowCodingModal(false);
  }, [fetchCodingProfiles, fetchUserDetails]);

  // Calculate total problems solved
  const totalProblemsSolved = useMemo(() => {
    let total = 0;
    if (codingProfiles?.leetcode?.stats?.totalSolved) {
      total += codingProfiles.leetcode.stats.totalSolved;
    }
    if (codingProfiles?.codeforces?.stats?.problemsSolved) {
      total += codingProfiles.codeforces.stats.problemsSolved;
    }
    if (codingProfiles?.codechef?.stats?.problemsSolved) {
      total += codingProfiles.codechef.stats.problemsSolved;
    }
    return total;
  }, [codingProfiles]);

  // Fetch roadmaps and progress (no cache for progress to get fresh data)
  const fetchRoadmapsAndProgress = useCallback(async () => {
    setLoadingRoadmaps(true);
    try {
      const data = await cachedFetch("/api/roadmap/fetchall");
      console.log("Fetched roadmaps:", data.roadmaps);
      setRoadmaps(data.roadmaps || []);
      
      // Fetch progress for each roadmap WITHOUT caching to get fresh data
      const progressObj: Record<string, { completedTasks: string[]; completedAssignments: string[] }> = {};
      const testAttemptsObj: Record<string, any> = {};
      
      // Get token from localStorage for Authorization header (same as roadmap page)
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      
      for (const roadmap of data.roadmaps) {
        try {
          // Use fetch with Authorization header (same method as roadmap page)
          console.log(`Fetching progress for roadmap: ${roadmap._id} (${roadmap.title})`);
          const progressRes = await fetch(`/api/roadmap/progress?roadmapId=${roadmap._id}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
          const progressData = await progressRes.json();
          console.log(`Progress data for ${roadmap.title}:`, progressData);
          
          if (progressData.progress) {
            progressObj[roadmap._id] = progressData.progress;
          } else {
            console.log(`No progress found for ${roadmap.title}, using empty`);
            progressObj[roadmap._id] = { completedTasks: [], completedAssignments: [] };
          }
          
          // Fetch test eligibility for each roadmap
          const testRes = await fetch(`/api/roadmap-test?roadmapId=${roadmap._id}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
          const testData = await testRes.json();
          console.log(`Test eligibility for ${roadmap.title}:`, testData);
          testAttemptsObj[roadmap._id] = testData;
        } catch (err: any) {
          console.error(`Error fetching progress for ${roadmap.title}:`, err.message);
          progressObj[roadmap._id] = { completedTasks: [], completedAssignments: [] };
        }
      }
      console.log("Final progressMap:", progressObj);
      console.log("Final testAttempts:", testAttemptsObj);
      setProgressMap(progressObj);
      setTestAttempts(testAttemptsObj);
    } catch (error) {
      console.error("Error fetching roadmaps or progress", error);
    }
    setLoadingRoadmaps(false);
  }, []);

  useEffect(() => {
    fetchUserDetails();
    fetchRoadmapsAndProgress();
    // Also fetch coding profiles on page load
    fetchCodingProfiles();
  }, [fetchUserDetails, fetchRoadmapsAndProgress]);

  // Auto refresh coding profiles when visiting the coding tab
  useEffect(() => {
    if (activeTab === 'coding') {
      fetchCodingProfiles();
    }
  }, [activeTab, fetchCodingProfiles]);

  // Auto fetch coding profiles when opening the modal
  useEffect(() => {
    if (showCodingModal) {
      fetchCodingProfiles();
    }
  }, [showCodingModal, fetchCodingProfiles]);

  // Open coding modal only when in coding tab
  const openCodingModal = (openImmediately = true) => {
    if (activeTab !== 'coding') {
      setActiveTab('coding');
      if (openImmediately) setTimeout(() => setShowCodingModal(true), 200);
    } else {
      setShowCodingModal(true);
    }
  };

  // Handle tab query parameter
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['overview', 'progress', 'tests', 'certificates', 'history'].includes(tab)) {
      setActiveTab(tab as any);
    }
  }, [searchParams]);

  // Fetch certifications
  useEffect(() => {
    const fetchCertifications = async () => {
      if (!userData?._id) return;
      setLoadingCerts(true);
      try {
        const res = await axios.get(`/api/certification?userId=${userData._id}`);
        setCertifications(res.data.certifications || []);
      } catch (error) {
        console.error("Error fetching certifications:", error);
      }
      setLoadingCerts(false);
    };
    fetchCertifications();
  }, [userData?._id]);

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
  const progressData = useMemo(() => {
    console.log("=== CALCULATING PROGRESS DATA ===");
    console.log("Roadmaps:", roadmaps);
    console.log("Progress Map:", progressMap);
    
    return roadmaps.map((roadmap) => {
      const totalTasks = roadmap.phases?.reduce((acc: number, phase: any) => acc + (phase.tasks?.length || 0), 0) || 0;
      const totalAssignments = roadmap.phases?.reduce((acc: number, phase: any) => acc + (phase.assignments?.length || 0), 0) || 0;
      const progress = progressMap[roadmap._id] || { completedTasks: [], completedAssignments: [] };
      const completedTasks = progress.completedTasks?.length || 0;
      const completedAssignments = progress.completedAssignments?.length || 0;
      const percent = totalTasks + totalAssignments === 0 ? 0 : Math.round(((completedTasks + completedAssignments) / (totalTasks + totalAssignments)) * 100);
      
      console.log(`Roadmap: ${roadmap.title}`);
      console.log(`  - Total Tasks: ${totalTasks}, Total Assignments: ${totalAssignments}`);
      console.log(`  - Completed Tasks: ${completedTasks}, Completed Assignments: ${completedAssignments}`);
      console.log(`  - Percent: ${percent}%`);
      
      return {
        label: roadmap.title,
        percent,
        color: "from-blue-500 to-purple-700", // You can customize per roadmap if needed
      };
    });
  },
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
              <User className="w-5 h-5 text-blue-400" />
              <span className="hidden sm:inline">My Profile</span>
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
                onClick={() => router.push('/explore')}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Explore
              </button>
              <button
                onClick={() => router.push('/interview')}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Interview
              </button>
              {userData?.isAdmin && (
                <button
                  onClick={() => router.push('/admin/admin-panel')}
                  className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                >
                  <Settings className="w-4 h-4" />
                  Admin
                </button>
              )}
            </nav>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <nav className="md:hidden pt-4 pb-2 flex flex-col gap-2 border-t border-white/5 mt-4">
              <button
                onClick={() => { router.push('/explore'); setMobileMenuOpen(false); }}
                className="text-left py-2 text-gray-400 hover:text-white transition-colors"
              >
                Explore
              </button>
              <button
                onClick={() => { router.push('/interview'); setMobileMenuOpen(false); }}
                className="text-left py-2 text-gray-400 hover:text-white transition-colors"
              >
                Interview
              </button>
              {userData?.isAdmin && (
                <button
                  onClick={() => { router.push('/admin/admin-panel'); setMobileMenuOpen(false); }}
                  className="text-left py-2 text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                >
                  <Settings className="w-4 h-4" />
                  Admin Panel
                </button>
              )}
            </nav>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Profile Header Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#111118] border border-white/5 rounded-2xl p-6 sm:p-8 mb-6"
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar with Edit Photo Button */}
            <div className="relative group">
              {userData?.profilePhoto?.url ? (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-lg shadow-blue-500/20">
                  <Image
                    src={userData.profilePhoto.url}
                    alt="Profile"
                    width={112}
                    height={112}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-4xl font-bold text-white shadow-lg shadow-blue-500/20">
                  {userData?.username?.[0]?.toUpperCase() || '?'}
                </div>
              )}
              {/* Edit Photo Overlay */}
              <button
                onClick={() => setShowPhotoModal(true)}
                className="absolute inset-0 rounded-2xl bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
              >
                <Camera className="w-6 h-6 text-white" />
              </button>
              <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${
                userData?.isVerified ? 'bg-green-500' : 'bg-amber-500'
              }`}>
                {userData?.isVerified ? (
                  <CheckCircle className="w-4 h-4 text-white" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-white" />
                )}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                {userData?.fullName || userData?.username || 'Loading...'}
              </h2>
              <p className="text-gray-400 mb-3">@{userData?.username}</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                  userData?.isVerified 
                    ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}>
                  {userData?.isVerified ? (
                    <><CheckCircle className="w-3 h-3" /> Verified</>
                  ) : (
                    <><AlertCircle className="w-3 h-3" /> Not Verified</>
                  )}
                </span>
                {userData?.isAdmin && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <Settings className="w-3 h-3" /> Admin
                  </span>
                )}
                {userData?.college && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <GraduationCap className="w-3 h-3" /> {userData.college}
                  </span>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-row sm:flex-col gap-2">
              <button
                onClick={() => openCodingModal()}
                className="p-2 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 hover:from-emerald-500/20 hover:to-cyan-500/20 border border-emerald-500/20 rounded-lg text-emerald-400 hover:text-emerald-300 transition-all"
                title="Coding Profiles"
              >
                <Code2 className="w-5 h-5" />
              </button>
              <Link
                href={`/u/${userData?.username}`}
                className="p-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 border border-purple-500/20 rounded-lg text-purple-400 hover:text-purple-300 transition-all"
                title="View Public Profile"
              >
                <ExternalLink className="w-5 h-5" />
              </Link>
              <button
                onClick={() => setEditMode(true)}
                className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-400 hover:text-white transition-all"
                title="Edit Profile"
              >
                <Edit3 className="w-5 h-5" />
              </button>
              <button
                onClick={logout}
                className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition-all"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: 'Overview', icon: User },
            { id: 'coding', label: 'Coding Profiles', icon: Code2 },
            { id: 'progress', label: 'Progress', icon: BarChart3 },
            { id: 'tests', label: 'Tests', icon: FileText },
            { id: 'certificates', label: 'Certificates', icon: Award },
            { id: 'history', label: 'Interview History', icon: Trophy },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.id === 'tests' && Object.values(testAttempts).filter((t: any) => t?.canTakeTest || t?.canRetry).length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                  {Object.values(testAttempts).filter((t: any) => t?.canTakeTest || t?.canRetry).length}
                </span>
              )}
              {tab.id === 'certificates' && certifications.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                  {certifications.length}
                </span>
              )}
            </button>
          ))}
        </div>



        {/* Add Coding Profiles CTA (when no profiles exist) */}
        {!codingProfiles?.github?.username && !codingProfiles?.leetcode?.username && 
         !codingProfiles?.codeforces?.username && !codingProfiles?.codechef?.username && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-[#111118] to-[#0a0a0f] border border-emerald-500/20 rounded-2xl p-6 mb-6 text-center"
          >
            <div className="p-3 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-xl w-fit mx-auto mb-4">
              <Code2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Showcase Your Coding Journey</h3>
            <p className="text-gray-400 mb-4 max-w-md mx-auto">
              Connect your coding profiles from GitHub, LeetCode, Codeforces, and CodeChef to display your achievements and share with others.
            </p>
            <button
              onClick={() => openCodingModal()}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 rounded-xl text-white font-medium transition-all inline-flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Add Coding Profiles
            </button>
          </motion.div>
        )}

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Details */}
            <div className="lg:col-span-2 bg-[#111118] border border-white/5 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-400" />
                  Profile Information
                </h3>
                {!editMode && (
                  <button
                    onClick={() => setEditMode(true)}
                    className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </button>
                )}
              </div>

              {editMode ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500 mb-1.5 block">Full Name</label>
                      <input
                        name="fullName"
                        value={editData?.fullName || ""}
                        onChange={handleEditChange}
                        placeholder="Enter your full name"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-blue-500/50 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1.5 block">Age</label>
                      <input
                        name="age"
                        value={editData?.age || ""}
                        onChange={handleEditChange}
                        placeholder="Enter your age"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-blue-500/50 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1.5 block">Gender</label>
                      <input
                        name="gender"
                        value={editData?.gender || ""}
                        onChange={handleEditChange}
                        placeholder="Enter your gender"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-blue-500/50 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1.5 block">Contact Number</label>
                      <input
                        name="contactNumber"
                        value={editData?.contactNumber || ""}
                        onChange={handleEditChange}
                        placeholder="Enter your contact number"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-blue-500/50 focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs text-gray-500 mb-1.5 block">College/University</label>
                      <input
                        name="college"
                        value={editData?.college || ""}
                        onChange={handleEditChange}
                        placeholder="Enter your college"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-blue-500/50 focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs text-gray-500 mb-1.5 block">Address</label>
                      <input
                        name="address"
                        value={editData?.address || ""}
                        onChange={handleEditChange}
                        placeholder="Enter your address"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-blue-500/50 focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs text-gray-500 mb-1.5 block">Email (cannot be changed)</label>
                      <input
                        value={userData?.email}
                        disabled
                        className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-gray-500 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSave}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditMode(false)}
                      className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: Mail, label: "Email", value: userData?.email },
                    { icon: MapPin, label: "Address", value: userData?.address },
                    { icon: Calendar, label: "Age", value: userData?.age },
                    { icon: GraduationCap, label: "College", value: userData?.college },
                    { icon: User, label: "Gender", value: userData?.gender },
                    { icon: Phone, label: "Contact", value: userData?.contactNumber }
                  ].map((item) => (
                    <div key={item.label} className="p-4 bg-white/5 rounded-xl border border-white/5">
                      <div className="flex items-center gap-2 mb-2">
                        <item.icon className="w-4 h-4 text-gray-500" />
                        <span className="text-xs text-gray-500">{item.label}</span>
                      </div>
                      <p className="text-white font-medium">{item.value || "Not provided"}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions Sidebar */}
            <div className="space-y-4">
              {/* Create Blog Card */}
              {canCreateBlog && (
                <div className="bg-[#111118] border border-white/5 rounded-2xl p-5">
                  <h4 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
                    <PenSquare className="w-4 h-4 text-green-400" />
                    Content Creator
                  </h4>
                  <p className="text-sm text-gray-500 mb-4">You have permission to create and publish blog posts.</p>
                  <button
                    onClick={() => router.push('/blogs/create')}
                    className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <PenSquare className="w-4 h-4" />
                    Create Blog
                  </button>
                </div>
              )}

              {/* Account Security */}
              <div className="bg-[#111118] border border-white/5 rounded-2xl p-5">
                <h4 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
                  <Key className="w-4 h-4 text-blue-400" />
                  Account Security
                </h4>
                <div className="space-y-2">
                  <Link
                    href="/auth/forgotpassword"
                    className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all group"
                  >
                    <span className="text-sm">Change Password</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full flex items-center justify-between p-3 bg-red-500/10 hover:bg-red-500/20 rounded-xl text-red-400 hover:text-red-300 transition-all group"
                  >
                    <span className="text-sm">Logout</span>
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-[#111118] border border-white/5 rounded-2xl p-5">
                <h4 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-purple-400" />
                  Quick Stats
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Roadmaps</span>
                    <span className="text-white font-medium">{roadmaps.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Avg. Progress</span>
                    <span className="text-white font-medium">
                      {progressData.length > 0 
                        ? Math.round(progressData.reduce((a, b) => a + b.percent, 0) / progressData.length)
                        : 0}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Completed</span>
                    <span className="text-green-400 font-medium">
                      {progressData.filter(p => p.percent === 100).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Certificates</span>
                    <span className="text-yellow-400 font-medium">{certifications.length}</span>
                  </div>
                </div>

                {/* Quick Test Link */}
                {progressData.some(p => p.percent === 100) && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <button
                      onClick={() => setActiveTab('progress')}
                      className="w-full py-2 text-sm text-yellow-400 bg-yellow-500/10 rounded-lg hover:bg-yellow-500/20 transition-colors flex items-center justify-center gap-2"
                    >
                      <Award className="w-4 h-4" />
                      View Available Tests
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="space-y-6">
            {/* Roadmap Progress */}
            <div className="bg-[#111118] border border-white/5 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                Roadmap Progress
              </h3>

              {loadingRoadmaps ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-gray-400 text-sm">Loading progress...</span>
                  </div>
                </div>
              ) : progressData.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-blue-400" />
                  </div>
                  <h4 className="text-lg font-medium text-white mb-2">No roadmaps started</h4>
                  <p className="text-gray-500 text-sm mb-4">Start learning with our interactive roadmaps!</p>
                  <button
                    onClick={() => router.push('/explore')}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium"
                  >
                    Explore Roadmaps
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {progressData.map((item, idx) => {
                    const roadmap = roadmaps[idx];
                    const testInfo = testAttempts[roadmap?._id];
                    
                    return (
                      <div
                        key={idx}
                        className="p-5 bg-white/5 border border-white/5 rounded-xl hover:border-white/10 transition-all"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-white">{item.label}</h4>
                          <span className={`text-lg font-bold ${
                            item.percent === 100 ? 'text-green-400' : 
                            item.percent >= 50 ? 'text-blue-400' : 'text-gray-400'
                          }`}>
                            {item.percent}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-3">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              item.percent === 100 
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                                : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                            }`}
                            style={{ width: `${item.percent}%` }}
                          />
                        </div>
                        
                        {/* Test Status Section */}
                        {item.percent === 100 && (
                          <div className="mt-3 pt-3 border-t border-white/10">
                            {testInfo?.hasAttempted ? (
                              testInfo?.attempt?.passed ? (
                                <div className="flex items-center justify-between">
                                  <span className="text-green-400 text-sm flex items-center gap-1">
                                    <CheckCircle className="w-4 h-4" />
                                    Test Passed ({testInfo.attempt.percentage}%)
                                  </span>
                                  <button
                                    onClick={() => setActiveTab('certificates')}
                                    className="text-xs px-3 py-1 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30"
                                  >
                                    View Certificate
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center justify-between">
                                  <span className="text-red-400 text-sm flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    Test Failed ({testInfo.attempt.percentage}%)
                                  </span>
                                  {testInfo?.canRetry && (
                                    <button
                                      onClick={() => router.push(`/roadmap-test?roadmapId=${roadmap._id}`)}
                                      className="text-xs px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30"
                                    >
                                      Retry Test
                                    </button>
                                  )}
                                </div>
                              )
                            ) : testInfo?.canTakeTest ? (
                              <div className="flex items-center justify-between">
                                <span className="text-yellow-400 text-sm flex items-center gap-1">
                                  <Award className="w-4 h-4" />
                                  Test Available
                                </span>
                                <button
                                  onClick={() => router.push(`/roadmap-test?roadmapId=${roadmap._id}`)}
                                  className="text-xs px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30"
                                >
                                  Take Test
                                </button>
                              </div>
                            ) : !testInfo?.hasFullDetails ? (
                              <div className="flex items-center justify-between">
                                <span className="text-amber-400 text-sm flex items-center gap-1">
                                  <AlertCircle className="w-4 h-4" />
                                  Complete profile first
                                </span>
                                <button
                                  onClick={() => setEditMode(true)}
                                  className="text-xs px-3 py-1 bg-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/30"
                                >
                                  Update Profile
                                </button>
                              </div>
                            ) : (
                              <span className="text-gray-500 text-sm">🎉 Completed!</span>
                            )}
                          </div>
                        )}
                        
                        {item.percent < 100 && (
                          <p className="text-xs text-gray-500">{100 - item.percent}% remaining</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Available Tests Section */}
            {progressData.some(p => p.percent === 100) && (
              <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  Certification Tests
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  Complete a roadmap 100% to unlock its certification test. Pass with 60% or above to earn your certificate!
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-white/5 rounded-lg">
                    <div className="text-2xl font-bold text-white">{progressData.filter(p => p.percent === 100).length}</div>
                    <div className="text-xs text-gray-500">Tests Available</div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">{certifications.length}</div>
                    <div className="text-xs text-gray-500">Certificates Earned</div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <div className="text-2xl font-bold text-blue-400">
                      {Object.values(testAttempts).filter((t: any) => t?.hasAttempted && !t?.attempt?.passed).length}
                    </div>
                    <div className="text-xs text-gray-500">Pending Retries</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}


        {/* Coding Profiles Tab Content */}
        {activeTab === 'coding' && (
          <div className="space-y-6">
            {(codingProfiles?.github?.username || codingProfiles?.leetcode?.username || 
              codingProfiles?.codeforces?.username || codingProfiles?.codechef?.username) ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-[#111118] to-[#0a0a0f] border border-white/5 rounded-2xl p-6 mb-6 overflow-hidden relative"
              >
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-500/5 to-purple-500/5 rounded-full blur-3xl" />
                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl">
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">Coding Profiles</h3>
                        <p className="text-sm text-gray-400">Your coding journey stats</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openCodingModal()}
                        className="px-3 py-1.5 text-sm bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-400 hover:text-white transition-all flex items-center gap-1.5"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <Link
                        href={activeTab === 'coding' ? `/coding-dashboard/${userData?.username}` : `/u/${userData?.username}`}
                        className="px-3 py-1.5 text-sm bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 hover:from-emerald-500/20 hover:to-cyan-500/20 border border-emerald-500/20 rounded-lg text-emerald-400 hover:text-emerald-300 transition-all flex items-center gap-1.5"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        Share
                      </Link>
                    </div>
                  </div>
                  {/* Total Stats */}
                  {totalProblemsSolved > 0 && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-blue-500/10 border border-emerald-500/20 rounded-xl">
                      <div className="flex items-center justify-center gap-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                            {totalProblemsSolved}
                          </div>
                          <div className="text-sm text-gray-400">Total Problems Solved</div>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Platform Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* GitHub */}
                    {codingProfiles?.github?.username && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all group"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-[#333] flex items-center justify-center">
                            <Github className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-medium text-white">GitHub</span>
                        </div>
                        <a 
                          href={`https://github.com/${codingProfiles.github.username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1 mb-3"
                        >
                          @{codingProfiles.github.username}
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="bg-black/30 rounded-lg p-2 text-center">
                            <div className="font-semibold text-white">{codingProfiles.github.stats?.publicRepos || 0}</div>
                            <div className="text-xs text-gray-500">Repos</div>
                          </div>
                          <div className="bg-black/30 rounded-lg p-2 text-center">
                            <div className="font-semibold text-white">{codingProfiles.github.stats?.followers || 0}</div>
                            <div className="text-xs text-gray-500">Followers</div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    {/* LeetCode */}
                    {codingProfiles?.leetcode?.username && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gradient-to-br from-orange-950/50 to-yellow-950/50 border border-orange-500/20 rounded-xl p-4 hover:border-orange-500/40 transition-all group"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center">
                            <span className="text-white font-bold text-xs">LC</span>
                          </div>
                          <span className="font-medium text-white">LeetCode</span>
                        </div>
                        <a 
                          href={`https://leetcode.com/${codingProfiles.leetcode.username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-gray-400 hover:text-orange-300 transition-colors flex items-center gap-1 mb-3"
                        >
                          @{codingProfiles.leetcode.username}
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                        <div className="space-y-2">
                          <div className="bg-black/30 rounded-lg p-2 text-center">
                            <div className="font-semibold text-white">{codingProfiles.leetcode.stats?.totalSolved || 0}</div>
                            <div className="text-xs text-gray-500">Problems Solved</div>
                          </div>
                          <div className="flex gap-1 text-xs">
                            <span className="flex-1 bg-green-500/20 text-green-400 rounded px-1.5 py-0.5 text-center">{codingProfiles.leetcode.stats?.easySolved || 0} E</span>
                            <span className="flex-1 bg-yellow-500/20 text-yellow-400 rounded px-1.5 py-0.5 text-center">{codingProfiles.leetcode.stats?.mediumSolved || 0} M</span>
                            <span className="flex-1 bg-red-500/20 text-red-400 rounded px-1.5 py-0.5 text-center">{codingProfiles.leetcode.stats?.hardSolved || 0} H</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    {/* Codeforces */}
                    {codingProfiles?.codeforces?.username && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-br from-blue-950/50 to-purple-950/50 border border-blue-500/20 rounded-xl p-4 hover:border-blue-500/40 transition-all group"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                            <span className="text-white font-bold text-xs">CF</span>
                          </div>
                          <span className="font-medium text-white">Codeforces</span>
                        </div>
                        <a 
                          href={`https://codeforces.com/profile/${codingProfiles.codeforces.username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-gray-400 hover:text-blue-300 transition-colors flex items-center gap-1 mb-3"
                        >
                          @{codingProfiles.codeforces.username}
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="bg-black/30 rounded-lg p-2 text-center">
                            <div className="font-semibold text-white">{codingProfiles.codeforces.stats?.rating || 0}</div>
                            <div className="text-xs text-gray-500">Rating</div>
                          </div>
                          <div className="bg-black/30 rounded-lg p-2 text-center">
                            <div className="font-semibold text-white">{codingProfiles.codeforces.stats?.problemsSolved || 0}</div>
                            <div className="text-xs text-gray-500">Solved</div>
                          </div>
                        </div>
                        {codingProfiles.codeforces.stats?.rank && (
                          <div className="mt-2 text-center text-xs">
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full capitalize">
                              {codingProfiles.codeforces.stats.rank}
                            </span>
                          </div>
                        )}
                      </motion.div>
                    )}
                    {/* CodeChef */}
                    {codingProfiles?.codechef?.username && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-gradient-to-br from-amber-950/50 to-orange-950/50 border border-amber-500/20 rounded-xl p-4 hover:border-amber-500/40 transition-all group"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-600 to-orange-700 flex items-center justify-center">
                            <span className="text-white font-bold text-xs">CC</span>
                          </div>
                          <span className="font-medium text-white">CodeChef</span>
                        </div>
                        <a 
                          href={`https://www.codechef.com/users/${codingProfiles.codechef.username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-gray-400 hover:text-amber-300 transition-colors flex items-center gap-1 mb-3"
                        >
                          @{codingProfiles.codechef.username}
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="bg-black/30 rounded-lg p-2 text-center">
                            <div className="font-semibold text-white">{codingProfiles.codechef.stats?.rating || 0}</div>
                            <div className="text-xs text-gray-500">Rating</div>
                          </div>
                          <div className="bg-black/30 rounded-lg p-2 text-center">
                            <div className="font-semibold text-white">{codingProfiles.codechef.stats?.problemsSolved || 0}</div>
                            <div className="text-xs text-gray-500">Solved</div>
                          </div>
                        </div>
                        {codingProfiles.codechef.stats?.stars && (
                          <div className="mt-2 text-center">
                            <span className="text-amber-400">{codingProfiles.codechef.stats.stars}</span>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-[#111118] to-[#0a0a0f] border border-emerald-500/20 rounded-2xl p-6 mb-6 text-center"
              >
                <div className="p-3 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-xl w-fit mx-auto mb-4">
                  <Code2 className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Showcase Your Coding Journey</h3>
                <p className="text-gray-400 mb-4 max-w-md mx-auto">
                  Connect your coding profiles from GitHub, LeetCode, Codeforces, and CodeChef to display your achievements and share with others.
                </p>
                <button
                  onClick={() => openCodingModal()}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 rounded-xl text-white font-medium transition-all inline-flex items-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  Add Coding Profiles
                </button>
              </motion.div>
            )}
          </div>
        )}

        {activeTab === 'tests' && (
          <div className="space-y-6">
            {/* Tests Header */}
            <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-yellow-500/20 rounded-xl">
                  <FileText className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Skill Certification Tests</h3>
                  <p className="text-gray-400 text-sm">
                    Complete a roadmap 100% to unlock its certification test. Pass with 60% or above to earn your official certificate!
                  </p>
                </div>
              </div>
            </div>

            {/* Available Tests */}
            <div className="bg-[#111118] border border-white/5 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-400" />
                Available Tests
              </h3>

              {loadingRoadmaps ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-3 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-gray-400 text-sm">Loading tests...</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {roadmaps.map((roadmap, idx) => {
                    const progress = progressMap[roadmap._id] || { completedTasks: [], completedAssignments: [] };
                    const totalTasks = roadmap.phases?.reduce((acc: number, phase: any) => acc + (phase.tasks?.length || 0), 0) || 0;
                    const totalAssignments = roadmap.phases?.reduce((acc: number, phase: any) => acc + (phase.assignments?.length || 0), 0) || 0;
                    const completedTasks = progress.completedTasks?.length || 0;
                    const completedAssignments = progress.completedAssignments?.length || 0;
                    const percent = totalTasks + totalAssignments === 0 ? 0 : Math.round(((completedTasks + completedAssignments) / (totalTasks + totalAssignments)) * 100);
                    const testInfo = testAttempts[roadmap._id];
                    
                    return (
                      <div
                        key={idx}
                        className={`p-5 rounded-xl border transition-all ${
                          percent === 100
                            ? 'bg-gradient-to-br from-yellow-500/5 to-orange-500/5 border-yellow-500/20'
                            : 'bg-white/5 border-white/5'
                        }`}
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              percent === 100 ? 'bg-yellow-500/20' : 'bg-white/10'
                            }`}>
                              {percent === 100 ? (
                                <Award className="w-6 h-6 text-yellow-400" />
                              ) : (
                                <BookOpen className="w-6 h-6 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-semibold text-white">{roadmap.title}</h4>
                              <div className="flex items-center gap-3 mt-1">
                                <span className={`text-sm ${percent === 100 ? 'text-green-400' : 'text-gray-500'}`}>
                                  {percent}% completed
                                </span>
                                {testInfo?.hasAttempted && (
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                                    testInfo.attempt?.passed
                                      ? 'bg-green-500/20 text-green-400'
                                      : 'bg-red-500/20 text-red-400'
                                  }`}>
                                    {testInfo.attempt?.passed ? 'Passed' : 'Failed'}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {percent < 100 ? (
                              <div className="flex items-center gap-2">
                                <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                                    style={{ width: `${percent}%` }}
                                  />
                                </div>
                                <button
                                  onClick={() => router.push(`/explore/roadmap/${roadmap._id}`)}
                                  className="px-4 py-2 text-sm text-blue-400 bg-blue-500/10 rounded-lg hover:bg-blue-500/20 transition-colors"
                                >
                                  Continue
                                </button>
                              </div>
                            ) : testInfo?.hasAttempted && testInfo.attempt?.passed ? (
                              <button
                                onClick={() => setActiveTab('certificates')}
                                className="px-4 py-2 text-sm text-green-400 bg-green-500/10 rounded-lg hover:bg-green-500/20 transition-colors flex items-center gap-2"
                              >
                                <CheckCircle className="w-4 h-4" />
                                View Certificate
                              </button>
                            ) : testInfo?.hasAttempted && !testInfo?.canRetry ? (
                              <span className="px-4 py-2 text-sm text-red-400 bg-red-500/10 rounded-lg flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                Test Failed ({testInfo.attempt?.percentage}%)
                              </span>
                            ) : testInfo?.canRetry ? (
                              <button
                                onClick={() => router.push(`/roadmap-test?roadmapId=${roadmap._id}`)}
                                className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-500 hover:to-indigo-500 transition-all flex items-center gap-2"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Retry Test
                              </button>
                            ) : !testInfo?.hasFullDetails ? (
                              <button
                                onClick={() => {
                                  setActiveTab('overview');
                                  setEditMode(true);
                                }}
                                className="px-4 py-2 text-sm text-amber-400 bg-amber-500/10 rounded-lg hover:bg-amber-500/20 transition-colors flex items-center gap-2"
                              >
                                <AlertCircle className="w-4 h-4" />
                                Complete Profile First
                              </button>
                            ) : (
                              <button
                                onClick={() => router.push(`/roadmap-test?roadmapId=${roadmap._id}`)}
                                className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg hover:from-yellow-500 hover:to-orange-500 transition-all flex items-center gap-2"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                                Start Test
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {roadmaps.length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-500/10 flex items-center justify-center">
                        <BookOpen className="w-8 h-8 text-yellow-400" />
                      </div>
                      <h4 className="text-lg font-medium text-white mb-2">No roadmaps available</h4>
                      <p className="text-gray-500 text-sm mb-4">Start learning with our interactive roadmaps!</p>
                      <button
                        onClick={() => router.push('/explore')}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium"
                      >
                        Explore Roadmaps
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sample Test Card */}
            <div className="bg-[#111118] border border-white/5 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Sample Test
              </h3>
              <div className="p-5 rounded-xl bg-gradient-to-br from-purple-500/5 to-blue-500/5 border border-purple-500/20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Sample Skill Test</h4>
                      <p className="text-sm text-gray-400 mt-1">5 MCQ Questions • 10 Marks • 5 Minutes</p>
                      <p className="text-xs text-gray-500 mt-1">Test your basic web development knowledge</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {userData?.sampleTestAttempt?.completed ? (
                      userData.sampleTestAttempt.passed ? (
                        <button
                          onClick={() => setActiveTab('certificates')}
                          className="px-4 py-2 text-sm text-green-400 bg-green-500/10 rounded-lg hover:bg-green-500/20 transition-colors flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Passed ({userData.sampleTestAttempt.percentage}%) - View Certificate
                        </button>
                      ) : (
                        <span className="px-4 py-2 text-sm text-red-400 bg-red-500/10 rounded-lg flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          Failed ({userData.sampleTestAttempt.percentage}%)
                        </span>
                      )
                    ) : (
                      <button
                        onClick={() => router.push('/sample-test')}
                        className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-500 hover:to-blue-500 transition-all flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                        Take Sample Test
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Test Info Card */}
            <div className="bg-[#111118] border border-white/5 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-400" />
                Test Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-white font-medium">Duration</span>
                  </div>
                  <p className="text-gray-400 text-sm">30 minutes for each test</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-white font-medium">Questions</span>
                  </div>
                  <p className="text-gray-400 text-sm">30 MCQ + 10 Short Answer = 40 Total</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-white font-medium">Passing Score</span>
                  </div>
                  <p className="text-gray-400 text-sm">60% or above to earn certificate</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-red-500/20 rounded-lg">
                      <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <span className="text-white font-medium">Attempts</span>
                  </div>
                  <p className="text-gray-400 text-sm">One attempt per test (Admin can allow retry)</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <InterviewHistory userId={userData?._id} />
        )}

        {activeTab === 'certificates' && (
          <div className="bg-[#111118] border border-white/5 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" />
              My Certificates
            </h3>

            {loadingCerts ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-3 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-gray-400 text-sm">Loading certificates...</span>
                </div>
              </div>
            ) : certifications.length === 0 && !userData?.sampleTestAttempt?.passed ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-500/10 flex items-center justify-center">
                  <Award className="w-8 h-8 text-yellow-400" />
                </div>
                <h4 className="text-lg font-medium text-white mb-2">No certificates yet</h4>
                <p className="text-gray-500 text-sm mb-4">
                  Complete roadmaps and pass the certification test to earn certificates!
                </p>
                <button
                  onClick={() => router.push('/explore')}
                  className="px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-lg font-medium"
                >
                  Explore Roadmaps
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Sample Test Certificate */}
                {userData?.sampleTestAttempt?.passed && userData.sampleTestAttempt && (
                  <div
                    className="group p-6 bg-gradient-to-br from-purple-500/5 to-blue-500/5 border border-purple-500/20 rounded-xl hover:border-purple-500/40 transition-all cursor-pointer"
                    onClick={() => {
                      const attempt = userData.sampleTestAttempt!;
                      setSelectedCertificate({
                        roadmapTitle: "Sample Skill Test",
                        certificateId: attempt.certificateId,
                        score: attempt.score,
                        percentage: attempt.percentage,
                        mcqScore: attempt.score,
                        shortAnswerScore: 0,
                        issuedAt: attempt.completedAt,
                        totalMarks: attempt.totalMarks
                      });
                    }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg group-hover:scale-110 transition-transform">
                          <Award className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">Sample Skill Test Certificate</h4>
                          <p className="text-xs text-gray-500">
                            Issued: {new Date(userData.sampleTestAttempt.completedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="px-3 py-1 rounded-full text-sm font-medium bg-purple-500/20 text-purple-400">
                        {userData.sampleTestAttempt.percentage}%
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="p-3 bg-white/5 rounded-lg text-center">
                        <div className="text-lg font-bold text-white">{userData.sampleTestAttempt.score}/{userData.sampleTestAttempt.totalMarks}</div>
                        <div className="text-[10px] text-gray-500">Score</div>
                      </div>
                      <div className="p-3 bg-white/5 rounded-lg text-center">
                        <div className="text-lg font-bold text-green-400">PASS</div>
                        <div className="text-[10px] text-gray-500">Result</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="text-xs text-gray-500">
                        ID: <span className="font-mono text-purple-400">{userData.sampleTestAttempt.certificateId}</span>
                      </div>
                      <button
                        className="flex items-center gap-1 px-3 py-1.5 bg-purple-500/20 text-purple-400 rounded-lg text-sm font-medium hover:bg-purple-500/30 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </div>
                  </div>
                )}

                {/* Roadmap Certificates */}
                {certifications.map((cert, idx) => (
                  <div
                    key={idx}
                    className="group p-6 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 border border-yellow-500/20 rounded-xl hover:border-yellow-500/40 transition-all cursor-pointer"
                    onClick={() => setSelectedCertificate(cert)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-500/20 rounded-lg group-hover:scale-110 transition-transform">
                          <Award className="w-6 h-6 text-yellow-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">{cert.roadmapTitle} Certificate</h4>
                          <p className="text-xs text-gray-500">
                            Issued: {new Date(cert.issuedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        cert.percentage >= 80 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {cert.percentage}%
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="p-3 bg-white/5 rounded-lg text-center">
                        <div className="text-lg font-bold text-white">{cert.score}</div>
                        <div className="text-[10px] text-gray-500">Total Score</div>
                      </div>
                      <div className="p-3 bg-white/5 rounded-lg text-center">
                        <div className="text-lg font-bold text-blue-400">{cert.mcqScore || 0}</div>
                        <div className="text-[10px] text-gray-500">MCQ Score</div>
                      </div>
                      <div className="p-3 bg-white/5 rounded-lg text-center">
                        <div className="text-lg font-bold text-purple-400">{cert.shortAnswerScore || 0}</div>
                        <div className="text-[10px] text-gray-500">Short Ans</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="text-xs text-gray-500">
                        ID: <span className="font-mono text-yellow-400">{cert.certificateId}</span>
                      </div>
                      <button
                        className="flex items-center gap-1 px-3 py-1.5 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm font-medium hover:bg-yellow-500/30 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile / Coding Profile Modals */}
        {showPhotoModal && (
          <ProfilePhotoModal
            isOpen={showPhotoModal}
            onClose={() => setShowPhotoModal(false)}
            currentPhoto={userData?.profilePhoto?.url}
            onUpdate={handlePhotoUpdate}
          />
        )}
        {showCodingModal && activeTab === 'coding' && (
          <CodingProfilesModal
            isOpen={showCodingModal}
            onClose={() => setShowCodingModal(false)}
            codingProfiles={codingProfiles}
            onUpdate={(profiles) => { setCodingProfiles(profiles); handleProfilesUpdate(); }}
          />
        )}

        {/* Certificate Modal */}
        {selectedCertificate && (
          <Certificate
            user={userData}
            certification={{
              roadmapTitle: selectedCertificate.roadmapTitle,
              certificateId: selectedCertificate.certificateId,
              score: selectedCertificate.score,
              percentage: selectedCertificate.percentage,
              mcqScore: selectedCertificate.mcqScore,
              shortAnswerScore: selectedCertificate.shortAnswerScore,
              issuedAt: selectedCertificate.issuedAt,
              userName: userData?.fullName || userData?.username || "Student"
            }}
            isModal={true}
            onClose={() => setSelectedCertificate(null)}
          />
        )}
      </main>
    </div>
  );
}
