import React from "react";
import { motion } from "framer-motion";

const platforms = [
  {
    title: "Learning Hub",
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    features: ["Interactive Roadmaps", "Progress Tracking", "Task Management", "Resource Links"],
    description: "Structured learning paths for every tech stack",
    color: "from-blue-600 to-cyan-600",
    bgColor: "from-blue-900/20 to-cyan-900/20",
    link: "/explore"
  },
  {
    title: "Interview Center",
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75-7.478a12.06 12.06 0 00-4.5 0m8.25 2.25h.008v.008H21V13.5h-.75m-15.75 0h-.008v.008H3V13.5h.75m15.75 0V9.75a3 3 0 00-3-3h-12a3 3 0 00-3 3v3.75m15.75 0v5.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3v-5.25" />
      </svg>
    ),
    features: ["AI Mock Interviews", "Voice Recognition", "Real-time Feedback", "Performance Analytics"],
    description: "AI-powered interview practice with instant feedback",
    color: "from-purple-600 to-pink-600",
    bgColor: "from-purple-900/20 to-pink-900/20",
    link: "/interview"
  },
  {
    title: "Content Studio",
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
    ),
    features: ["Blog Publishing", "Rich Text Editor", "Admin Approval", "Portfolio Building"],
    description: "Write and publish technical content",
    color: "from-green-600 to-teal-600",
    bgColor: "from-green-900/20 to-teal-900/20",
    link: "/blogs"
  },
  {
    title: "Achievement System",
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.228V2.721m-2.48 5.228a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
      </svg>
    ),
    features: ["Digital Certificates", "Leaderboards", "Progress Badges", "Skill Recognition"],
    description: "Track achievements and showcase your growth",
    color: "from-yellow-600 to-orange-600",
    bgColor: "from-yellow-900/20 to-orange-900/20",
    link: "/profile"
  },
];

export default function PlatformOverview() {
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
            <span>Integrated Learning Ecosystem</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-extrabold text-white mb-6"
          >
            Complete Developer{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              Platform
            </span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg md:text-xl text-zinc-300 max-w-3xl mx-auto font-medium leading-relaxed"
          >
            Four integrated modules working together to accelerate your developer journey with 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-semibold"> seamless synchronization</span>.
          </motion.p>
        </div>

        {/* Platform Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {platforms.map((platform, index) => (
            <motion.div
              key={platform.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className={`group relative p-8 bg-gradient-to-br ${platform.bgColor} backdrop-blur-lg border border-white/10 rounded-2xl hover:border-white/20 transition-all duration-500 shadow-xl cursor-pointer`}
              onClick={() => window.location.href = platform.link}
            >
              {/* Background Gradient Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${platform.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`} />
              
              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start gap-6 mb-6">
                  <div className={`p-4 bg-gradient-to-br ${platform.color}/20 border border-white/20 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                    <div className={`text-transparent bg-clip-text bg-gradient-to-r ${platform.color}`}>
                      {platform.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-blue-200 transition-all duration-300">
                      {platform.title}
                    </h3>
                    <p className="text-zinc-300 text-base md:text-lg leading-relaxed group-hover:text-zinc-200 transition-colors duration-300">
                      {platform.description}
                    </p>
                  </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {platform.features.map((feature, idx) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: (index * 0.1) + (idx * 0.05) }}
                      className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300"
                    >
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${platform.color} flex-shrink-0`} />
                      <span className="text-sm font-medium text-zinc-200 group-hover:text-zinc-100 transition-colors duration-300">
                        {feature}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Action Button */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full"
                >
                  <button 
                    className={`w-full py-4 px-6 bg-gradient-to-r ${platform.color} text-white font-bold rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2`}
                  >
                    Explore {platform.title}
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Integration Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center"
        >
          <div className="p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Seamlessly Integrated{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Experience
              </span>
            </h3>
            <p className="text-lg text-zinc-300 leading-relaxed">
              Your progress across roadmaps influences interview questions. Blog writing improves communication skills tracked in interviews.
              <br className="hidden md:block" />
              Certificates showcase completed roadmaps. Everything works together to create a 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-semibold"> comprehensive learning ecosystem</span>.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
