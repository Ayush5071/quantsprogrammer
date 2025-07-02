"use client";
import React from "react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-x-hidden bg-gradient-to-br from-zinc-950 via-blue-950 to-zinc-900">
      {/* Back Button */}
      <button
        onClick={() => window.history.back()}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-zinc-900/90 border border-blue-600 text-blue-300 rounded-xl shadow-lg hover:bg-blue-900 hover:text-white transition-all hover:scale-105"
        aria-label="Go back"
      >
        <span className="material-symbols-outlined text-xl">arrow_back</span>
        <span className="hidden md:inline font-medium">Back</span>
      </button>

      {/* Animated Blobs Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-15vw] top-[-15vw] w-[50vw] h-[50vw] bg-blue-600 opacity-20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute right-[-15vw] bottom-[-15vw] w-[50vw] h-[50vw] bg-purple-600 opacity-15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute left-[40vw] top-[70vh] w-[35vw] h-[35vw] bg-blue-800 opacity-25 rounded-full blur-2xl animate-pulse" />
      </div>

      {/* Hero Section */}
      <section className="w-full flex flex-col items-center justify-center py-20 px-4">
        <div className="flex flex-col items-center gap-6">
          <img 
            src="/official_logo.png" 
            alt="Quants Programmer Logo" 
            className="h-32 w-32 rounded-2xl shadow-2xl border-4 border-blue-400 bg-zinc-900/90 hover:scale-105 transition-transform duration-300" 
          />
          <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-blue-400 via-blue-300 to-purple-400 bg-clip-text text-transparent drop-shadow-2xl text-center tracking-tight">
            Quants Programmer
          </h1>
          <p className="text-xl md:text-2xl text-zinc-300 font-medium text-center max-w-3xl mt-4 leading-relaxed">
            Empowering students and junior developers with free roadmaps, blogs, and real-world interview practice.
          </p>
          <blockquote className="mt-8 text-lg md:text-xl text-blue-200 italic font-semibold text-center max-w-2xl bg-zinc-900/50 px-6 py-4 rounded-xl border border-blue-700/50">
            "Learn, Practice, and Succeed — For Free."
          </blockquote>
        </div>
      </section>

      {/* Project Motive */}
      <section className="w-full max-w-6xl mx-auto py-16 px-6">
        <div className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl p-8 border border-blue-700/30 shadow-2xl">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent mb-6 flex items-center gap-3">
            <span className="material-symbols-outlined align-middle text-blue-400 text-4xl">lightbulb</span>
            Why Quants Programmer?
          </h2>
          <p className="text-lg text-zinc-200 mb-6 leading-relaxed">
            I created Quants Programmer to help juniors and aspiring engineers boost their knowledge, practice interviews, and access up-to-date tech content without barriers. The platform offers:
          </p>
          <ul className="grid md:grid-cols-2 gap-3 text-zinc-200">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>Curated learning roadmaps for various tech domains</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>Blogs and resources to stay updated</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>Mock interviews with AI feedback, leaderboard, and attempt history</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>Speech-to-text and text-to-speech for accessibility</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>Contact support with Gemini AI integration</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>All features are and will remain <span className="font-bold text-blue-300 bg-blue-900/30 px-2 py-1 rounded">free</span></span>
            </li>
            <li className="flex items-start gap-2 md:col-span-2">
              <span className="text-purple-400 mt-1">🚀</span>
              <span className="text-purple-200">Upcoming: Free quiz system for company-specific OA practice</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Developer Section */}
      <section className="w-full max-w-6xl mx-auto py-16 px-6">
        <div className="bg-gradient-to-r from-zinc-900/70 to-blue-900/70 backdrop-blur-sm rounded-2xl p-8 border border-blue-600/40 shadow-2xl">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent mb-6 flex items-center gap-3">
            <span className="material-symbols-outlined align-middle text-blue-400 text-3xl">person</span>
            Developer
          </h2>
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
            <img 
              src="/official_logo.png" 
              alt="Ayush Tiwari" 
              className="h-24 w-24 rounded-full border-3 border-blue-400 shadow-xl hover:scale-110 transition-transform duration-300" 
            />
            <div className="flex-1">
              <div className="text-2xl font-bold text-white mb-2">Ayush Tiwari</div>
              <div className="text-blue-200 text-lg mb-4 font-medium">B.Tech ECE, MNNIT Allahabad (2023–2027)</div>
              <div className="flex flex-wrap gap-4 text-zinc-200 text-base">
                <a href="mailto:ayusht5071@gmail.com" className="flex items-center gap-2 hover:text-blue-300 transition-colors">
                  <span>✉️</span> ayusht9919@gmail.com
                </a>
                <a href="https://github.com/Ayush5071" target="_blank" rel="noopener" className="flex items-center gap-2 hover:text-blue-300 transition-colors">
                  <span>🐙</span> GitHub
                </a>
                <a href="https://www.linkedin.com/in/ayush-tiwari-84a823281" target="_blank" rel="noopener" className="flex items-center gap-2 hover:text-blue-300 transition-colors">
                  <span>🔗</span> LinkedIn
                </a>
                <a href="https://ayush-delta.vercel.app" target="_blank" rel="noopener" className="flex items-center gap-2 hover:text-blue-300 transition-colors">
                  <span>🌐</span> Portfolio
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Education & Achievements */}
      <section className="w-full max-w-6xl mx-auto py-16 px-6 grid lg:grid-cols-2 gap-8">
        <div className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl p-8 border border-blue-700/30 shadow-xl">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-300 to-green-300 bg-clip-text text-transparent mb-6 flex items-center gap-3">
            <span className="material-symbols-outlined align-middle text-green-400 text-3xl">school</span>
            Education
          </h2>
          <ul className="space-y-4 text-zinc-200">
            <li className="flex flex-col gap-1">
              <span className="font-bold text-white">MNNIT Allahabad</span>
              <span className="text-blue-200">B.Tech ECE (2023–2027)</span>
              <span className="text-green-300">CPI: 7.88 (till 4th Sem)</span>
            </li>
            <li className="flex flex-col gap-1">
              <span className="font-bold text-white">Kanpur Public Inter College</span>
              <span className="text-blue-200">UP Board, Class 12th (2022)</span>
              <span className="text-green-300">79.8%</span>
            </li>
            <li className="flex flex-col gap-1">
              <span className="font-bold text-white">Jugal Devi Saraswati Vidya Mandir</span>
              <span className="text-blue-200">CBSE, Class 10th (2020)</span>
              <span className="text-green-300">86.8%</span>
            </li>
          </ul>
        </div>
        <div className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl p-8 border border-purple-700/30 shadow-xl">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-yellow-300 bg-clip-text text-transparent mb-6 flex items-center gap-3">
            <span className="material-symbols-outlined align-middle text-yellow-400 text-3xl">emoji_events</span>
            Achievements & Projects
          </h2>
          <ul className="space-y-3 text-zinc-200">
            <li className="flex flex-col gap-1">
              <span className="font-bold text-white">Quants Programmer</span>
              <span className="text-sm">Full-stack EdTech platform with AI interviews, leaderboard, and more.</span>
              <a href="https://quantsprogrammer.vercel.app" className="text-blue-300 hover:text-blue-400 text-sm font-medium" target="_blank" rel="noopener">🚀 Live Demo</a>
            </li>
            <li className="flex flex-col gap-1">
              <span className="font-bold text-white">CampusX</span>
              <span className="text-sm">College OLX platform with real-time auctions and chat.</span>
              <a href="https://github.com/Ayush5071/Web_Stark" className="text-blue-300 hover:text-blue-400 text-sm font-medium" target="_blank" rel="noopener">💻 Source Code</a>
            </li>
            <li><span className="text-yellow-300">🥉</span> <span className="font-semibold">Hack36 – CC MNNIT:</span> 9th place among 100+ teams (2025)</li>
            <li><span className="text-yellow-300">🥇</span> <span className="font-semibold">Innodev – ES MNNIT:</span> 1st place among 100+ teams (2025)</li>
            <li><span className="text-yellow-300">🥇</span> <span className="font-semibold">Dev or Die – MNNIT:</span> 1st out of 50+ teams (2024)</li>
            <li><span className="text-yellow-300">🥉</span> <span className="font-semibold">Quintathlon – ES MNNIT:</span> 3rd place in mock interview + OA event (2024)</li>
            <li><span className="text-green-400">💻</span> <span className="font-semibold">LeetCode:</span> 1764 rating, 500+ problems solved</li>
          </ul>
        </div>
      </section>

      {/* Skills */}
      <section className="w-full max-w-6xl mx-auto py-16 px-6">
        <div className="bg-gradient-to-br from-zinc-900/70 to-purple-900/70 backdrop-blur-sm rounded-2xl p-8 border border-purple-600/40 shadow-2xl">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent mb-6 flex items-center gap-3">
            <span className="material-symbols-outlined align-middle text-purple-400 text-3xl">build</span>
            Technical Skills & Interests
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-zinc-200">
            <div className="space-y-2">
              <h3 className="font-bold text-blue-300 text-lg">Languages</h3>
              <p>C++, JavaScript, TypeScript</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-green-300 text-lg">Frontend</h3>
              <p>React, React Native, Next.js, Tailwind CSS, GSAP</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-yellow-300 text-lg">Backend</h3>
              <p>Node.js, Express.js</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-red-300 text-lg">Databases</h3>
              <p>MongoDB, SQL, DBMS</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-purple-300 text-lg">Tools</h3>
              <p>VS Code, Git, GitHub</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-cyan-300 text-lg">Core Subjects</h3>
              <p>Data Structures, Operating Systems</p>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-zinc-700">
            <h3 className="font-bold text-orange-300 text-lg mb-3">Soft Skills</h3>
            <div className="flex flex-wrap gap-3">
              {['Problem Solving', 'Teamwork', 'Communication', 'Time Management', 'Project Management'].map((skill) => (
                <span key={skill} className="px-3 py-1 bg-orange-900/30 text-orange-200 rounded-full border border-orange-700/50 text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="w-full text-center text-zinc-400 text-base py-8 mt-8 bg-zinc-900/30 backdrop-blur-sm border-t border-zinc-700/50">
        <div className="max-w-4xl mx-auto px-4">
          &copy; {new Date().getFullYear()} Quants Programmer. Made with <span className="text-red-400 animate-pulse">❤️</span> by Ayush Tiwari.
        </div>
      </footer>
    </main>
  );
}
