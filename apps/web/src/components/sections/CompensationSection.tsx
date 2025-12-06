import React from "react";
import { motion } from "framer-motion";
import { IconTrendingUp, IconSearch, IconFilter, IconBuilding, IconCoin } from "@tabler/icons-react";

const featuredCompanies = [
  { name: "Google", role: "Software Engineer", package: "₹45-65 LPA", growth: "+12%" },
  { name: "Microsoft", role: "SDE II", package: "₹38-55 LPA", growth: "+8%" },
  { name: "Amazon", role: "SDE I", package: "₹32-48 LPA", growth: "+15%" },
  { name: "Meta", role: "Software Engineer", package: "₹50-70 LPA", growth: "+10%" },
];

export default function CompensationSection() {
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
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Real-time Market Data</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-extrabold text-white mb-6"
          >
            Compensation{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-400 to-purple-400">
              Intelligence
            </span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg md:text-xl text-zinc-300 max-w-3xl mx-auto font-medium leading-relaxed"
          >
            Discover salary trends, company packages, and compensation data from 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 font-semibold"> 500+ tech companies</span> for 2024-25. 
            Make informed career decisions with real market data.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Left: Features */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-3 space-y-6"
          >
            {[
              {
                icon: <IconSearch className="w-8 h-8" />,
                title: "Smart Search & Filters",
                description: "Find compensation data by company, role, experience level, or location with intelligent search and advanced filtering options",
                gradient: "from-blue-500 to-cyan-500",
                bgColor: "from-blue-900/20 to-cyan-900/20"
              },
              {
                icon: <IconTrendingUp className="w-8 h-8" />,
                title: "Market Trends & Analytics",
                description: "Track salary growth patterns, market trends, and compensation changes across different tech stacks and company sizes",
                gradient: "from-green-500 to-emerald-500",
                bgColor: "from-green-900/20 to-emerald-900/20"
              },
              {
                icon: <IconBuilding className="w-8 h-8" />,
                title: "Company Deep Insights",
                description: "Detailed breakdown of offers, benefits, stock options, work-life balance, and culture insights from employee reviews",
                gradient: "from-purple-500 to-pink-500",
                bgColor: "from-purple-900/20 to-pink-900/20"
              },
              {
                icon: <IconFilter className="w-8 h-8" />,
                title: "Personalized Recommendations",
                description: "Get personalized salary recommendations based on your skills, experience, and career goals with AI-powered insights",
                gradient: "from-orange-500 to-red-500",
                bgColor: "from-orange-900/20 to-red-900/20"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`group p-6 bg-gradient-to-br ${feature.bgColor} backdrop-blur-lg border border-white/10 rounded-2xl hover:border-white/20 transition-all duration-500 hover:scale-[1.02] shadow-xl`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 bg-gradient-to-br ${feature.gradient}/20 border border-white/20 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                    <div className={`text-transparent bg-clip-text bg-gradient-to-r ${feature.gradient}`}>
                      {feature.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-blue-200 transition-all duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-zinc-300 leading-relaxed group-hover:text-zinc-200 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="pt-4"
            >
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/placement-data'}
                className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-green-500/25 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <IconCoin className="w-5 h-5" />
                Explore Compensation Data
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right: Featured Companies */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-2"
          >
            <div className="p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl sticky top-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <IconCoin className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Live Market Data</h3>
              </div>
              
              <div className="space-y-4 mb-6">
                {featuredCompanies.map((company, index) => (
                  <motion.div
                    key={company.name}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          {company.name.charAt(0)}
                        </div>
                        <h4 className="font-bold text-white group-hover:text-green-400 transition-colors duration-300">
                          {company.name}
                        </h4>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full font-bold ${
                        parseFloat(company.growth.replace('%', '').replace('+', '')) >= 10 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}>
                        {company.growth}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-400 mb-2">{company.role}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
                        {company.package}
                      </p>
                      <p className="text-xs text-zinc-500">Total CTC</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { number: "500+", label: "Companies" },
                  { number: "1.5K+", label: "Offers" },
                  { number: "Weekly", label: "Updates" }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    className="text-center p-3 bg-white/5 border border-white/10 rounded-lg"
                  >
                    <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
                      {stat.number}
                    </div>
                    <div className="text-xs text-zinc-400">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Trust Badge */}
              <div className="p-4 bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-500/20 rounded-lg text-center">
                <p className="text-sm text-zinc-300">
                  <span className="text-green-400 font-semibold">Verified</span> by HR teams • 
                  <span className="text-blue-400 font-semibold"> Real</span> offer letters
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
