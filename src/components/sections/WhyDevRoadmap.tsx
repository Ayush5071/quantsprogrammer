import React from "react";

export default function WhyDevRoadmap() {
  return (
    <section className="w-full pt-32 pb-16 px-2 sm:px-4 flex flex-col items-center min-h-[60vh]">
      <h2 className="text-4xl xs:text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6 text-center drop-shadow-lg leading-tight">
        Why Dev Roadmap?
      </h2>
      <div className="max-w-2xl text-center mb-10">
        <p className="text-base xs:text-lg sm:text-xl md:text-2xl text-zinc-100 font-semibold md:font-extrabold tracking-tight leading-snug md:leading-snug">
          <span className="text-blue-300 font-bold">
            Overwhelmed by endless resources?
          </span>{" "}
          Unsure what to learn next? Most developers waste time searching, get lost
          in tutorials, or lose motivation without a clear path.{" "}
          <span className="text-purple-300 font-bold">Dev Roadmap</span> gives
          you a structured, up-to-date journey, progress tracking, and a supportive
          community—all in one place.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-4xl justify-center items-center">
        <div className="flex-1 w-full max-w-xs bg-gradient-to-br from-blue-900/90 via-blue-950/90 to-zinc-900/90 border-2 border-blue-700 rounded-2xl shadow-2xl p-6 flex flex-col items-center text-center hover:scale-105 transition-transform duration-200">
          <span className="text-4xl mb-2">❌</span>
          <h3 className="text-lg xs:text-xl font-bold text-blue-200 mb-1">
            No More Overwhelm
          </h3>
          <p className="text-zinc-300 text-sm xs:text-base">
            Stop guessing what to learn next—follow a clear, expert-crafted path.
          </p>
        </div>
        <div className="flex-1 w-full max-w-xs bg-gradient-to-br from-purple-900/90 via-purple-950/90 to-zinc-900/90 border-2 border-purple-700 rounded-2xl shadow-2xl p-6 flex flex-col items-center text-center hover:scale-105 transition-transform duration-200">
          <span className="text-4xl mb-2">🔎</span>
          <h3 className="text-lg xs:text-xl font-bold text-purple-200 mb-1">
            No More Scattered Resources
          </h3>
          <p className="text-zinc-300 text-sm xs:text-base">
            All essential resources, tools, and guides in one organized platform.
          </p>
        </div>
        <div className="flex-1 w-full max-w-xs bg-gradient-to-br from-pink-900/90 via-pink-950/90 to-zinc-900/90 border-2 border-pink-700 rounded-2xl shadow-2xl p-6 flex flex-col items-center text-center hover:scale-105 transition-transform duration-200">
          <span className="text-4xl mb-2">🚀</span>
          <h3 className="text-lg xs:text-xl font-bold text-pink-200 mb-1">
            Stay Motivated
          </h3>
          <p className="text-zinc-300 text-sm xs:text-base">
            Track your progress, celebrate milestones, and grow with a community.
          </p>
        </div>
      </div>
    </section>
  );
}
