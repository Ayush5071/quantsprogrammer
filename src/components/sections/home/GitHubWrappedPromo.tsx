"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { IconBrandGithub, IconCode } from "@tabler/icons-react";
import { Trophy } from "lucide-react";
import Link from "next/link";

const platforms = [
  {
    name: "GitHub",
    icon: IconBrandGithub,
    href: "/github-wrapped",
    gradient: "from-[#2da44e] to-[#238636]",
    bgGlow: "bg-[#2da44e]/20",
    borderColor: "border-[#2da44e]/30",
    textColor: "text-[#2da44e]",
    description: "Commits, repos, languages & more",
  },
  {
    name: "Codeforces",
    icon: Trophy,
    href: "/codeforces-wrapped",
    gradient: "from-[#FF8C00] to-[#F44336]",
    bgGlow: "bg-[#FF8C00]/20",
    borderColor: "border-[#FF8C00]/30",
    textColor: "text-[#FF8C00]",
    description: "Rating journey, contests & problems",
  },
  {
    name: "LeetCode",
    icon: IconCode,
    href: "/leetcode-wrapped",
    gradient: "from-[#FFA116] to-[#FFD700]",
    bgGlow: "bg-[#FFA116]/20",
    borderColor: "border-[#FFA116]/30",
    textColor: "text-[#FFA116]",
    description: "Problem solving & contest stats",
  },
];

export default function GitHubWrappedPromo() {
  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(45,164,78,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,140,0,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_70%,rgba(255,161,22,0.08),transparent_50%)]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#2da44e]/10 via-[#FF8C00]/10 to-[#FFA116]/10 border border-white/10 rounded-full text-white text-sm mb-6"
          >
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span>✨ New Feature</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4">
            <span className="bg-gradient-to-r from-[#2da44e] via-[#FF8C00] to-[#FFA116] bg-clip-text text-transparent">
              Wrapped 2025
            </span>
          </h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            Discover your coding journey across platforms! Get AI-powered insights, 
            fun stats, and shareable cards.
          </p>
        </motion.div>

        {/* Platform Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {platforms.map((platform, index) => (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Link href={platform.href}>
                <div className={`relative overflow-hidden rounded-2xl bg-[#0f0f1a] border ${platform.borderColor} p-6 h-full transition-all hover:scale-105 hover:shadow-xl group cursor-pointer`}>
                  {/* Glow effect */}
                  <div className={`absolute inset-0 ${platform.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${platform.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                      <platform.icon size={32} className="text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {platform.name} <span className={platform.textColor}>Wrapped</span>
                    </h3>
                    <p className="text-gray-400 mb-6">
                      {platform.description}
                    </p>

                    {/* CTA */}
                    <div className={`inline-flex items-center gap-2 ${platform.textColor} font-medium group-hover:gap-3 transition-all`}>
                      <span>Generate Now</span>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
