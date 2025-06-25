"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TopInterviewsSection() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/top-interviews")
      .then(res => res.json())
      .then(data => setInterviews(data || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="w-full max-w-5xl mx-auto my-12">
      <h2 className="text-3xl md:text-4xl font-bold text-blue-400 mb-6">Top Interviews</h2>
      {loading ? (
        <div className="text-blue-400">Loading...</div>
      ) : interviews.length === 0 ? (
        <div className="text-zinc-400">No top interviews available yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviews.map((interview: any) => (
            <div key={interview._id} className="bg-zinc-900 border-2 border-blue-800 rounded-2xl shadow-lg p-6 flex flex-col gap-3">
              <h3 className="text-xl font-bold text-blue-300">{interview.title}</h3>
              <p className="text-zinc-200 mb-2">{interview.description}</p>
              <div className="text-blue-400 text-sm mb-2">Questions: {interview.questions?.length || 0}</div>
              <div className="flex-1" />
              <Link href={`/top-interviews/${interview._id}`} className="mt-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold shadow transition-all text-center block">Attempt Interview</Link>
              <div className="flex flex-col gap-4">
                <button
                  className="px-4 py-2 bg-blue-800 hover:bg-blue-900 text-white rounded-lg font-semibold shadow transition-all w-full md:w-auto"
                  onClick={() => router.push(`/top-interviews/${interview._id}/leaderboard`)}
                >
                  See Leaderboard
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
