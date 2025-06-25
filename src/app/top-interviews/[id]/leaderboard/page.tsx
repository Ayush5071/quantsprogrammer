"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function TopInterviewLeaderboardPage() {
  const params = useParams();
  const router = useRouter();
  const [attempts, setAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [interview, setInterview] = useState<any>(null);

  useEffect(() => {
    if (!params?.id) return;
    // Fetch interview details
    fetch(`/api/top-interviews`)
      .then(res => res.json())
      .then(data => {
        const found = data.find((i: any) => i._id === params.id);
        setInterview(found);
      });
    // Fetch attempts for this interview
    fetch(`/api/top-interviews/attempts?id=${params.id}`)
      .then(res => res.json())
      .then(data => setAttempts(data))
      .finally(() => setLoading(false));
  }, [params]);

  // Only show the highest score per user
  const uniqueAttempts = Object.values(
    attempts.reduce((acc: Record<string, any>, a: any) => {
      const userId = a.user?._id || a.user?.email || a.user;
      if (!acc[userId] || a.score > acc[userId].score) {
        acc[userId] = a;
      }
      return acc;
    }, {} as Record<string, any>)
  ).sort((a: any, b: any) => b.score - a.score || new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  if (loading) return <div className="text-blue-400">Loading leaderboard...</div>;
  if (!interview) return <div className="text-zinc-400">Interview not found.</div>;

  return (
    <div className="relative max-w-3xl mx-auto p-4 md:p-8">
      {/* Back Button - top left, always visible */}
      <button
        onClick={() => router.back()}
        className="fixed top-6 left-4 flex items-center gap-2 text-blue-400 hover:text-blue-300 hover:underline text-xl md:text-2xl px-6 py-3 rounded-2xl bg-zinc-900 shadow-lg border-2 border-blue-700 transition-all z-50"
        style={{ position: 'fixed', top: '1.5rem', left: '1rem', zIndex: 50 }}
      >
        <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        <span className="hidden sm:inline">Back</span>
      </button>
      <h1 className="text-3xl md:text-4xl font-extrabold text-center bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2 mt-10 md:mt-0">Leaderboard: {interview.title}</h1>
      <div className="mb-6 text-zinc-200 text-center text-base md:text-lg">{interview.description}</div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-zinc-900 rounded-xl shadow-lg">
          <thead>
            <tr className="bg-gradient-to-r from-blue-900 via-purple-900 to-pink-900 text-blue-200">
              <th className="px-4 py-2 text-left">Rank</th>
              <th className="px-4 py-2 text-left">User</th>
              <th className="px-4 py-2 text-left">Score</th>
              <th className="px-4 py-2 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {uniqueAttempts.length === 0 ? (
              <tr><td colSpan={4} className="text-center text-zinc-400 py-6">No attempts yet.</td></tr>
            ) : (
              uniqueAttempts.map((a: any, i: number) => (
                <tr key={a._id} className={i === 0 ? "bg-blue-800/30" : "hover:bg-zinc-800 transition-colors"}>
                  <td className="px-4 py-2 font-bold text-lg text-center">{i + 1}</td>
                  <td className="px-4 py-2 text-center">{a.user?.name || a.user?.email || "User"}</td>
                  <td className="px-4 py-2 text-blue-400 font-bold text-center text-lg">{a.score}</td>
                  <td className="px-4 py-2 text-zinc-400 text-center">{new Date(a.createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
