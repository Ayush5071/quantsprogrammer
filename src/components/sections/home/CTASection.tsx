"use client";
import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CTASection() {
  const router = useRouter();

  return (
    <section className="w-full py-24 px-4 bg-[#0a0a0f]">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative p-8 sm:p-12 rounded-3xl overflow-hidden"
        >
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-indigo-600/10 to-purple-600/20" />
          <div className="absolute inset-0 bg-[#111118]/80 backdrop-blur-sm" />
          
          {/* Border */}
          <div className="absolute inset-0 rounded-3xl border border-white/10" />

          {/* Floating Orbs */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          {/* Content */}
          <div className="relative text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-gray-300">100% Free Platform</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Ready to Level Up?
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto mb-8">
              Join thousands of developers who are already using PrepSutra to ace their interviews.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => router.push("/auth/signup")}
                className="w-full sm:w-auto group flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-500/25"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => router.push("/explore")}
                className="w-full sm:w-auto px-8 py-4 bg-white/5 text-white font-medium rounded-xl border border-white/10 hover:bg-white/10 transition-all"
              >
                Explore Roadmaps
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
