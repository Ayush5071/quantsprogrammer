"use client"
import TopInterviewsSection from "@/components/sections/top-interviews/TopInterviewsSection";
import Link from "next/link";
import useCurrentUser from "@/lib/useCurrentUser";
import React from "react";
import { useRouter } from "next/navigation";

export default function TopInterviewsPage() {
  const user = useCurrentUser();
  const router = useRouter();
  if (user === null) {
    // Show loading state while user is being fetched
    return <div className="text-blue-400 min-h-screen flex items-center justify-center">Loading...</div>;
  }
  if (!user) {
    // Not logged in: show themed message and login link
    return (
      <main className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-blue-950 flex flex-col items-center justify-center px-4">
        <div className="animate-pulse text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-6 drop-shadow-lg">
            To use this feature you must log in
          </h1>
          <p className="text-lg md:text-2xl text-zinc-200 mb-8">Sign in to access Top Interviews and track your progress, leaderboard, and feedback.</p>
          <Link href="/auth/login" className="inline-block px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-700 to-pink-600 text-white font-bold text-xl shadow-lg hover:scale-105 hover:shadow-2xl transition-all">
            Login to Continue
          </Link>
        </div>
      </main>
    );
  }
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
      <div className="w-full max-w-5xl flex flex-col items-end mb-6">
        {user?.isAdmin && (
          <Link href="/admin/top-interview-create" className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-lg font-semibold shadow transition-all">Create Top Interview</Link>
        )}
      </div>
      <TopInterviewsSection />
    </main>
  );
}
