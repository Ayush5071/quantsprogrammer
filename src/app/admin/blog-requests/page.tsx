"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import useCurrentUser from "@/lib/useCurrentUser";

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
  const user = useCurrentUser();

  // Check if user is admin
  useEffect(() => {
    if (user === null) {
      // Still loading user data
      return;
    }
    if (user === false || (!user?.isAdmin && user?.role !== 'admin')) {
      // Not logged in or not admin
      setError("Access denied. Admin privileges required.");
      setLoading(false);
      return;
    }
  }, [user]);

  useEffect(() => {
    // Only fetch data if user is admin
    if (user && (user.isAdmin || user.role === 'admin')) {
      const fetchRequests = async () => {
        try {
          const res = await axios.get("/api/blogs/request/admin");
          const reqs: BlogRequest[] = res.data.requests || [];
          setRequests(reqs);
          // Fetch user info for each request
          const userIds = reqs.map(r => r.userId);
          if (userIds.length > 0) {
            const userInfoRes = await Promise.all(userIds.map(id => axios.get(`/api/users/${id}`)));
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
    try {
      await axios.patch("/api/blogs/request/admin", { userId, status });
      setRequests((prev) => prev.filter((r) => r.userId !== userId));
      toast.success(`Request ${status}`);
    } catch {
      toast.error("Failed to update request");
    }
  };

  if (loading) return <div className="text-white p-8">Loading...</div>;
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="text-xl font-semibold text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black py-10 px-2 md:px-4 relative overflow-hidden">
      {/* Glassmorphism animated background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.12),transparent_50%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(37,99,235,0.10),transparent_50%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(29,78,216,0.07),transparent_70%)] pointer-events-none"></div>
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)]"></div>
      </div>
      <div className="relative z-10 w-full max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-white mb-10 tracking-tight drop-shadow-lg flex items-center justify-center gap-3">
          Blog Write Access Requests
        </h1>
        {requests.length === 0 ? (
          <div className="text-gray-400 text-center">No pending requests.</div>
        ) : (
          <div className="space-y-6">
            {requests.map((req) => {
              const user = userInfos[req.userId];
              return (
                <div key={req._id} className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex flex-col items-start">
                    <div className="text-lg font-bold text-blue-300 flex items-center gap-2">
                      {user ? (
                        <>
                          <span>{user.username}</span>
                          <span className="text-xs text-zinc-300">({user.email})</span>
                        </>
                      ) : (
                        <span className="text-zinc-400">User: {req.userId}</span>
                      )}
                    </div>
                    <div className="text-gray-400 text-sm mt-1">Requested At: {new Date(req.requestedAt).toLocaleString()}</div>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => handleAction(req.userId, "accepted")} className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-lg font-bold shadow hover:scale-105 transition">Accept</button>
                    <button onClick={() => handleAction(req.userId, "rejected")} className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg font-bold shadow hover:scale-105 transition">Reject</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
