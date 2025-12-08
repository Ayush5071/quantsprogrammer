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
  Code,
  BookOpen,
  Target,
  Zap,
  CheckCircle,
  ArrowRight,
  Sparkles,
  FileSearch,
  GitBranch,
  Users,
  Briefcase,
  Star,
  TrendingUp,
} from "lucide-react";

export default function AboutPage() {
  const router = useRouter();

  // Main platform features - Flowchart
  const platformFeatures = [
    {
      category: "Learning & Growth",
      color: "from-blue-500 to-cyan-500",
      borderColor: "border-blue-500/30",
      bgColor: "bg-blue-500/10",
      items: [
        {
          icon: Map,
          title: "Roadmaps",
          description: "Curated learning paths with YouTube tutorials",
          link: "/explore",
        },
        {
          icon: BookOpen,
          title: "Core CS Topics",
          description: "OS, DBMS, CN, and essential fundamentals",
          link: "/explore",
        },
        {
          icon: Award,
          title: "Certifications",
          description: "Earn certificates after completing roadmaps",
          link: "/explore",
        },
      ],
    },
    {
      category: "Interview Prep",
      color: "from-purple-500 to-pink-500",
      borderColor: "border-purple-500/30",
      bgColor: "bg-purple-500/10",
      items: [
        {
          icon: Mic,
          title: "AI Mock Interviews",
          description: "Practice with AI-powered feedback",
          link: "/interview",
        },
        {
          icon: Trophy,
          title: "Coding Arena",
          description: "Compete in coding challenges with leaderboards",
          link: "/top-interviews",
        },
        {
          icon: Briefcase,
          title: "Company Problems",
          description: "450+ company-specific DSA questions",
          link: "/company-problems",
        },
      ],
    },
    {
      category: "Career Tools",
      color: "from-green-500 to-emerald-500",
      borderColor: "border-green-500/30",
      bgColor: "bg-green-500/10",
      items: [
        {
          icon: FileText,
          title: "Resume Builder",
          description: "Create ATS-friendly professional resumes",
          link: "/resume-builder",
        },
        {
          icon: FileSearch,
          title: "AI Resume Screening",
          description: "Get AI feedback on your resume",
          link: "/resume-screening",
        },
        {
          icon: TrendingUp,
          title: "Placement Data",
          description: "Real compensation insights from top companies",
          link: "/placement-data",
        },
      ],
    },
    {
      category: "Developer Stats",
      color: "from-orange-500 to-yellow-500",
      borderColor: "border-orange-500/30",
      bgColor: "bg-orange-500/10",
      items: [
        {
          icon: GitBranch,
          title: "GitHub Wrapped",
          description: "Visualize your GitHub journey with AI insights",
          link: "/github-wrapped",
        },
        {
          icon: Code,
          title: "Codeforces Wrapped",
          description: "Track your competitive programming stats",
          link: "/codeforces-wrapped",
        },
        {
          icon: Target,
          title: "LeetCode Wrapped",
          description: "Analyze your problem-solving journey",
          link: "/leetcode-wrapped",
        },
      ],
    },
  ];

  // User journey steps
  const journeySteps = [
    {
      step: 1,
      icon: Users,
      title: "Sign Up",
      description: "Create your free account",
      color: "from-blue-500 to-cyan-500",
    },
    {
      step: 2,
      icon: Map,
      title: "Choose a Roadmap",
      description: "Pick your learning path",
      color: "from-purple-500 to-pink-500",
    },
    {
      step: 3,
      icon: CheckCircle,
      title: "Complete Topics",
      description: "Learn & mark progress",
      color: "from-green-500 to-emerald-500",
    },
    {
      step: 4,
      icon: FileText,
      title: "Take the Test",
      description: "40 questions, 30 mins",
      color: "from-yellow-500 to-orange-500",
    },
    {
      step: 5,
      icon: Award,
      title: "Earn Certificate",
      description: "Showcase on profile",
      color: "from-pink-500 to-red-500",
    },
  ];

  // Premium features
  const premiumFeatures = [
    {
      icon: Briefcase,
      title: "450+ Company Questions",
      description: "OA questions from Google, Amazon, Meta, and more",
      price: "₹10",
      originalPrice: "₹99",
      link: "/company-problems",
      highlight: true,
    },
    {
      icon: Mic,
      title: "Unlimited Mock Interviews",
      description: "Premium subscription for unlimited AI interviews",
      price: "₹99/month",
      link: "/interview",
      highlight: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px]" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-green-600/10 rounded-full blur-[100px]" />
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
          <h1 className="text-white font-semibold">About Platform</h1>
          <div className="w-16" />
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-300">All Features</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            Everything You Need to
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Ace Your Tech Career
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            A complete platform for learning, practicing, and showcasing your
            skills — mostly free, with premium add-ons.
          </p>
        </motion.section>

        {/* Features Flowchart */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Platform Features
            </h2>
            <p className="text-gray-400">
              Explore all the tools available to accelerate your growth
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {platformFeatures.map((category, catIndex) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: catIndex * 0.1 }}
                className={`p-6 rounded-3xl border ${category.borderColor} ${category.bgColor}`}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center`}
                  >
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {category.category}
                  </h3>
                </div>

                <div className="space-y-4">
                  {category.items.map((item, itemIndex) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: catIndex * 0.1 + itemIndex * 0.05 }}
                      onClick={() => router.push(item.link)}
                      className="flex items-start gap-4 p-4 bg-[#0a0a0f]/50 rounded-xl border border-white/5 hover:border-white/20 cursor-pointer transition-all group"
                    >
                      <div
                        className={`w-10 h-10 rounded-lg bg-gradient-to-br ${category.color} p-0.5 flex-shrink-0`}
                      >
                        <div className="w-full h-full bg-[#0a0a0f] rounded-[6px] flex items-center justify-center">
                          <item.icon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-semibold mb-1 group-hover:text-blue-400 transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-gray-500 text-sm">
                          {item.description}
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* User Journey Flow */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Your Learning Journey
            </h2>
            <p className="text-gray-400">
              From signup to certification in 5 simple steps
            </p>
          </motion.div>

          {/* Desktop Flow */}
          <div className="hidden lg:block relative">
            <div className="flex justify-between items-start">
              {journeySteps.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col items-center text-center w-1/5 relative"
                >
                  {/* Step Number */}
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 shadow-lg`}
                  >
                    <step.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Connector Arrow */}
                  {index < journeySteps.length - 1 && (
                    <div className="absolute top-8 left-[60%] w-[80%] flex items-center">
                      <div className="flex-1 h-0.5 bg-gradient-to-r from-white/30 to-white/10" />
                      <ArrowRight className="w-5 h-5 text-white/30" />
                    </div>
                  )}

                  <div className="text-xs text-gray-500 mb-1">
                    Step {step.step}
                  </div>
                  <h4 className="text-white font-semibold mb-1">
                    {step.title}
                  </h4>
                  <p className="text-gray-500 text-sm">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile Flow */}
          <div className="lg:hidden space-y-4">
            {journeySteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4"
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center`}
                  >
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  {index < journeySteps.length - 1 && (
                    <div className="w-0.5 flex-1 bg-gradient-to-b from-white/30 to-transparent mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-6">
                  <div className="text-xs text-gray-500 mb-1">
                    Step {step.step}
                  </div>
                  <h4 className="text-white font-semibold">{step.title}</h4>
                  <p className="text-gray-500 text-sm">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Certification Details */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="p-8 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-3xl">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-yellow-500/20 rounded-xl">
                <Award className="w-8 h-8 text-yellow-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Certification Test Details
                </h2>
                <p className="text-gray-400">
                  Complete a roadmap to unlock your certification exam
                </p>
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
              Your certificate and percentage will be displayed on your profile
            </p>
          </div>
        </motion.section>

        {/* Premium Features */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-full mb-4">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-yellow-400">Premium Features</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Unlock More Value
            </h2>
            <p className="text-gray-400">
              Affordable premium add-ons to boost your preparation
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {premiumFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => router.push(feature.link)}
                className={`relative p-6 rounded-2xl border cursor-pointer transition-all hover:scale-[1.02] ${
                  feature.highlight
                    ? "bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30"
                    : "bg-[#111118] border-white/10 hover:border-white/20"
                }`}
              >
                {feature.highlight && (
                  <div className="absolute -top-3 left-6 px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-xs font-bold text-black">
                    BEST VALUE
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      feature.highlight
                        ? "bg-yellow-500/20"
                        : "bg-purple-500/20"
                    }`}
                  >
                    <feature.icon
                      className={`w-6 h-6 ${
                        feature.highlight ? "text-yellow-400" : "text-purple-400"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      {feature.description}
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-white">
                        {feature.price}
                      </span>
                      {feature.originalPrice && (
                        <span className="text-gray-500 line-through">
                          {feature.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-500" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* YouTube Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="p-8 bg-[#111118] border border-white/5 rounded-3xl text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-red-500/10 rounded-full flex items-center justify-center">
              <Youtube className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Learn with Video Tutorials
            </h2>
            <p className="text-gray-400 mb-6">
              Our roadmaps include curated YouTube tutorials to help you learn
              effectively
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
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start?
          </h2>
          <p className="text-gray-400 mb-8">
            Begin your learning journey today — it&apos;s mostly free!
          </p>
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
