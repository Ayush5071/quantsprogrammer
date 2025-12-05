"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, Map, User, ExternalLink, Search } from "lucide-react";

const ExplorePage = () => {
  const router = useRouter();
  const [roadmaps, setRoadmaps] = useState<Array<{
    _id: string;
    title: string;
    description?: string;
    createdBy: string;
    linkedIn?: string;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/roadmap/fetchall")
      .then((res) => res.json())
      .then((data) => {
        setRoadmaps(data.roadmaps || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredRoadmaps = roadmaps.filter(
    (r) =>
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[128px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Home</span>
          </button>
          
          {/* Search */}
          <div className="relative max-w-md flex-1 mx-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search roadmaps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-all"
            />
          </div>

          <div className="w-20" />
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 rounded-full mb-4"
          >
            <Map className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-400">Learning Paths</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
          >
            Explore Roadmaps
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            Follow structured learning paths curated by experts
          </motion.p>
        </div>

        {/* Roadmaps Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-6 bg-[#111118] border border-white/5 rounded-2xl animate-pulse">
                <div className="h-6 bg-white/5 rounded mb-4 w-3/4" />
                <div className="h-4 bg-white/5 rounded mb-2 w-full" />
                <div className="h-4 bg-white/5 rounded mb-4 w-2/3" />
                <div className="h-10 bg-white/5 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : filteredRoadmaps.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-white/5 rounded-full flex items-center justify-center">
              <Map className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Roadmaps Found</h3>
            <p className="text-gray-500">
              {searchQuery ? "Try a different search term" : "Roadmaps are being crafted for you!"}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRoadmaps.map((roadmap, idx) => (
              <motion.div
                key={roadmap._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <button
                  onClick={() => router.push(`/explore/roadmap/${roadmap._id}`)}
                  className="w-full text-left p-6 bg-[#111118] border border-white/5 rounded-2xl hover:border-blue-500/30 hover:bg-[#111118]/80 transition-all duration-300 group"
                >
                  {/* Icon */}
                  <div className="w-12 h-12 mb-4 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl flex items-center justify-center">
                    <Map className="w-6 h-6 text-blue-400" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-1">
                    {roadmap.title}
                  </h3>

                  {/* Description */}
                  {roadmap.description && (
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                      {roadmap.description}
                    </p>
                  )}

                  {/* Author */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <User className="w-4 h-4" />
                      <span>{roadmap.createdBy}</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ExplorePage;
