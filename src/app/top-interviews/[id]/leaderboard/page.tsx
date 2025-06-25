"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function TopInterviewLeaderboardPage() {
  const params = useParams();
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

  if (loading) return <div className="text-blue-400">Loading leaderboard...</div>;
  if (!interview) return <div className="text-zinc-400">Interview not found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-blue-400 mb-2">Leaderboard: {interview.title}</h1>
      <div className="mb-6 text-zinc-200">{interview.description}</div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-zinc-900 rounded-xl shadow-lg">
          <thead>
            <tr className="bg-blue-900 text-blue-200">
              <th className="px-4 py-2 text-left">Rank</th>
              <th className="px-4 py-2 text-left">User</th>
              <th className="px-4 py-2 text-left">Score</th>
              <th className="px-4 py-2 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {attempts.length === 0 ? (
              <tr><td colSpan={4} className="text-center text-zinc-400 py-6">No attempts yet.</td></tr>
            ) : (
              attempts.map((a, i) => (
                <tr key={a._id} className={i === 0 ? "bg-blue-800/30" : ""}>
                  <td className="px-4 py-2 font-bold">{i + 1}</td>
                  <td className="px-4 py-2">{a.user?.name || a.user?.email || "User"}</td>
                  <td className="px-4 py-2 text-blue-400 font-bold">{a.score}</td>
                  <td className="px-4 py-2 text-zinc-400">{new Date(a.createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
