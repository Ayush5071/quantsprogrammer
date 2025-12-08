"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Crown,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Zap,
  FileText,
  MessageSquare,
  Code,
  Trophy,
  Star,
  TrendingUp,
  Users,
  BadgeCheck,
  Flame
} from "lucide-react";

interface Pricing {
  oaQuestions: number;
  resumeScreeningPremium: number;
  topInterviews: number;
  mockInterviews: number;
}

export default function PremiumDeals() {
  const [pricing, setPricing] = useState<Pricing>({
    oaQuestions: 10,
    resumeScreeningPremium: 10,
    topInterviews: 10,
    mockInterviews: 10
  });

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const res = await fetch("/api/admin/pricing");
        if (res.ok) {
          const data = await res.json();
          if (data.pricing) {
            setPricing(data.pricing);
          }
        }
      } catch (error) {
        console.error("Failed to fetch pricing:", error);
      }
    };
    fetchPricing();
  }, []);

  const deals = [
    {
      id: "oa-questions",
      title: "Company Questions Pack",
      subtitle: "450+ OA Problems",
      price: pricing.oaQuestions,
      originalPrice: 99,
      icon: Code,
      gradient: "from-yellow-500 via-orange-500 to-red-500",
      bgGlow: "bg-yellow-500/20",
      borderColor: "border-yellow-500/30",
      features: [
        "450+ curated company questions",
        "Google, Amazon, Meta, Apple & more",
        "Frequency & acceptance data",
        "Lifetime access",
        "Regular updates"
      ],
      popular: true,
      link: "/company-problems"
    },
    {
      id: "mock-interviews",
      title: "AI Mock Interviews",
      subtitle: "Unlimited Practice",
      price: pricing.mockInterviews,
      originalPrice: 99,
      icon: MessageSquare,
      gradient: "from-blue-500 via-cyan-500 to-teal-500",
      bgGlow: "bg-blue-500/20",
      borderColor: "border-blue-500/30",
      features: [
        "Unlimited mock interviews",
        "AI-powered feedback",
        "Technical & behavioral rounds",
        "Real-time scoring",
        "Detailed improvement tips"
      ],
      popular: false,
      link: "/interview"
    },
    {
      id: "resume-screening",
      title: "AI Resume Screening",
      subtitle: "Get Noticed Faster",
      price: pricing.resumeScreeningPremium,
      originalPrice: 49,
      icon: FileText,
      gradient: "from-purple-500 via-violet-500 to-indigo-500",
      bgGlow: "bg-purple-500/20",
      borderColor: "border-purple-500/30",
      features: [
        "AI-powered resume analysis",
        "ATS compatibility check",
        "Keyword optimization",
        "Detailed feedback",
        "Improvement suggestions"
      ],
      popular: false,
      link: "/resume-screening"
    },
    {
      id: "coding-arena",
      title: "Coding Arena Access",
      subtitle: "Premium Contests",
      price: pricing.topInterviews,
      originalPrice: 49,
      icon: Trophy,
      gradient: "from-green-500 via-emerald-500 to-teal-500",
      bgGlow: "bg-green-500/20",
      borderColor: "border-green-500/30",
      features: [
        "Access to all premium contests",
        "Earn certifications",
        "Leaderboard ranking",
        "Detailed solutions",
        "Company-specific tests"
      ],
      popular: false,
      link: "/top-interviews"
    }
  ];

  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[#0a0a0f]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(139,92,246,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(59,130,246,0.08),transparent_50%)]" />
      
      {/* Animated Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-20"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 mb-6"
          >
            <Flame className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 text-sm font-medium">Limited Time Offers</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-white">Premium </span>
            <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              Deals
            </span>
          </h2>
          
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            Unlock your full potential with our premium features at unbeatable prices
          </p>
        </motion.div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {deals.map((deal, index) => (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`relative group rounded-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border ${deal.borderColor} p-6 lg:p-8 overflow-hidden`}
            >
              {/* Glow Effect */}
              <div className={`absolute inset-0 ${deal.bgGlow} opacity-0 group-hover:opacity-100 blur-3xl transition-opacity duration-500`} />
              
              {/* Popular Badge */}
              {deal.popular && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 z-20"
                >
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg shadow-orange-500/30">
                    <Star className="w-3 h-3 fill-current" />
                    POPULAR
                  </div>
                </motion.div>
              )}

              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${deal.gradient} p-3 mb-6 shadow-lg`}>
                  <deal.icon className="w-full h-full text-white" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-1">{deal.title}</h3>
                <p className="text-gray-400 text-sm mb-6">{deal.subtitle}</p>

                {/* Pricing */}
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-3xl font-bold text-white">₹{deal.price}</span>
                  <span className="text-gray-500 line-through text-sm">₹{deal.originalPrice}</span>
                  <span className="text-green-400 text-xs font-medium bg-green-500/10 px-2 py-1 rounded-full">
                    {Math.round((1 - deal.price / deal.originalPrice) * 100)}% OFF
                  </span>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {deal.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <a
                  href={deal.link}
                  className={`w-full py-3 px-4 rounded-xl bg-gradient-to-r ${deal.gradient} text-white font-semibold flex items-center justify-center gap-2 group-hover:shadow-lg transition-all duration-300 hover:opacity-90`}
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
        >
          {[
            { icon: Users, label: "Happy Users", value: "10,000+" },
            { icon: Trophy, label: "Success Rate", value: "95%" },
            { icon: BadgeCheck, label: "Certifications", value: "5,000+" },
            { icon: TrendingUp, label: "Avg. Improvement", value: "40%" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="text-center p-4 md:p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
            >
              <stat.icon className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-6 md:gap-8"
        >
          <div className="flex items-center gap-2 text-gray-400">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span className="text-sm">Instant Access</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Crown className="w-5 h-5 text-purple-400" />
            <span className="text-sm">Lifetime Updates</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <span className="text-sm">Premium Support</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <BadgeCheck className="w-5 h-5 text-green-400" />
            <span className="text-sm">Secure Payment</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
