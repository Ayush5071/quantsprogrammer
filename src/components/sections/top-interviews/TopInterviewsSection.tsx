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
      .then((res) => res.json())
      .then((data) => setInterviews(data || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-400 text-sm">Loading interviews...</span>
        </div>
      </div>
    );
  }

  if (interviews.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-white mb-2">No interviews available</h3>
        <p className="text-gray-500 text-sm">Check back later for new top interviews.</p>
      </div>
    );
  }

  return (
    <section className="w-full">
      {/* Section Header */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">Available Interviews</h2>
        <p className="text-gray-500 text-sm">{interviews.length} interview{interviews.length !== 1 ? 's' : ''} available</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {interviews.map((interview: any) => (
          <div
            key={interview._id}
            className="bg-[#111118] border border-white/5 rounded-xl p-5 flex flex-col hover:border-white/10 transition-all group"
          >
            <div className="flex-1">
              <h3 className="text-base font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                {interview.title}
              </h3>
              <p className="text-gray-500 text-sm mb-3 line-clamp-2">{interview.description}</p>
              
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {interview.questions?.length || 0} questions
                </span>
                {interview.level && (
                  <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {interview.level}
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2 mt-auto pt-3 border-t border-white/5">
              <Link
                href={`/top-interviews/${interview._id}`}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-medium rounded-lg transition-all text-center"
              >
                Start Interview
              </Link>
              <button
                className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white text-sm rounded-lg transition-all"
                onClick={() => router.push(`/top-interviews/${interview._id}/leaderboard`)}
                title="View Leaderboard"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
