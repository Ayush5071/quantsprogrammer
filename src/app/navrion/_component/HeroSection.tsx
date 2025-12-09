import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Globe2, Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="w-full px-4 pt-16 pb-20 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.18),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(56,189,248,0.16),_transparent_55%)]"
    >
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        {/* Left */}
        <div className="flex-1">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-medium bg-white/5 border border-white/10 text-gray-200 mb-4"
          >
            <Sparkles className="w-3 h-3 text-purple-400" />
            Freelance Web Development Studio
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-4"
          >
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
              Beautiful & High-Performance
            </span>{" "}
            Websites for Ambitious Brands.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-300 text-sm sm:text-base max-w-xl mb-6"
          >
            NAVRION builds fast, modern, and pixel-perfect websites for
            individuals, startups, and growing businesses. From landing pages
            to full-stack web apps, we handle everything end-to-end.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="flex flex-wrap items-center gap-3 mb-6"
          >
            <Link
              href="#pricing"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 text-sm font-semibold shadow-lg shadow-purple-600/30 hover:-translate-y-[1px] hover:shadow-purple-500/50 transition-all"
            >
              View Pricing
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#work"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs sm:text-sm text-gray-100 hover:bg-white/10 transition-all"
            >
              See Live Work
              <Globe2 className="w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-6 text-xs text-gray-400"
          >
            <div>
              <span className="block text-gray-200 font-semibold">
                Starting at ₹2,499
              </span>
              <span className="block">Static & portfolio websites</span>
            </div>
            <div>
              <span className="block text-gray-200 font-semibold">
                Dynamic from ₹7,999
              </span>
              <span className="block">
                E-commerce, dashboards, e-learning & more
              </span>
            </div>
          </motion.div>
        </div>
        {/* Right - Visual / Stats */}
        {/* ...right side content can be extracted as another component if needed... */}
      </div>
    </section>
  );
}
