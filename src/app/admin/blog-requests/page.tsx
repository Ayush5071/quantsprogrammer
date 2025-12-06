"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import useCurrentUser from "@/lib/useCurrentUser";
import AdminLayout from "../admin-panel/AdminLayout";

interface BlogRequest {
  _id: string;
  userId: string;
  status: string;
  requestedAt: string;
}

interface UserInfo {
  _id: string;
  username: string;
  email: string;
}

export default function BlogRequestsAdmin() {
  const [requests, setRequests] = useState<BlogRequest[]>([]);
  const [userInfos, setUserInfos] = useState<Record<string, UserInfo>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const user = useCurrentUser();

  useEffect(() => {
    // undefined = still loading, wait
    if (user === undefined) return;
    
    // null = not logged in or user loaded without admin
    if (user === null || !user?.isAdmin) {
      setError("Access denied. Admin privileges required.");
      setLoading(false);
      return;
    }
  }, [user]);

  useEffect(() => {
    if (user && user.isAdmin) {
      const fetchRequests = async () => {
        try {
          const res = await axios.get("/api/blogs/request/admin");
          const reqs: BlogRequest[] = res.data.requests || [];
          setRequests(reqs);
          const userIds = reqs.map((r) => r.userId);
          if (userIds.length > 0) {
            const userInfoRes = await Promise.all(
              userIds.map((id) => axios.get(`/api/users/${id}`))
            );
            const userInfoMap: Record<string, UserInfo> = {};
            userInfoRes.forEach((resp, idx) => {
              if (resp.data.user) userInfoMap[userIds[idx]] = resp.data.user;
            });
            setUserInfos(userInfoMap);
          }
        } catch {
          setRequests([]);
        }
        setLoading(false);
      };
      fetchRequests();
    }
  }, [user]);

  const handleAction = async (userId: string, status: string) => {
    setActionLoading(userId + status);
    try {
      await axios.patch("/api/blogs/request/admin", { userId, status });
      setRequests((prev) => prev.filter((r) => r.userId !== userId));
      toast.success(`Request ${status}`);
    } catch {
      toast.error("Failed to update request");
    }
    setActionLoading(null);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-400 text-sm">Loading requests...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-red-400 font-medium">{error}</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Blog Requests</h1>
        <p className="text-gray-400 text-sm">Review and manage blog write access requests from users.</p>
      </div>

      {/* Stats Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#111118] border border-yellow-500/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{requests.length}</div>
              <div className="text-xs text-gray-400">Pending Requests</div>
            </div>
          </div>
        </div>
      </div>

      {/* Requests List */}
      {requests.length === 0 ? (
        <div className="bg-[#111118] border border-white/10 rounded-xl p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">All caught up!</h3>
          <p className="text-gray-400 text-sm">No pending blog requests at the moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => {
            const userInfo = userInfos[req.userId];
            return (
              <div
                key={req._id}
                className="bg-[#111118] border border-white/10 rounded-xl p-4 sm:p-6 hover:border-white/20 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* User Info */}
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium text-lg flex-shrink-0">
                      {userInfo?.username?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-white font-medium">{userInfo?.username || "Unknown User"}</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400">
                          Pending
                        </span>
                      </div>
                      <div className="text-sm text-gray-400">{userInfo?.email || req.userId}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Requested: {new Date(req.requestedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 sm:flex-shrink-0">
                    <button
                      onClick={() => handleAction(req.userId, "accepted")}
                      disabled={actionLoading !== null}
                      className="flex-1 sm:flex-none px-4 py-2 bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      {actionLoading === req.userId + "accepted" ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      Accept
                    </button>
                    <button
                      onClick={() => handleAction(req.userId, "rejected")}
                      disabled={actionLoading !== null}
                      className="flex-1 sm:flex-none px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-red-400 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      {actionLoading === req.userId + "rejected" ? (
                        <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}
