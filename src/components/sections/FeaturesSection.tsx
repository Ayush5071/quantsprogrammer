import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface CommunityStats {
  activeUsers: number;
  totalInterviews: number;
  publishedBlogs: number;
  availableRoadmaps: number;
  certificatesEarned: number;
}

const platformFeatures = [
  {
    category: "Learning",
    features: [
      {
        title: "Interactive Roadmaps",
        description: "50+ structured learning paths",
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        gradient: "from-blue-400 to-blue-600",
        bgGradient: "from-blue-900/20 to-blue-700/20"
      },
      {
        title: "Progress Tracking",
        description: "Real-time progress analytics",
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        ),
        gradient: "from-blue-500 to-blue-700",
        bgGradient: "from-blue-800/20 to-blue-600/20"
      },
      {
        title: "Certificates",
        description: "Industry-recognized credentials",
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        ),
        gradient: "from-blue-600 to-blue-800",
        bgGradient: "from-blue-700/20 to-blue-500/20"
      }
    ]
  },
  {
    category: "Practice",
    features: [
      {
        title: "AI Interviews",
        description: "1000+ practice questions",
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        ),
        gradient: "from-blue-300 to-blue-500",
        bgGradient: "from-blue-600/20 to-blue-800/20"
      },
      {
        title: "Mock Tests",
        description: "Company-specific assessments",
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        ),
        gradient: "from-blue-500 to-blue-800",
        bgGradient: "from-blue-900/20 to-blue-700/20"
      },
      {
        title: "Code Reviews",
        description: "Expert feedback on solutions",
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        ),
        gradient: "from-blue-400 to-blue-700",
        bgGradient: "from-blue-800/20 to-blue-600/20"
      }
    ]
  },
  {
    category: "Career",
    features: [
      {
        title: "Salary Data",
        description: "500+ company insights",
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        gradient: "from-blue-600 to-blue-900",
        bgGradient: "from-blue-700/20 to-blue-500/20"
      },
      {
        title: "Job Placement",
        description: "Direct company connections",
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        ),
        gradient: "from-blue-300 to-blue-600",
        bgGradient: "from-blue-800/20 to-blue-600/20"
      },
      {
        title: "Portfolio Builder",
        description: "Showcase your projects",
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        ),
        gradient: "from-blue-500 to-blue-900",
        bgGradient: "from-blue-900/20 to-blue-700/20"
      }
    ]
  }
];

export default function FeaturesSection() {
  const [stats, setStats] = useState<CommunityStats>({
    activeUsers: 0,
    totalInterviews: 0,
    publishedBlogs: 0,
    availableRoadmaps: 0,
    certificatesEarned: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/community/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${Math.floor(num / 1000)}k+`;
    }
    return `${num}+`;
  };

  return (
    <section className="w-full py-20 px-4 md:px-8 flex flex-col items-center relative overflow-hidden">
      {/* Enhanced Background Effects - matching HeroPage/Footer style */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(236,72,153,0.05),transparent_70%)]"></div>
      
      {/* Animated Grid Pattern - matching HeroPage/Footer */}
      <div className="absolute inset-0 opacity-20">
        <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)]"></div>
      </div>

      <div className="w-full max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full text-sm text-zinc-300 mb-6"
          >
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span>Complete Developer Platform</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-extrabold text-white mb-6"
          >
            Everything You Need to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              Succeed
            </span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg md:text-xl text-zinc-300 max-w-3xl mx-auto font-medium leading-relaxed"
          >
            From learning fundamentals to landing your dream job—our comprehensive platform 
            provides all the tools and resources you need for your tech career journey.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {platformFeatures.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: categoryIndex * 0.2 }}
              className="space-y-6"
            >
              {/* Category Header */}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">{category.category}</h3>
                <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto"></div>
              </div>

              {/* Category Features */}
              <div className="space-y-4">
                {category.features.map((feature, featureIndex) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: categoryIndex % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: (categoryIndex * 0.2) + (featureIndex * 0.1) }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className={`group p-6 bg-gradient-to-br ${feature.bgGradient} backdrop-blur-lg border border-white/10 rounded-2xl hover:border-white/20 transition-all duration-500 shadow-xl cursor-pointer`}
                  >
                    {/* Icon */}
                    <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient}/20 border border-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <div className={`text-transparent bg-clip-text bg-gradient-to-r ${feature.gradient}`}>
                        {feature.icon}
                      </div>
                    </div>

                    {/* Content */}
                    <h4 className="text-lg font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-blue-200 transition-all duration-300">
                      {feature.title}
                    </h4>
                    
                    <p className="text-zinc-400 text-sm leading-relaxed group-hover:text-zinc-300 transition-colors duration-300">
                      {feature.description}
                    </p>

                    {/* Hover Arrow */}
                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20 p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { key: 'activeUsers', label: "Active Learners", icon: "👥" },
              { key: 'certificatesEarned', label: "Certificates Earned", icon: "🎯" },
              { key: 'availableRoadmaps', label: "Learning Roadmaps", icon: "🏢" },
              { key: 'totalInterviews', label: "Mock Interviews", icon: "💬" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                className="text-center group hover:scale-105 transition-transform duration-300"
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2 group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-300">
                  {loading ? "..." : formatNumber(stats[stat.key as keyof CommunityStats])}
                </div>
                <div className="text-sm text-zinc-400 font-medium group-hover:text-zinc-300 transition-colors duration-300">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
