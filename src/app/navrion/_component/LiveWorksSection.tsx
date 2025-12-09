import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

function WorkCard({ title, tag, href }: { title: string; tag: string; href: string }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-[#111118] rounded-2xl border border-white/8 p-5 flex flex-col justify-between hover:border-purple-400/60 hover:bg-purple-500/5 transition-all"
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-sm">{title}</h3>
          <span className="text-[10px] px-2 py-1 rounded-full bg-white/5 text-gray-300 border border-white/10">Live</span>
        </div>
        <p className="text-[12px] text-gray-400">{tag}</p>
      </div>
      <div className="mt-4 inline-flex items-center gap-1 text-xs text-blue-300 group-hover:text-blue-200">
        Visit site
        <ArrowRight className="w-3 h-3" />
      </div>
    </motion.a>
  );
}

export default function LiveWorksSection() {
  return (
    <section id="work" className="w-full px-4 py-14 bg-[#05050a]">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-blue-400">Our Live Work</h2>
            <p className="text-gray-400 text-sm mt-1">Real projects, real clients. Trusted by individuals, colleges, and growing businesses.</p>
          </div>
          <span className="hidden sm:inline-flex text-[11px] px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">More live links can be shared on request</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <WorkCard title="Personal Portfolio" tag="Static · Modern UI" href="https://yourportfolio.com" />
          <WorkCard title="E-commerce Store" tag="Dynamic · Payments" href="https://yourecommerce.com" />
          <WorkCard title="CRM Dashboard" tag="Full-stack · Auth + DB" href="https://yourcrm.com" />
        </div>
      </div>
    </section>
  );
}
