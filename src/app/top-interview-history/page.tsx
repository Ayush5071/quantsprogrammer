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
      .then(res => res.json())
      .then(data => setAttempts(data || []))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return <div className="text-blue-400 min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-blue-950 flex flex-col items-center py-12 px-2 md:px-8">
      {/* Back Button - top left, only on md+ screens */}
      <button
        onClick={() => router.back()}
        className="hidden md:flex fixed top-6 left-4 items-center gap-2 text-blue-400 hover:text-blue-300 hover:underline text-xl md:text-2xl px-6 py-3 rounded-2xl bg-zinc-900 shadow-lg border-2 border-blue-700 transition-all z-50"
        style={{ position: 'fixed', top: '1.5rem', left: '1rem', zIndex: 50 }}
      >
        <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        <span className="hidden sm:inline">Back</span>
      </button>
      <h1 className="text-3xl md:text-4xl font-bold text-blue-400 mb-8 text-center">Top Interview History</h1>
      {loading ? (
        <div className="text-blue-300">Loading...</div>
      ) : attempts.length === 0 ? (
        <div className="text-zinc-400">No top interview attempts found.</div>
      ) : (
        <div className="w-full max-w-2xl flex flex-col gap-4">
          {attempts.map((a, i) => (
            <div
              key={a._id || i}
              className="bg-gradient-to-br from-blue-950 via-zinc-900 to-purple-950 border-2 border-blue-800 rounded-2xl shadow-xl p-4 flex flex-col md:flex-row md:items-center gap-3 hover:scale-[1.01] transition-transform duration-200 cursor-pointer"
              onClick={() => setModal({ open: true, attempt: a })}
            >
              <div className="flex-1">
                <div className="text-lg font-extrabold text-blue-300 mb-1 italic drop-shadow">{a.interviewTitle || a.topInterviewTitle || a.topInterview?.title || "Top Interview"}</div>
                <div className="text-zinc-200 text-sm mb-1 font-semibold">Score: <span className="font-bold text-green-400">{a.score}/100</span></div>
                <div className="text-zinc-400 text-xs mb-1">Attempted: {a.createdAt ? new Date(a.createdAt).toLocaleString() : "-"}</div>
              </div>
              <button
                className="px-3 py-1 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold shadow transition-all text-center text-sm"
                onClick={e => { e.stopPropagation(); window.open(`/top-interviews/${a.topInterviewId || a.topInterview?._id}`, '_blank'); }}
              >
                View Interview
              </button>
              <button
                className="px-3 py-1 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-semibold shadow transition-all text-center text-sm"
                onClick={e => { e.stopPropagation(); setModal({ open: true, attempt: a }); }}
              >
                Show Details
              </button>
            </div>
          ))}
        </div>
      )}
      {/* Modal for details */}
      {modal.open && modal.attempt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-gradient-to-br from-blue-950 via-zinc-900 to-purple-950 rounded-3xl shadow-2xl border-2 border-blue-900 max-w-3xl w-full p-10 relative flex flex-col max-h-[95vh] overflow-y-auto animate-fadeIn">
            <button
              className="absolute top-4 right-4 text-blue-400 hover:text-blue-200 text-2xl font-bold"
              onClick={() => setModal({ open: false, attempt: null })}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-3xl font-extrabold text-blue-300 mb-4 italic text-center drop-shadow-lg">{modal.attempt.interviewTitle || modal.attempt.topInterviewTitle || modal.attempt.topInterview?.title || "Top Interview"}</h2>
            <div className="flex flex-col md:flex-row md:justify-center md:items-center gap-4 mb-4">
              <div className="text-zinc-200 text-lg font-semibold text-center">Score: <span className="font-bold text-green-400">{modal.attempt.score}/100</span></div>
              <div className="text-zinc-400 text-xs text-center">Attempted: {modal.attempt.createdAt ? new Date(modal.attempt.createdAt).toLocaleString() : "-"}</div>
            </div>
            <div className="text-zinc-100 whitespace-pre-line text-base md:text-lg mb-6 max-h-80 overflow-y-auto rounded-2xl bg-zinc-900 p-6 border border-blue-800 shadow-inner font-mono">
              {modal.attempt.feedback}
            </div>
            <button
              className="w-full mt-2 px-8 py-4 bg-blue-700 hover:bg-blue-800 text-white rounded-2xl font-bold shadow transition-all text-xl"
              onClick={() => setModal({ open: false, attempt: null })}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
