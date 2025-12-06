import React from "react";

export default function WhyDevRoadmap() {
  return (
    <section className="w-full pt-32 pb-16 px-2 sm:px-4 flex flex-col items-center min-h-[60vh]">
      <h2 className="text-4xl xs:text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6 text-center drop-shadow-lg leading-tight">
        Why Choose Dev Roadmap?
      </h2>
      <div className="max-w-4xl text-center mb-10">
        <p className="text-base xs:text-lg sm:text-xl md:text-2xl text-zinc-100 font-semibold md:font-extrabold tracking-tight leading-snug md:leading-snug">
          <span className="text-blue-300 font-bold">
            Struggling with scattered learning resources?
          </span>{" "}
          Nervous about technical interviews? Want to build your developer portfolio?{" "}
          <span className="text-purple-300 font-bold">Dev Roadmap</span> combines 
          structured learning, AI-powered interview practice, and portfolio building 
          into one comprehensive platform.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl justify-center items-stretch">
        <div className="bg-gradient-to-br from-blue-900/90 via-blue-950/90 to-zinc-900/90 border-2 border-blue-700 rounded-2xl shadow-2xl p-6 flex flex-col items-center text-center hover:scale-105 transition-transform duration-200">
          <span className="text-4xl mb-3">🎯</span>
          <h3 className="text-lg xs:text-xl font-bold text-blue-200 mb-2">
            Structured Learning
          </h3>
          <p className="text-zinc-300 text-sm xs:text-base">
            Follow expert-crafted roadmaps with clear milestones and progress tracking.
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-900/90 via-purple-950/90 to-zinc-900/90 border-2 border-purple-700 rounded-2xl shadow-2xl p-6 flex flex-col items-center text-center hover:scale-105 transition-transform duration-200">
          <span className="text-4xl mb-3">🤖</span>
          <h3 className="text-lg xs:text-xl font-bold text-purple-200 mb-2">
            AI Interview Practice
          </h3>
          <p className="text-zinc-300 text-sm xs:text-base">
            Practice with AI-powered mock interviews and get instant, detailed feedback.
          </p>
        </div>
        <div className="bg-gradient-to-br from-pink-900/90 via-pink-950/90 to-zinc-900/90 border-2 border-pink-700 rounded-2xl shadow-2xl p-6 flex flex-col items-center text-center hover:scale-105 transition-transform duration-200">
          <span className="text-4xl mb-3">�</span>
          <h3 className="text-lg xs:text-xl font-bold text-pink-200 mb-2">
            Portfolio Building
          </h3>
          <p className="text-zinc-300 text-sm xs:text-base">
            Write technical blogs and showcase your journey to build your brand.
          </p>
        </div>
        <div className="bg-gradient-to-br from-teal-900/90 via-teal-950/90 to-zinc-900/90 border-2 border-teal-700 rounded-2xl shadow-2xl p-6 flex flex-col items-center text-center hover:scale-105 transition-transform duration-200">
          <span className="text-4xl mb-3">🏆</span>
          <h3 className="text-lg xs:text-xl font-bold text-teal-200 mb-2">
            Achievements
          </h3>
          <p className="text-zinc-300 text-sm xs:text-base">
            Earn certificates, compete on leaderboards, and track your success.
          </p>
        </div>
      </div>
    </section>
  );
}
