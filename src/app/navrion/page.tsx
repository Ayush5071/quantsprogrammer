"use client";

import React from "react";
import { motion } from "framer-motion";
import Navbar from "./_component/NavbarNew";
import HeroSection from "./_component/HeroSection";
import LiveWorksSection from "./_component/LiveWorksSection";
import ServicesSection from "./_component/ServicesSection";
import PricingSection from "./_component/PricingSection";
import WhyUsSection from "./_component/WhyUsSection";
import ContactSection from "./_component/ContactSection";
import FooterSection from "./_component/FooterSection";
import { ArrowRight } from "lucide-react";

const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Pricing", href: "#pricing" },
  { label: "Why Us", href: "#why-us" },
];

export default function NavrionPage() {
  return (
    <div className="min-h-screen bg-[#05050a] text-white flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <LiveWorksSection />
        <ServicesSection />
        <PricingSection />
        <WhyUsSection />
        <ContactSection />
      </main>
      <FooterSection />
    </div>
  );
}

/* --- Small Reusable Components --- */

function WorkCard({
  title,
  tag,
  href,
}: {
  title: string;
  tag: string;
  href: string;
}) {
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
          <span className="text-[10px] px-2 py-1 rounded-full bg-white/5 text-gray-300 border border-white/10">
            Live
          </span>
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

function ServiceItem({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
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

function PricingCard({
  label,
  price,
  subtitle,
  highlight,
  features,
  ideal,
  note,
  accent,
}: {
  label: string;
  price: string;
  subtitle: string;
  highlight: string;
  features: string[];
  ideal: string;
  note?: string;
  accent: "blue" | "purple";
}) {
  const accentClasses =
    accent === "blue"
      ? "from-blue-500/40 to-cyan-400/40 text-blue-300"
      : "from-purple-500/40 to-pink-400/40 text-purple-300";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative rounded-2xl bg-[#0b0b13] border border-white/10 p-6 shadow-xl overflow-hidden"
    >
      <div
        className={`absolute -top-20 right-[-40%] h-40 w-56 bg-gradient-to-r ${accentClasses} opacity-40 blur-3xl`}
      />
      <div className="relative z-10">
        <h3 className="text-lg font-semibold mb-1">{label}</h3>
        <p className="text-[11px] text-gray-400 mb-4">
          {highlight}
        </p>

        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-2xl font-bold">{price}</span>
          <span className="text-xs text-gray-400">{subtitle}</span>
        </div>

        <ul className="text-xs text-gray-200 space-y-1.5 mb-4">
          {features.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-[2px] text-[10px]">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <p className="text-[11px] text-gray-300 mb-2">
          <span className="font-semibold">Ideal for:</span> {ideal}
        </p>
        {note && (
          <p className="text-[10px] text-gray-400 italic">
            {note}
          </p>
        )}
      </div>
    </motion.div>
  );
}

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
