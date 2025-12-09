import React from "react";
import { motion } from "framer-motion";
import { Layout, Globe2, Store, Code2, Rocket, PhoneCall, Sparkles } from "lucide-react";

function ServiceItem({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex items-center gap-3 p-4 rounded-xl bg-[#111118] border border-white/8 hover:border-purple-400/50 hover:bg-purple-500/5 transition-all"
    >
      <div className="p-2 rounded-lg bg-purple-500/10">
        <Icon className="w-4 h-4 text-purple-300" />
      </div>
      <span>{label}</span>
    </motion.div>
  );
}

export default function ServicesSection() {
  return (
    <section id="services" className="w-full px-4 py-16 bg-[#05050a]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl font-bold mb-3 text-purple-400">What We Can Build for You</h2>
          <p className="text-gray-300 text-sm sm:text-base">
            We can create <span className="font-semibold text-blue-400">almost anything on the web</span> — from clean static pages to complex web applications with dashboards, authentication, and databases.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-sm text-gray-200">
          <ServiceItem icon={Layout} label="Portfolios & Personal Sites" />
          <ServiceItem icon={Globe2} label="Business & Brand Websites" />
          <ServiceItem icon={Store} label="E-commerce Stores" />
          <ServiceItem icon={Code2} label="Dashboards & Admin Panels" />
          <ServiceItem icon={Rocket} label="Start-up Landing Pages" />
          <ServiceItem icon={PhoneCall} label="Booking & CRM Systems" />
          <ServiceItem icon={Globe2} label="E-learning Platforms" />
          <ServiceItem icon={Sparkles} label="Any custom idea you have" />
        </div>
      </div>
    </section>
  );
}
