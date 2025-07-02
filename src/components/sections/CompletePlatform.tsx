import React from "react";
import { motion } from "framer-motion";

const platformModules = [
  {
    title: "Interactive Roadmaps",
    description: "50+ expert-crafted learning paths for every tech stack",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    features: ["Step-by-step guides", "Progress tracking", "Skill validation", "Industry standards"],
    gradient: "from-blue-400 to-blue-600",
    bgGradient: "from-blue-900/20 to-blue-700/20"
  },
  {
    title: "AI Mock Interviews",
    description: "Practice with Google's Gemini AI for realistic interview prep",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    features: ["Voice & text input", "Instant feedback", "Performance scoring", "Company-specific prep"],
    gradient: "from-blue-500 to-blue-700",
    bgGradient: "from-blue-800/20 to-blue-600/20"
  },
  {
    title: "Blog Publishing",
    description: "Share knowledge with a Medium-like writing experience",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
      </svg>
    ),
    features: ["Rich text editor", "Image uploads", "Admin approval", "Community engagement"],
    gradient: "from-blue-600 to-blue-800",
    bgGradient: "from-blue-700/20 to-blue-500/20"
  },
  {
    title: "Career Analytics",
    description: "Comprehensive salary data and company insights",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    features: ["500+ companies", "Salary benchmarks", "Market trends", "Role comparisons"],
    gradient: "from-blue-300 to-blue-500",
    bgGradient: "from-blue-600/20 to-blue-800/20"
  },
  {
    title: "Digital Certificates",
    description: "Professional certificates for completed roadmaps",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    features: ["Instant generation", "High-resolution downloads", "LinkedIn sharing", "Portfolio ready"],
    gradient: "from-blue-400 to-blue-700",
    bgGradient: "from-blue-800/20 to-blue-600/20"
  },
  {
    title: "Progress Analytics",
    description: "Comprehensive tracking of your learning journey",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    features: ["Real-time tracking", "Detailed analytics", "Performance insights", "Goal setting"],
    gradient: "from-blue-500 to-blue-900",
    bgGradient: "from-blue-900/20 to-blue-700/20"
  }
];

const stats = [
  { number: "50+", label: "Learning Roadmaps" },
  { number: "1000+", label: "Practice Questions" },
  { number: "500+", label: "Company Insights" },
  { number: "10k+", label: "Active Developers" }
];

export default function CompletePlatform() {
  return (
    <section className="w-full py-20 px-4 md:px-8 relative overflow-hidden">
      {/* Enhanced Background Effects - matching main page style */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-900 to-black"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(37,99,235,0.12),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(29,78,216,0.08),transparent_70%)]"></div>
      
      {/* Animated Grid Pattern - matching main page */}
      <div className="absolute inset-0 opacity-20">
        <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)]"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent mb-6"
          >
            Complete Development Platform
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-zinc-300 max-w-3xl mx-auto font-medium"
          >
            Everything you need to accelerate your developer journey - from learning roadmaps to AI interviews, 
            career insights to professional certificates. All in one unified platform.
          </motion.p>
        </div>

        {/* Stats Row */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 mb-2">
                {stat.number}
              </div>
              <div className="text-zinc-400 text-sm md:text-base font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Platform Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {platformModules.map((module, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full bg-white/5 backdrop-blur-lg border border-white/10 hover:border-white/20 rounded-2xl p-8 transition-all duration-500 hover:scale-105 shadow-lg hover:shadow-blue-500/25">
                {/* Icon and Title */}
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${module.gradient} text-white group-hover:scale-110 transition-transform duration-300`}>
                    {module.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-blue-600 transition-all duration-300">
                      {module.title}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-zinc-300 text-base leading-relaxed mb-6 group-hover:text-zinc-200 transition-colors duration-300">
                  {module.description}
                </p>

                {/* Features List */}
                <ul className="space-y-2">
                  {module.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3 text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors duration-300">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0"></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-20"
        >
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-12 max-w-4xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Career?
            </h3>
            <p className="text-lg text-zinc-300 mb-8 max-w-2xl mx-auto">
              Join thousands of developers who are already using our platform to land their dream jobs, 
              master new technologies, and build successful careers in tech.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.location.href = '/explore'}
                className="px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold text-lg rounded-xl hover:from-blue-700 hover:to-blue-900 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Start Learning Now
              </button>
              <button 
                onClick={() => window.location.href = '/interview'}
                className="px-10 py-4 border-2 border-blue-500 text-blue-400 font-bold text-lg rounded-xl hover:bg-blue-500/10 transition-all duration-200"
              >
                Try AI Interview
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
