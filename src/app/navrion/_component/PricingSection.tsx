"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Star,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Users,
  Trophy,
  BadgeCheck,
  TrendingUp,
  Zap,
  Crown,
} from "lucide-react";
import NavrionSectionWrapper from "./NavrionSectionWrapper";

type Deal = {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  icon: React.ElementType;
  gradient: string;
  bgGlow: string;
  borderColor: string;
  features: string[];
  popular?: boolean;
  link: string;
};

const deals: Deal[] = [
  {
    id: "basic-website",
    title: "Basic Web Starter",
    subtitle: "Ideal for Personal Portfolios",
    price: 2499,
    icon: Star,
    gradient: "from-pink-500 via-purple-500 to-pink-400",
    bgGlow: "bg-pink-500/20",
    borderColor: "border-pink-500/30",
    features: [
      "1–2 page static website",
      "Modern, clean UI",
      "Mobile responsive layout",
      "Basic contact section or links",
      "Perfect for portfolios & intro pages",
    ],
    popular: false,
    link: "#contact",
  },
  {
    id: "premium-frontend",
    title: "Advanced Frontend Website",
    subtitle: "Professional Multi-Page Sites",
    price: 4999,
    icon: Zap,
    gradient: "from-blue-500 via-purple-500 to-indigo-500",
    bgGlow: "bg-blue-500/20",
    borderColor: "border-blue-500/30",
    features: [
      "Up to 5-page frontend website",
      "Custom animations & components",
      "Brand-themed design system",
      "Portfolio / business / product pages",
      "Ideal for creators, startups & brands",
    ],
    popular: true, // highlighted card
    link: "#contact",
  },
  {
    id: "starter-dynamic",
    title: "Starter Dynamic Website",
    subtitle: "Backend + Dynamic Features",
    price: 7999,
    icon: Crown,
    gradient: "from-emerald-500 via-green-500 to-teal-500",
    bgGlow: "bg-green-500/20",
    borderColor: "border-green-500/30",
    features: [
      "Multi-page website with backend",
      "Database integration (Mongo / SQL)",
      "Auth / login system (optional)",
      "Admin / CMS panel on demand",
      "Great for institutes & services",
    ],
    popular: false,
    link: "#contact",
  },
  {
    id: "fullstack-pro",
    title: "Full-Stack Web Application",
    subtitle: "Custom, Scalable Web Apps",
    price: 14999,
    icon: Sparkles,
    gradient: "from-yellow-500 via-orange-500 to-red-500",
    bgGlow: "bg-yellow-500/20",
    borderColor: "border-yellow-500/30",
    features: [
      "Complete frontend + backend",
      "APIs, dashboards, databases",
      "E-commerce / SaaS / booking systems",
      "Cloud deployment & best practices",
      "Perfect for startups & businesses",
    ],
    popular: false,
    link: "#contact",
  },
];

export default function PremiumDeals() {
  return (
    <NavrionSectionWrapper id="pricing" className="py-20 md:py-32">
      {/* Background provided by NavrionSectionWrapper */}

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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/25 mb-6"
          >
            <Sparkles className="w-4 h-4 text-pink-300" />
            <span className="text-pink-200 text-sm font-medium">
              Website Development Packages
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="text-white">Website </span>
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              Development Plans
            </span>
          </h2>

          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
            From simple 2-page portfolios to full-stack web applications — these
            are{" "}
            <span className="font-semibold text-white">starting prices</span>.
            If you can imagine it,{" "}
            <span className="font-semibold text-purple-300">
              we can build it on the web.
            </span>
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
              {/* Subtle Glow removed for simpler design */}

              {/* Popular Badge */}
              {deal.popular && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 z-20"
                >
                    <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-black text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
                    <Star className="w-3 h-3 fill-current" />
                    POPULAR
                  </div>
                </motion.div>
              )}

              {/* Card Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${deal.gradient} p-3 mb-6 shadow-sm`}
                >
                  <deal.icon className="w-full h-full text-white" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-1">
                  {deal.title}
                </h3>
                <p className="text-gray-400 text-sm mb-6">
                  {deal.subtitle}
                </p>

                {/* Pricing */}
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-3xl font-bold text-white">
                    ₹{deal.price.toLocaleString("en-IN")}
                  </span>
                  <span className="text-gray-400 text-xs">
                    starting price
                  </span>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {deal.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <a
                  href={deal.link}
                  className={`w-full py-3 px-4 rounded-xl bg-gradient-to-r ${deal.gradient} text-white font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:opacity-90`}
                >
                  Get Custom Quote
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Extra line: we can build anything */}
        <div className="mt-10 text-center max-w-2xl mx-auto text-sm text-gray-300">
          <p className="font-semibold text-purple-300">
            Need something beyond these plans?
          </p>
          <p className="mt-2">
            We can design and build almost{" "}
            <span className="font-semibold text-white">anything on the web</span>{" "}
            — custom dashboards, internal tools, SaaS apps, CRMs, learning
            platforms, and more. Just tell us what you have in mind.
          </p>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
        >
          {[
            { icon: Users, label: "Projects Delivered", value: "25+" },
            { icon: Trophy, label: "Client Satisfaction", value: "100%" },
            { icon: BadgeCheck, label: "Tech Stacks Used", value: "10+" },
            { icon: TrendingUp, label: "Repeat Clients", value: "80%" },
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
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                {stat.value}
              </div>
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
            <span className="text-sm">Fast Delivery</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Crown className="w-5 h-5 text-purple-400" />
            <span className="text-sm">Clean, Scalable Code</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <span className="text-sm">Custom Design, No Templates</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <BadgeCheck className="w-5 h-5 text-green-400" />
            <span className="text-sm">Transparent Pricing</span>
          </div>
        </motion.div>
      </div>
    </NavrionSectionWrapper>
  );
}
