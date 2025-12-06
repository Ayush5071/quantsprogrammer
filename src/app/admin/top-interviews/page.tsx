"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useCurrentUser from "@/lib/useCurrentUser";
import AdminLayout from "../admin-panel/AdminLayout";
import { toast } from "react-hot-toast";
import { 
  RefreshCw, 
  Users, 
  Trophy, 
  CheckCircle, 
  XCircle, 
  ChevronDown, 
  ChevronUp,
  Search,
  RotateCcw,
  UserCheck,
  UserX,
  ToggleLeft,
  ToggleRight
} from "lucide-react";

export default function ManageTopInterviewsPage() {
  const user = useCurrentUser();
  const router = useRouter();
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedInterview, setExpandedInterview] = useState<string | null>(null);
  const [interviewDetails, setInterviewDetails] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const res = await fetch('/api/top-interviews');
      const data = await res.json();
      setInterviews(data);
    } catch (err) {
      toast.error('Failed to load interviews');
    } finally {
      setLoading(false);
    }
  };

  const fetchInterviewDetails = async (interviewId: string) => {
    setLoadingDetails(true);
    try {
      const res = await fetch(`/api/top-interviews/retry?interviewId=${interviewId}`);
      const data = await res.json();
      if (res.ok) {
        setInterviewDetails(data);
      } else {
        toast.error(data.error || 'Failed to load details');
      }
    } catch (err) {
      toast.error('Failed to load interview details');
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleExpandInterview = (interviewId: string) => {
    if (expandedInterview === interviewId) {
      setExpandedInterview(null);
      setInterviewDetails(null);
    } else {
      setExpandedInterview(interviewId);
      fetchInterviewDetails(interviewId);
    }
  };

  const handleAllowRetry = async (interviewId: string, userId: string, userName: string) => {
    setActionLoading(`allow-${userId}`);
    try {
      const res = await fetch('/api/top-interviews/retry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interviewId,
          userId,
          action: 'allowRetryForUser'
        })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Retry allowed for ${userName}`);
        fetchInterviewDetails(interviewId);
      } else {
        toast.error(data.error || 'Failed to allow retry');
      }
    } catch (err) {
      toast.error('Failed to allow retry');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemoveRetry = async (interviewId: string, userId: string, userName: string) => {
    setActionLoading(`remove-${userId}`);
    try {
      const res = await fetch('/api/top-interviews/retry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interviewId,
          userId,
          action: 'removeRetryForUser'
        })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Retry removed for ${userName}`);
        fetchInterviewDetails(interviewId);
      } else {
        toast.error(data.error || 'Failed to remove retry');
      }
    } catch (err) {
      toast.error('Failed to remove retry');
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleRetryForAll = async (interviewId: string) => {
    setActionLoading(`toggle-${interviewId}`);
    try {
      const res = await fetch('/api/top-interviews/retry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interviewId,
          action: 'toggleRetryForAll'
        })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        fetchInterviews();
        fetchInterviewDetails(interviewId);
      } else {
        toast.error(data.error || 'Failed to toggle retry');
      }
    } catch (err) {
      toast.error('Failed to toggle retry');
    } finally {
      setActionLoading(null);
    }
  };

  if (user === null) {
    return (
      <AdminLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-400 text-sm">Loading...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!user || !user.isAdmin) {
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

  const filteredInterviews = interviews.filter(i => 
    i.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Manage Top Interviews</h1>
        <p className="text-gray-400 text-sm">Control retry permissions and view attempt statistics.</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search interviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[#111118] border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500/50"
          />
        </div>
      </div>

      {/* Interviews List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredInterviews.length === 0 ? (
        <div className="text-center py-20">
          <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No interviews found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInterviews.map((interview) => (
            <div key={interview._id} className="bg-[#111118] border border-white/5 rounded-xl overflow-hidden">
              {/* Interview Header */}
              <button
                onClick={() => handleExpandInterview(interview._id)}
                className="w-full p-5 flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-white font-semibold">{interview.title}</h3>
                    <p className="text-gray-500 text-sm">{interview.company} • {interview.level}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {interview.allowRetryForAll && (
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                      Retry Enabled
                    </span>
                  )}
                  {interview.isEnded && (
                    <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
                      Ended
                    </span>
                  )}
                  {expandedInterview === interview._id ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </button>

              {/* Expanded Details */}
              {expandedInterview === interview._id && (
                <div className="border-t border-white/5 p-5">
                  {loadingDetails ? (
                    <div className="flex items-center justify-center py-10">
                      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : interviewDetails ? (
                    <div className="space-y-6">
                      {/* Retry Settings */}
                      <div className="bg-white/5 rounded-lg p-4">
                        <h4 className="text-white font-medium mb-4 flex items-center gap-2">
                          <RefreshCw className="w-4 h-4" />
                          Retry Settings
                        </h4>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-300 text-sm">Allow retry for all users</p>
                            <p className="text-gray-500 text-xs mt-1">
                              When enabled, all users can attempt the interview multiple times.
                            </p>
                          </div>
                          <button
                            onClick={() => handleToggleRetryForAll(interview._id)}
                            disabled={actionLoading === `toggle-${interview._id}`}
                            className={`p-2 rounded-lg transition-all ${
                              interviewDetails.interview.allowRetryForAll
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-white/10 text-gray-400'
                            }`}
                          >
                            {actionLoading === `toggle-${interview._id}` ? (
                              <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            ) : interviewDetails.interview.allowRetryForAll ? (
                              <ToggleRight className="w-6 h-6" />
                            ) : (
                              <ToggleLeft className="w-6 h-6" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Attempts List */}
                      <div>
                        <h4 className="text-white font-medium mb-4 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Attempts ({interviewDetails.attempts?.length || 0})
                        </h4>
                        
                        {interviewDetails.attempts?.length === 0 ? (
                          <p className="text-gray-500 text-sm text-center py-6">No attempts yet</p>
                        ) : (
                          <div className="space-y-2">
                            {interviewDetails.attempts?.map((attempt: any, index: number) => (
                              <div 
                                key={attempt._id}
                                className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                    index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                                    index === 1 ? 'bg-gray-400/20 text-gray-300' :
                                    index === 2 ? 'bg-amber-600/20 text-amber-500' :
                                    'bg-white/10 text-gray-400'
                                  }`}>
                                    {index + 1}
                                  </div>
                                  <div>
                                    <p className="text-white font-medium">
                                      {attempt.user?.fullName || attempt.user?.username || 'Unknown User'}
                                    </p>
                                    <p className="text-gray-500 text-xs">{attempt.user?.email}</p>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-4">
                                  <div className="text-right">
                                    <p className="text-blue-400 font-bold">{attempt.score}/100</p>
                                    <p className="text-gray-500 text-xs">
                                      {new Date(attempt.createdAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                  
                                  {!interviewDetails.interview.allowRetryForAll && (
                                    attempt.hasRetryPermission ? (
                                      <button
                                        onClick={() => handleRemoveRetry(
                                          interview._id, 
                                          attempt.user?._id,
                                          attempt.user?.username || attempt.user?.email
                                        )}
                                        disabled={actionLoading === `remove-${attempt.user?._id}`}
                                        className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                                        title="Remove retry permission"
                                      >
                                        {actionLoading === `remove-${attempt.user?._id}` ? (
                                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                          <UserX className="w-4 h-4" />
                                        )}
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => handleAllowRetry(
                                          interview._id, 
                                          attempt.user?._id,
                                          attempt.user?.username || attempt.user?.email
                                        )}
                                        disabled={actionLoading === `allow-${attempt.user?._id}`}
                                        className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                                        title="Allow retry"
                                      >
                                        {actionLoading === `allow-${attempt.user?._id}` ? (
                                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                          <RotateCcw className="w-4 h-4" />
                                        )}
                                      </button>
                                    )
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Users with retry permission */}
                      {interviewDetails.interview.retryAllowedUsers?.length > 0 && !interviewDetails.interview.allowRetryForAll && (
                        <div>
                          <h4 className="text-white font-medium mb-4 flex items-center gap-2">
                            <UserCheck className="w-4 h-4 text-green-400" />
                            Users with Retry Permission
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {interviewDetails.interview.retryAllowedUsers.map((u: any) => (
                              <span 
                                key={u._id}
                                className="px-3 py-1 bg-green-500/10 text-green-400 text-sm rounded-full border border-green-500/20"
                              >
                                {u.username || u.email}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
