"use client";
import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Code2, Boxes, Cpu, Globe, Database, Lock, FileText } from "lucide-react";

const topics = [
  { icon: Code2, label: "Company Problems", path: "/company-problems" },
  { icon: Boxes, label: "System Design", path: "/prepare-interviews" },
  { icon: Cpu, label: "OS", path: "/prepare-interviews/operating-systems" },
  { icon: Globe, label: "Web Dev", path: "/explore" },
  { icon: Database, label: "DBMS", path: "/prepare-interviews" },
  { icon: Lock, label: "Security", path: "/prepare-interviews" },
  { icon: FileText, label: "ATS Checker", path: "/ats-checker" },
];

export default function PrepareSection() {
  const router = useRouter();

  return (
    <section className="w-full py-24 px-4 bg-[#08080c]">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div>
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-3 py-1 text-xs font-medium bg-purple-500/10 text-purple-400 rounded-full mb-4"
            >
              Interview Prep
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
            >
              Ace Your Next Interview
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 text-lg mb-8"
            >
              Practice with AI-powered mock interviews. Get real-time feedback on your answers.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-3"
            >
              <button
                onClick={() => router.push("/interview")}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all"
              >
                Start Practice
              </button>
              <button
                onClick={() => router.push("/top-interviews")}
                className="px-6 py-3 bg-white/5 text-white font-medium rounded-lg border border-white/10 hover:bg-white/10 transition-all"
              >
                Coding Arena
              </button>
            </motion.div>
          </div>

          {/* Right: Topics Grid */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-3"
          >
            {topics.map((topic, index) => (
              <button
                key={topic.label}
                onClick={() => router.push(topic.path)}
                className="group flex flex-col items-center gap-3 p-5 bg-[#111118] border border-white/5 rounded-xl hover:border-purple-500/30 hover:bg-purple-500/5 transition-all"
              >
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <topic.icon className="w-6 h-6 text-purple-400" />
                </div>
                <span className="text-white font-medium text-sm group-hover:text-purple-300 transition-colors">
                  {topic.label}
                </span>
              </button>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
