"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "../admin-panel/AdminLayout";
import axios from "axios";
import useCurrentUser from "@/lib/useCurrentUser";
import { toast } from "react-hot-toast";

export default function InterviewExperienceAdmin() {
  const [pending, setPending] = useState<any[]>([]);
  const [all, setAll] = useState<any[]>([]);
  const [viewAll, setViewAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const user = useCurrentUser();

  useEffect(() => {
    if (user === undefined) return;
    if (!user || !user.isAdmin) {
      setLoading(false);
      return;
    }
      const fetchPending = async () => {
      try {
        const res = await axios.get("/api/interview-experience/admin");
        setPending(res.data.pending || []);
      } catch (err) {
        setPending([]);
      }
      setLoading(false);
    };
    fetchPending();

      const fetchAll = async () => {
        try {
          const res = await axios.get(`/api/interview-experience/admin/all`);
          setAll(res.data.experiences || []);
        } catch (err) {
          setAll([]);
        }
      };
      fetchAll();
  }, [user]);

  const handleAction = async (id: string, action: string) => {
    setActionLoading(id + action);
    try {
      let reason: string | undefined;
      if (action === 'reject') {
        reason = window.prompt('Enter rejection reason (optional)') || undefined;
      }
      const res = await axios.patch("/api/interview-experience/admin", { id, action, reason });
      if (res.data.message === "Approved") {
        setPending(prev => prev.filter(p => p._id !== id));
        toast.success("Approved");
      } else {
        setPending(prev => prev.filter(p => p._id !== id));
        toast.success("Rejected");
      }
    } catch (err) {
      toast.error("Action failed");
    }
    setActionLoading(null);
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Interview Experiences</h1>
          <p className="text-gray-400 text-sm">Review and approve user-submitted interview experiences.</p>
          <div className="mt-2 flex gap-2">
            <button onClick={() => setViewAll(false)} className={`px-3 py-1 text-sm rounded ${!viewAll ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-300'}`}>Pending</button>
            <button onClick={() => setViewAll(true)} className={`px-3 py-1 text-sm rounded ${viewAll ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-300'}`}>All ({all.length})</button>
          </div>
      </div>

      {loading ? (
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {(!viewAll ? pending.length === 0 : all.length === 0) && (
            <div className="bg-[#111118] border border-white/10 rounded-xl p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No pending experiences</h3>
              <p className="text-gray-400 text-sm">All interview experience submissions reviewed.</p>
            </div>
          )}

          {(viewAll ? all : pending).map((p) => (
            <div key={p._id} className="bg-[#111118] border border-white/10 rounded-xl p-4 sm:p-6">
              <div className="flex justify-between items-start gap-4">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-indigo-500 flex items-center justify-center text-white font-medium">{p.author?.charAt(0)?.toUpperCase() || "U"}</div>
                  <div>
                    <div className="text-white font-semibold">{p.title}</div>
                          <div className="text-gray-400 text-sm">by {p.author}</div>
                          <div className="text-xs text-gray-500">Status: <span className={`px-2 py-1 rounded ${p.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' : p.status === 'approved' ? 'bg-green-500/10 text-green-300' : 'bg-red-500/10 text-red-300'}`}>{p.status}</span></div>
                    <div className="text-xs text-gray-500">{new Date(p.createdAt).toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg" onClick={() => handleAction(p._id, 'approve')} disabled={actionLoading !== null}>{actionLoading === p._id + 'approve' ? '...' : 'Approve'}</button>
                  <button className="px-4 py-2 bg-red-700 text-white rounded-lg" onClick={() => handleAction(p._id, 'reject')} disabled={actionLoading !== null}>{actionLoading === p._id + 'reject' ? '...' : 'Reject'}</button>
                </div>
              </div>

              <div className="mt-4 text-gray-300">
                <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: p.content?.slice(0, 200) + '...' }} />
                {p.rawContent && (
                  <div className="mt-3 text-xs text-gray-400">
                    <details>
                      <summary className="cursor-pointer text-gray-300 underline">View original submission</summary>
                      <div className="mt-2 text-sm prose prose-invert max-w-none break-words">{p.rawContent}</div>
                    </details>
                  </div>
                )}
                {p.rejectionReason && (
                  <div className="mt-2 text-xs text-red-300">Rejection reason: {p.rejectionReason}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
