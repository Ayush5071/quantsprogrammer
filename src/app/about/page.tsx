"use client";
import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Map, 
  Youtube, 
  FileText, 
  Shield, 
  Award, 
  Clock, 
  HelpCircle,
  Mic,
  Trophy,
  Lock,
  Code,
  BookOpen,
  Target,
  Zap,
  CheckCircle,
  ArrowRight
} from "lucide-react";

export default function AboutPage() {
  const router = useRouter();

  const steps = [
    {
      icon: Map,
      title: "Explore Roadmaps",
      description: "Start with curated learning paths with YouTube tutorials",
      color: "from-blue-500 to-cyan-500",
      link: "/explore"
    },
    {
      icon: CheckCircle,
      title: "Complete Topics",
      description: "Mark topics as done and track your progress",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Award,
      title: "Take Certification Test",
      description: "30 min test • 40 questions • 100 marks • One attempt only",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: Trophy,
      title: "Earn Certificate",
      description: "Certificate with score shown on your profile",
      color: "from-purple-500 to-pink-500",
    },
  ];

  const features = [
    {
      icon: Mic,
      title: "AI Mock Interview",
      description: "Fully customizable practice interviews with AI feedback",
      color: "text-blue-400",
    },
    {
      icon: Trophy,
      title: "Coding Arena",
      description: "Admin-created challenges with leaderboards and podium for top 3",
      color: "text-yellow-400",
    },
    {
      icon: FileText,
      title: "Verified Blogs",
      description: "Only admin-approved members can publish quality content",
      color: "text-green-400",
    },
    {
      icon: Lock,
      title: "Secure Auth",
      description: "Protected authentication system for your data",
      color: "text-purple-400",
    },
    {
      icon: Code,
      title: "DSA Questions",
      description: "Company-specific coding problems and OA questions",
      color: "text-pink-400",
    },
    {
      icon: BookOpen,
      title: "Core Topics",
      description: "OS, DBMS, CN, and more essential CS fundamentals",
      color: "text-cyan-400",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px]" />
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
          <h1 className="text-white font-semibold">About</h1>
          <div className="w-16" />
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full mb-6">
            <Zap className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-400">How it Works</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            Your Path to
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Success
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            A complete platform for learning, practicing, and certifying your skills — all for free.
          </p>
        </motion.section>

        {/* Journey Flow - with Curved Arrows */}
        <section className="mb-24">
          <div className="relative">
            {/* Desktop Flow */}
            <div className="hidden lg:grid grid-cols-4 gap-4">
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  {/* Card */}
                  <div className="p-6 bg-[#111118] border border-white/5 rounded-2xl h-full">
                    <div className={`w-12 h-12 mb-4 rounded-xl bg-gradient-to-br ${step.color} p-0.5`}>
                      <div className="w-full h-full bg-[#111118] rounded-[10px] flex items-center justify-center">
                        <step.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mb-2">Step {index + 1}</div>
                    <h3 className="text-white font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-500 text-sm">{step.description}</p>
                    {step.link && (
                      <button
                        onClick={() => router.push(step.link)}
                        className="mt-4 text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                      >
                        Get Started <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  {/* Arrow to next */}
                  {index < steps.length - 1 && (
                    <div className="absolute -right-6 top-1/2 -translate-y-1/2 text-blue-500/50 z-10">
                      <ArrowRight className="w-8 h-8" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Mobile Flow */}
            <div className="lg:hidden space-y-4">
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex gap-4">
                    {/* Step indicator */}
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center`}>
                        <step.icon className="w-5 h-5 text-white" />
                      </div>
                      {index < steps.length - 1 && (
                        <div className="w-0.5 flex-1 bg-gradient-to-b from-blue-500/50 to-transparent mt-2" />
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 pb-8">
                      <div className="text-xs text-gray-500 mb-1">Step {index + 1}</div>
                      <h3 className="text-white font-semibold mb-1">{step.title}</h3>
                      <p className="text-gray-500 text-sm">{step.description}</p>
                      {step.link && (
                        <button
                          onClick={() => router.push(step.link)}
                          className="mt-2 text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                        >
                          Get Started <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Certification Details */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="p-8 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-3xl">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-yellow-500/20 rounded-xl">
                <Award className="w-8 h-8 text-yellow-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Certification Test</h2>
                <p className="text-gray-400">Complete a roadmap to unlock your certification exam</p>
              </div>
            </div>
            
            <div className="grid sm:grid-cols-4 gap-4">
              <div className="p-4 bg-white/5 rounded-xl text-center">
                <Clock className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">30</div>
                <div className="text-sm text-gray-500">Minutes</div>
              </div>
              <div className="p-4 bg-white/5 rounded-xl text-center">
                <HelpCircle className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">40</div>
                <div className="text-sm text-gray-500">Questions</div>
              </div>
              <div className="p-4 bg-white/5 rounded-xl text-center">
                <Target className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">100</div>
                <div className="text-sm text-gray-500">Total Marks</div>
              </div>
              <div className="p-4 bg-white/5 rounded-xl text-center">
                <Shield className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">1</div>
                <div className="text-sm text-gray-500">Attempt Only</div>
              </div>
            </div>

            <p className="mt-6 text-sm text-gray-400 text-center">
              Your certificate and percentage will be displayed on your profile section
            </p>
          </div>
        </motion.section>

        {/* Features Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Everything in One Place</h2>
            <p className="text-gray-400">All the tools you need to ace your tech career</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="p-6 bg-[#111118] border border-white/5 rounded-2xl hover:border-white/10 transition-all"
              >
                <feature.icon className={`w-8 h-8 ${feature.color} mb-4`} />
                <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Top Interview Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="p-8 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-3xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Trophy className="w-8 h-8 text-yellow-400" />
                  <h2 className="text-2xl font-bold text-white">Coding Arena</h2>
                </div>
                <p className="text-gray-400 mb-4">
                  Compete in admin-created interview challenges. Top 3 performers get featured on the podium!
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-black">1</div>
                    <span className="text-yellow-400">Gold</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-xs font-bold text-black">2</div>
                    <span className="text-gray-400">Silver</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-xs font-bold text-white">3</div>
                    <span className="text-orange-400">Bronze</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => router.push("/top-interviews")}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all whitespace-nowrap"
              >
                View Leaderboard
              </button>
            </div>
          </div>
        </motion.section>

        {/* YouTube Channel CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="p-8 bg-[#111118] border border-white/5 rounded-3xl text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-red-500/10 rounded-full flex items-center justify-center">
              <Youtube className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Learn with Video Tutorials</h2>
            <p className="text-gray-400 mb-6">
              Our roadmaps include curated YouTube tutorials to help you learn effectively
            </p>
            <a
              href="https://www.youtube.com/@QuantsProgrammer"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-500 transition-all"
            >
              <Youtube className="w-5 h-5" />
              Subscribe to Channel
            </a>
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start?</h2>
          <p className="text-gray-400 mb-8">Begin your learning journey today — it's completely free!</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => router.push("/explore")}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all"
            >
              Explore Roadmaps
            </button>
            <button
              onClick={() => router.push("/interview")}
              className="px-8 py-4 bg-white/5 text-white font-medium rounded-xl border border-white/10 hover:bg-white/10 transition-all"
            >
              Practice Interview
            </button>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
