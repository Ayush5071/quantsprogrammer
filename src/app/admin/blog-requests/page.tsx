"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

interface BlogRequest {
  _id: string;
  userId: string;
  status: string;
  requestedAt: string;
}

export default function BlogRequestsAdmin() {
  const [requests, setRequests] = useState<BlogRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get("/api/blogs/request/admin");
        setRequests(res.data.requests || []);
      } catch {
        setRequests([]);
      }
      setLoading(false);
    };
    fetchRequests();
  }, []);

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

  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      <h1 className="text-3xl font-bold text-blue-400 mb-8">Blog Write Access Requests</h1>
      {requests.length === 0 ? (
        <div className="text-gray-400">No pending requests.</div>
      ) : (
        <div className="space-y-6">
          {requests.map((req) => (
            <div key={req._id} className="bg-zinc-900 rounded-xl p-6 flex items-center justify-between border border-blue-800">
              <div>
                <div className="text-lg font-semibold text-white">User ID: {req.userId}</div>
                <div className="text-gray-400 text-sm">Requested At: {new Date(req.requestedAt).toLocaleString()}</div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => handleAction(req.userId, "accepted")} className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800">Accept</button>
                <button onClick={() => handleAction(req.userId, "rejected")} className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800">Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
