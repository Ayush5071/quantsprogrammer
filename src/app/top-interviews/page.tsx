"use client"
import TopInterviewsSection from "@/components/sections/top-interviews/TopInterviewsSection";
import Link from "next/link";
import useCurrentUser from "@/lib/useCurrentUser";
import React from "react";

export default function TopInterviewsPage() {
  const user = useCurrentUser();
  if (user === null) {
    // Show loading state while user is being fetched
    return <div className="text-blue-400 min-h-screen flex items-center justify-center">Loading...</div>;
  }
  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-blue-950 flex flex-col items-center py-12 px-2 md:px-8">
      <div className="w-full max-w-5xl flex flex-col items-end mb-6">
        {user?.isAdmin && (
          <Link href="/admin/top-interview-create" className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-lg font-semibold shadow transition-all">Create Top Interview</Link>
        )}
      </div>
      <TopInterviewsSection />
    </main>
  );
}
