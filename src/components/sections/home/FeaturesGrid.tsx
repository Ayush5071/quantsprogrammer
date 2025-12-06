"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Map, Mic, BarChart3, PenLine, Award, ArrowRight, FileText } from "lucide-react";

const features = [
  {
    icon: Map,
    title: "Roadmaps",
    description: "Structured learning paths for every tech stack",
    link: "/explore",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Mic,
    title: "AI Interview",
    description: "Practice with real-time AI feedback",
    link: "/interview",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: BarChart3,
    title: "Salary Data",
    description: "Compensation insights from top companies",
    link: "/placement-data",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: PenLine,
    title: "Blog Platform",
    description: "Write and publish technical content",
    link: "/blogs",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Award,
    title: "Certificates",
    description: "Earn credentials for completed roadmaps",
    link: "/profile",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: FileText,
    title: "Resume Builder",
    description: "Create ATS-friendly resumes easily",
    link: "/resume-builder",
    color: "from-indigo-500 to-violet-500",
  },
];

export default function FeaturesGrid() {
  const router = useRouter();

  return (
    <section className="w-full py-24 px-4 bg-[#0a0a0f]">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Everything You Need
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            A complete platform for learning, practicing, and advancing your tech career
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature) => (
            <button
              key={feature.title}
              onClick={() => router.push(feature.link)}
              className="group relative p-6 bg-[#111118] border border-white/5 rounded-2xl text-left hover:border-white/10 transition-all duration-300"
            >
              {/* Icon */}
              <div className={`w-12 h-12 mb-4 rounded-xl bg-gradient-to-br ${feature.color} p-0.5`}>
                <div className="w-full h-full bg-[#111118] rounded-[10px] flex items-center justify-center">
                  <feature.icon className={`w-6 h-6 bg-gradient-to-br ${feature.color} [&>*]:stroke-white`} style={{ color: 'white' }} />
                </div>
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-500 text-sm mb-4">{feature.description}</p>

              {/* Arrow */}
              <div className="flex items-center gap-1 text-sm text-gray-500 group-hover:text-blue-400 transition-colors">
                <span>Explore</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
          
          {/* CTA Card */}
          <div className="p-6 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/20 rounded-2xl flex flex-col justify-center">
            <h3 className="text-lg font-semibold text-white mb-2">Ready to start?</h3>
            <p className="text-gray-400 text-sm mb-4">Begin your journey today—it's free.</p>
            <button
              onClick={() => router.push("/auth/signup")}
              className="w-fit px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-blue-500 hover:to-indigo-500 transition-all"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
