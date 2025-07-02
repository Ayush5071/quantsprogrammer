"use client";
import Link from "next/link";

export default function LoginRequiredPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-blue-950 flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-6 drop-shadow-lg animate-fade-in">
          To use this feature you must log in
        </h1>
        <p className="text-lg md:text-2xl text-zinc-200 mb-8">Sign in to access Interview features, Top Interviews, leaderboard, and feedback.</p>
        <Link href="/auth/login" className="inline-block px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-700 to-pink-600 text-white font-bold text-xl shadow-lg hover:scale-105 hover:shadow-2xl transition-all">
          Login to Continue
        </Link>
      </div>
    </main>
  );
}

// Add a simple fade-in animation only once
// In your global CSS (e.g., globals.css), add:
// .animate-fade-in { animation: fadeIn 1.2s cubic-bezier(0.4,0,0.2,1) 1; }
// @keyframes fadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: none; } }
