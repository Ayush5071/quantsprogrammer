"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Play } from "lucide-react";
import { GridScan } from "@/components/GridScan";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="h-screen w-full flex flex-col items-center justify-center px-4 relative overflow-hidden bg-[#0a0a0f] text-white"
    >
      {/* Subtle gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-600/8 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/7 rounded-full blur-[128px] pointer-events-none" />
      <div
        className="absolute inset-0 group"
        tabIndex={0}   
      >
        <GridScan
          sensitivity={0.28} /* slightly lower sensitivity for much subtler interaction */
          lineThickness={0.9}
          linesColor="#ffb3d9" /* soft pinkish grid lines */
          gridScale={0.16} /* slightly larger grid for calmer look */
          scanColor="#ff77d6" /* pink scan color */
          scanOpacity={0.22} /* keep scan subtle to avoid blackout */
          enablePost
          bloomIntensity={0.01} /* small bloom to avoid heavy brightening */
          chromaticAberration={0.001}
          noiseIntensity={0.002} /* very light noise */
          scanDirection="pingpong"
          scanGlow={0.45}
          scanSoftness={1.2}
          scanDuration={3.8}
          scanDelay={1.6}
          scanOnClick={false}
          lineJitter={0.02}
          className="absolute inset-0"
        />
      </div>
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur border border-white/10 rounded-full text-sm text-pink-200 mb-6">
          <Sparkles className="w-4 h-4 text-pink-300" />
          <span>Trusted by hundreds of startups & creators</span>
        </div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-3 tracking-tight leading-[1.05]"
        >
          Build your
          <br />
          <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-pink-300 bg-clip-text text-transparent">Digital Presence</span>
        </motion.h1>

        {/* Subtitle - minimal */}
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.08 }}
          className="text-pink-100 text-sm sm:text-base max-w-2xl mx-auto mb-8 leading-relaxed"
        >
          Beautiful, fast, and scalable websites — designed with modern UX, performance and developer-first practices.
        </motion.p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="#pricing" className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white font-semibold rounded-xl transition-all duration-300">
            View Pricing
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link href="#work" className="flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/7 border border-white/10 text-white font-semibold rounded-xl transition-all">
            <Play className="w-5 h-5 text-pink-300" />
            See Live Work
          </Link>
        </div>
      </div>
    </section>
  );
}
