import React from "react";
import { motion } from "framer-motion";

function WhyItem({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex items-center gap-3 p-4 rounded-xl bg-[#111118] border border-white/8 hover:bg-yellow-500/5 hover:border-yellow-400/60 transition-all"
    >
      <span className="text-lg">✔️</span>
      <span>{text}</span>
    </motion.div>
  );
}

export default function WhyUsSection() {
  return (
    <section id="why-us" className="w-full px-4 py-16 bg-[#05050a]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-2xl font-bold mb-3 text-yellow-400">Why Choose NAVRION?</h2>
          <p className="text-gray-300 text-sm sm:text-base">
            Not just another template-based agency. We focus on <span className="font-semibold text-white">clean code, smooth UX, and long-term scalability.</span>
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 text-sm text-gray-200">
          <WhyItem text="Transparent, no-nonsense pricing" />
          <WhyItem text="Fast delivery & responsive support" />
          <WhyItem text="Custom designs tailored to your brand" />
          <WhyItem text="Modern tech stack & best practices" />
          <WhyItem text="Performance-focused & mobile-first" />
          <WhyItem text="Scalable, maintainable code structure" />
        </div>
      </div>
    </section>
  );
}
