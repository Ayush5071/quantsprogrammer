"use client";
import TopInterviewsSection from "@/components/sections/top-interviews/TopInterviewsSection";
import Link from "next/link";
import useCurrentUser from "@/lib/useCurrentUser";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function TopInterviewsPage() {
  const user = useCurrentUser();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Loading state - user is undefined while API call is in progress
  if (user === undefined) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-400 text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  // Not logged in - user is null when API returns 401
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-4">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
        </div>
        <div className="relative z-10 text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-blue-500/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">Login Required</h1>
          <p className="text-gray-400 text-sm mb-6">
            Sign in to access Top Interviews, track your progress, and compete on the leaderboard.
          </p>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium rounded-lg transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Login to Continue
          </Link>
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
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-lg sm:text-xl font-bold text-white">Top Interviews</h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              <Link
                href="/top-interview-history"
                className="px-4 py-2 text-gray-400 hover:text-white text-sm font-medium hover:bg-white/5 rounded-lg transition-all"
              >
                My History
              </Link>
              <Link
                href="/interview"
                className="px-4 py-2 text-gray-400 hover:text-white text-sm font-medium hover:bg-white/5 rounded-lg transition-all"
              >
                Practice Interview
              </Link>
              {user?.isAdmin && (
                <Link
                  href="/admin/top-interview-create"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-medium rounded-lg transition-all"
                >
                  Create Interview
                </Link>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-3 pt-3 border-t border-white/5 flex flex-col gap-1">
              <Link
                href="/top-interview-history"
                className="px-4 py-3 text-gray-300 hover:text-white text-sm font-medium hover:bg-white/5 rounded-lg transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                My History
              </Link>
              <Link
                href="/interview"
                className="px-4 py-3 text-gray-300 hover:text-white text-sm font-medium hover:bg-white/5 rounded-lg transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                Practice Interview
              </Link>
              {user?.isAdmin && (
                <Link
                  href="/admin/top-interview-create"
                  className="px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg transition-all text-center mt-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Create Interview
                </Link>
              )}
            </nav>
          )}
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <TopInterviewsSection />
      </main>
    </div>
  );
}
