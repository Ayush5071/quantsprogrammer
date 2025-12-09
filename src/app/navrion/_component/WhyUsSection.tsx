"use client";

import React from "react";
import NavrionSectionWrapper from "./NavrionSectionWrapper";
import { motion } from "framer-motion";
import { Check, Zap, ShieldCheck, Rocket, Sparkles, Cpu } from "lucide-react";

function WhyItem({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="group flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 hover:border-pink-400/60 text-gray-200 backdrop-blur-sm transition-all"
    >
      <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-500/10 shadow-inner">
        <Icon className="w-5 h-5 text-pink-300" />
      </div>
      <span className="text-sm font-medium">{text}</span>
    </motion.div>
  );
}

export default function WhyUsSection() {
  return (
    <NavrionSectionWrapper id="why-us" className="py-24">
      {/* Background provided by NavrionSectionWrapper */}

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2 mb-5 rounded-full bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-white/10"
          >
            <Sparkles className="w-4 h-4 text-pink-300" />
            <span className="text-pink-300 text-sm font-medium">Why NAVRION?</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
            The Team Behind Your Digital Growth
          </h2>

          <p className="text-gray-300 text-sm sm:text-lg">
            We're not here to ship another cookie-cutter website.
            <br />
            <span className="font-semibold text-white">We build digital assets that convert, scale, and stand out.</span>
          </p>
        </motion.div>

        {/* Why Us Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-white">
          <WhyItem icon={ShieldCheck} text="Transparent pricing with no hidden costs" />
          <WhyItem icon={Zap} text="Lightning-fast delivery & responsive support" />
          <WhyItem icon={Sparkles} text="Unique designs crafted for your brand — not templates" />
          <WhyItem icon={Cpu} text="Built with modern, scalable tech & clean code" />
          <WhyItem icon={Rocket} text="Performance-optimized & mobile-first approach" />
          <WhyItem icon={Check} text="Long-term maintainability & future-proof structure" />
        </div>
      </div>
    </NavrionSectionWrapper>
  );
}
