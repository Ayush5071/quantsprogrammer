"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useStats } from "@/context/DataCacheContext";
import { ArrowRight, Sparkles, Play } from "lucide-react";

export default function NewHero() {
  const router = useRouter();
  const { stats, isLoading } = useStats();

  const formatNumber = (num: number): string => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return `${num}`;
  };

  return (
    <section className="min-h-[90vh] w-full flex flex-col items-center justify-center px-4 relative overflow-hidden bg-[#0a0a0f]">
      {/* Subtle gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-[128px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur border border-white/10 rounded-full text-sm text-gray-400 mb-8">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>Trusted by {isLoading ? "..." : formatNumber(stats?.activeUsers || 0)} developers</span>
        </div>

        {/* Main headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight leading-[1.1]">
          Build Your
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
            Tech Career
          </span>
        </h1>

        {/* Subtitle - minimal */}
        <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          AI interviews, structured roadmaps, and career insights—everything to accelerate your developer journey.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <button
            onClick={() => router.push("/explore")}
            className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl transition-all duration-300"
          >
            Get Started
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={() => router.push("/interview")}
            className="flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl transition-all"
          >
            <Play className="w-5 h-5" />
            Try AI Interview
          </button>
        </div>

      </div>
    </section>
  );
}
