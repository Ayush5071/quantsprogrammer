"use client";
import React from "react";
import { motion } from "framer-motion";
import { Users, Mic, FileText, Award, Map, TrendingUp } from "lucide-react";
import { useStats } from "@/context/DataCacheContext";

export default function StatsSection() {
  const { stats, isLoading } = useStats();

  const statItems = [
    { 
      icon: Users, 
      value: stats?.activeUsers || "1K+", 
      label: "Active Users",
      color: "text-blue-400"
    },
    { 
      icon: Mic, 
      value: stats?.totalInterviews || "5K+", 
      label: "Interviews Taken",
      color: "text-purple-400"
    },
    { 
      icon: FileText, 
      value: stats?.publishedBlogs || "500+", 
      label: "Blogs Published",
      color: "text-green-400"
    },
    { 
      icon: Map, 
      value: stats?.availableRoadmaps || "20+", 
      label: "Roadmaps",
      color: "text-orange-400"
    },
    { 
      icon: Award, 
      value: stats?.certificatesEarned || "2K+", 
      label: "Certificates",
      color: "text-yellow-400"
    },
    { 
      icon: TrendingUp, 
      value: "95%", 
      label: "Success Rate",
      color: "text-pink-400"
    },
  ];

  return (
    <section className="w-full py-16 px-4 bg-[#0a0a0f]">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative p-8 bg-gradient-to-br from-[#111118] to-[#0d0d14] border border-white/5 rounded-3xl overflow-hidden"
        >
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-purple-600/5 pointer-events-none" />

          {/* Stats Grid */}
          <div className="relative grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {statItems.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <stat.icon className={`w-6 h-6 ${stat.color} mb-3`} />
                <span className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  {stat.value}
                </span>
                <span className="text-xs text-gray-500">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
