"use client";

import React from "react";
import { motion } from "framer-motion";
import { Github, Sparkles, Star, GitBranch, Rocket, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function GitHubWrappedPromo() {
  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(0,255,255,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(168,85,247,0.08),transparent_50%)]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f0f1a] via-[#1a1a2e] to-[#0f0f1a] border border-cyan-500/20"
        >
          {/* Animated gradient border */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-purple-500/20 to-pink-500/0 animate-pulse" />
          
          <div className="relative p-8 md:p-12 lg:p-16">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
              {/* Left content */}
              <div className="flex-1 text-center lg:text-left">
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-sm mb-6"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>✨ New Feature</span>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-black mb-4"
                >
                  <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    GitHub Wrapped
                  </span>
                  <br />
                  <span className="text-white">2024</span>
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-400 text-lg md:text-xl max-w-xl mb-8"
                >
                  Discover your coding journey in style! Get AI-powered insights, 
                  fun stats, and shareable cards of your GitHub activity.
                </motion.p>

                {/* Stats preview */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8"
                >
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl">
                    <Rocket className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 font-medium">Commit Stats</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                    <GitBranch className="w-5 h-5 text-purple-400" />
                    <span className="text-purple-400 font-medium">Language Breakdown</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <span className="text-yellow-400 font-medium">Star Count</span>
                  </div>
                </motion.div>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                >
                  <Link
                    href="/github-wrapped"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-lg rounded-2xl shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 hover:shadow-cyan-500/40"
                  >
                    <Github className="w-6 h-6" />
                    Generate Your Wrapped
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </motion.div>
              </div>

              {/* Right - Preview mockup */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="flex-shrink-0"
              >
                <div className="relative">
                  {/* Glow effect */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-pink-500/30 rounded-3xl blur-2xl opacity-50" />
                  
                  {/* Card preview */}
                  <div className="relative w-72 md:w-80 bg-gradient-to-br from-[#111118] to-[#0a0a0f] border border-cyan-500/30 rounded-2xl p-6 shadow-2xl">
                    {/* Avatar placeholder */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
                        <Github className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <div className="h-4 w-24 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full mb-2" />
                        <div className="h-3 w-32 bg-gray-700 rounded-full" />
                      </div>
                    </div>

                    {/* Stats preview */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">1.2K</div>
                        <div className="text-xs text-gray-500">Commits</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-400">42</div>
                        <div className="text-xs text-gray-500">Streak</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-400">128</div>
                        <div className="text-xs text-gray-500">Stars</div>
                      </div>
                    </div>

                    {/* Title badge */}
                    <div className="text-center">
                      <span className="inline-block px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-full text-yellow-400 font-bold text-sm">
                        🏆 Code Explorer
                      </span>
                    </div>

                    {/* Floating decorations */}
                    <motion.div
                      animate={{ y: [-5, 5, -5] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute -top-4 -right-4 w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
                    >
                      <Sparkles className="w-5 h-5 text-white" />
                    </motion.div>
                    
                    <motion.div
                      animate={{ y: [5, -5, 5] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                      className="absolute -bottom-3 -left-3 w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg"
                    >
                      <Star className="w-4 h-4 text-white" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
