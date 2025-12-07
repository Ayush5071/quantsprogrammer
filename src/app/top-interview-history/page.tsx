"use client";
import React, { useEffect, useState } from "react";
import useCurrentUser from "@/lib/useCurrentUser";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TopInterviewHistoryPage() {
  const router = useRouter();
  const user = useCurrentUser();
  const [attempts, setAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; attempt: any | null }>({ open: false, attempt: null });

  useEffect(() => {
    if (!user?._id) return;
    fetch(`/api/top-interviews/attempt?userId=${user._id}`)
      .then((res) => res.json())
      .then((data) => setAttempts(data || []))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-400 text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Subtle background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.06),transparent_50%)]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2 text-gray-400 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline text-sm">Back</span>
            </button>
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-white">Coding Arena History</h1>
              <p className="text-gray-500 text-sm hidden sm:block">View all your past coding arena attempts</p>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-gray-400 text-sm">Loading history...</span>
            </div>
          </div>
        ) : attempts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No attempts yet</h3>
            <p className="text-gray-500 text-sm mb-6">Start your first coding arena challenge to see your history here.</p>
            <Link
              href="/top-interviews"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-medium rounded-lg transition-all"
            >
              Browse Coding Arena
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {attempts.map((a, i) => (
              <div
                key={a._id || i}
                className="bg-[#111118] border border-white/5 rounded-xl p-4 hover:border-white/10 transition-all cursor-pointer"
                onClick={() => setModal({ open: true, attempt: a })}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium truncate">
                      {a.interviewTitle || a.topInterviewTitle || a.topInterview?.title || "Coding Arena"}
                    </h3>
                    <p className="text-gray-500 text-xs mt-1">
                      {a.createdAt ? new Date(a.createdAt).toLocaleString() : "-"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-green-400">{a.score}</span>
                      <span className="text-gray-500 text-sm">/100</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`/top-interviews/${a.topInterviewId || a.topInterview?._id}`, "_blank");
                        }}
                        title="View Interview"
                      >
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </button>
                      <button
                        className="p-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          setModal({ open: true, attempt: a });
                        }}
                        title="Show Details"
                      >
                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal for details */}
      {modal.open && modal.attempt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#111118] border border-white/10 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {modal.attempt.interviewTitle || modal.attempt.topInterviewTitle || modal.attempt.topInterview?.title || "Coding Arena"}
                </h2>
                <p className="text-gray-500 text-xs mt-1">
                  {modal.attempt.createdAt ? new Date(modal.attempt.createdAt).toLocaleString() : "-"}
                </p>
              </div>
              <button
                className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white"
                onClick={() => setModal({ open: false, attempt: null })}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Score */}
            <div className="px-5 py-4 border-b border-white/5 bg-green-500/5">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Score</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-green-400">{modal.attempt.score}</span>
                  <span className="text-gray-500 text-sm">/100</span>
                </div>
              </div>
              <div className="mt-2 w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                  style={{ width: `${modal.attempt.score}%` }}
                />
              </div>
            </div>

            {/* Feedback */}
            <div className="flex-1 overflow-y-auto p-5">
              <h3 className="text-sm font-medium text-gray-400 mb-3">Feedback</h3>
              <div className="text-gray-300 text-sm whitespace-pre-line bg-[#0a0a0f] border border-white/5 rounded-lg p-4">
                {modal.attempt.feedback || "No feedback available."}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-white/5">
              <button
                className="w-full px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-medium rounded-lg transition-all"
                onClick={() => setModal({ open: false, attempt: null })}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
