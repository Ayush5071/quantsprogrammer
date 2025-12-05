"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import AdminLayout from "../AdminLayout";
import useCurrentUser from "@/lib/useCurrentUser";
import { 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Award,
  Search,
  RotateCcw,
  Loader2,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface TestAttempt {
  _id: string;
  userId: string;
  roadmapId: string;
  mcqScore: number;
  shortAnswerScore: number;
  totalScore: number;
  percentage: number;
  passed: boolean;
  submittedAt: string;
  canRetry: boolean;
  user?: {
    username: string;
    email: string;
    fullName: string;
  };
}

interface Roadmap {
  _id: string;
  title: string;
}

export default function TestManagementPage() {
  const user = useCurrentUser();
  const [loading, setLoading] = useState(true);
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [allowingRetry, setAllowingRetry] = useState<string | null>(null);
  const [expandedAttempt, setExpandedAttempt] = useState<string | null>(null);

  useEffect(() => {
    if (user === null) return;
    if (user === false || (!user?.isAdmin && user?.role !== "admin")) {
      setLoading(false);
      return;
    }

    // Fetch roadmaps
    axios.get("/api/roadmap/fetchall").then((res) => {
      setRoadmaps(res.data.roadmaps || []);
    });

    // Fetch all attempts
    fetchAttempts();
  }, [user]);

  const fetchAttempts = async (roadmapId?: string) => {
    setLoading(true);
    try {
      let url = "/api/roadmap-test/admin";
      if (roadmapId) url += `?roadmapId=${roadmapId}`;
      const res = await axios.get(url);
      setAttempts(res.data.attempts || []);
    } catch (error) {
      toast.error("Failed to fetch test attempts");
    }
    setLoading(false);
  };

  const handleAllowRetry = async (userId: string, roadmapId: string) => {
    setAllowingRetry(`${userId}-${roadmapId}`);
    try {
      await axios.post("/api/roadmap-test/admin", { userId, roadmapId });
      toast.success("User can now retry the test");
      fetchAttempts(selectedRoadmap || undefined);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to allow retry");
    }
    setAllowingRetry(null);
  };

  const handleRoadmapFilter = (roadmapId: string) => {
    setSelectedRoadmap(roadmapId);
    fetchAttempts(roadmapId || undefined);
  };

  // Filter attempts by search
  const filteredAttempts = attempts.filter((attempt) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      attempt.user?.username?.toLowerCase().includes(query) ||
      attempt.user?.email?.toLowerCase().includes(query) ||
      attempt.user?.fullName?.toLowerCase().includes(query)
    );
  });

  // Stats
  const passedCount = attempts.filter((a) => a.passed).length;
  const failedCount = attempts.filter((a) => !a.passed).length;
  const avgScore = attempts.length > 0 
    ? Math.round(attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length) 
    : 0;

  if (!user || (!user?.isAdmin && user?.role !== "admin")) {
    return (
      <AdminLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
            <p className="text-red-400 font-medium">Access denied. Admin privileges required.</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Test Management</h1>
          <p className="text-gray-400">Manage certification tests and allow retries</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-5 bg-[#111118] border border-white/5 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Award className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{attempts.length}</div>
                <div className="text-sm text-gray-500">Total Attempts</div>
              </div>
            </div>
          </div>
          <div className="p-5 bg-[#111118] border border-white/5 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{passedCount}</div>
                <div className="text-sm text-gray-500">Passed ({failedCount} Failed)</div>
              </div>
            </div>
          </div>
          <div className="p-5 bg-[#111118] border border-white/5 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <Award className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{avgScore}%</div>
                <div className="text-sm text-gray-500">Average Score</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search by username, email, or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#111118] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-blue-500/50 focus:outline-none"
            />
          </div>
          <select
            value={selectedRoadmap}
            onChange={(e) => handleRoadmapFilter(e.target.value)}
            className="px-4 py-3 bg-[#111118] border border-white/10 rounded-xl text-white focus:border-blue-500/50 focus:outline-none"
          >
            <option value="">All Roadmaps</option>
            {roadmaps.map((roadmap) => (
              <option key={roadmap._id} value={roadmap._id}>
                {roadmap.title}
              </option>
            ))}
          </select>
          <button
            onClick={() => fetchAttempts(selectedRoadmap || undefined)}
            className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Attempts List */}
        <div className="bg-[#111118] border border-white/5 rounded-xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : filteredAttempts.length === 0 ? (
            <div className="text-center py-12">
              <Award className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500">No test attempts found</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {filteredAttempts.map((attempt) => {
                const roadmap = roadmaps.find((r) => r._id === attempt.roadmapId);
                const isExpanded = expandedAttempt === attempt._id;

                return (
                  <div key={attempt._id} className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-semibold">
                            {attempt.user?.username?.[0]?.toUpperCase() || "?"}
                          </div>
                          <div>
                            <h4 className="font-medium text-white">
                              {attempt.user?.fullName || attempt.user?.username || "Unknown"}
                            </h4>
                            <p className="text-sm text-gray-500">{attempt.user?.email}</p>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500 mt-2">
                          <span className="text-blue-400">{roadmap?.title || "Unknown Roadmap"}</span>
                          <span className="mx-2">•</span>
                          {new Date(attempt.submittedAt).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Score */}
                      <div className="flex items-center gap-4">
                        <div className={`px-4 py-2 rounded-lg text-center ${
                          attempt.passed 
                            ? "bg-green-500/10 border border-green-500/20" 
                            : "bg-red-500/10 border border-red-500/20"
                        }`}>
                          <div className={`text-2xl font-bold ${
                            attempt.passed ? "text-green-400" : "text-red-400"
                          }`}>
                            {attempt.percentage}%
                          </div>
                          <div className="text-xs text-gray-500">
                            {attempt.passed ? "Passed" : "Failed"}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          {!attempt.passed && !attempt.canRetry && (
                            <button
                              onClick={() => handleAllowRetry(attempt.userId, attempt.roadmapId)}
                              disabled={allowingRetry === `${attempt.userId}-${attempt.roadmapId}`}
                              className="px-3 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                              {allowingRetry === `${attempt.userId}-${attempt.roadmapId}` ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <RotateCcw className="w-4 h-4" />
                              )}
                              Allow Retry
                            </button>
                          )}
                          {attempt.canRetry && (
                            <span className="px-3 py-2 bg-yellow-500/10 text-yellow-400 text-sm font-medium rounded-lg">
                              Retry Allowed
                            </span>
                          )}
                          <button
                            onClick={() => setExpandedAttempt(isExpanded ? null : attempt._id)}
                            className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5" />
                            ) : (
                              <ChevronDown className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="p-3 bg-white/5 rounded-lg">
                          <div className="text-lg font-semibold text-white">{attempt.totalScore}</div>
                          <div className="text-xs text-gray-500">Total Score (100)</div>
                        </div>
                        <div className="p-3 bg-white/5 rounded-lg">
                          <div className="text-lg font-semibold text-blue-400">{attempt.mcqScore}</div>
                          <div className="text-xs text-gray-500">MCQ Score (60)</div>
                        </div>
                        <div className="p-3 bg-white/5 rounded-lg">
                          <div className="text-lg font-semibold text-purple-400">{attempt.shortAnswerScore}</div>
                          <div className="text-xs text-gray-500">Short Answer (40)</div>
                        </div>
                        <div className="p-3 bg-white/5 rounded-lg">
                          <div className="text-lg font-semibold text-gray-400">
                            {new Date(attempt.submittedAt).toLocaleTimeString()}
                          </div>
                          <div className="text-xs text-gray-500">Submitted At</div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
