"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Sparkles } from "lucide-react";

/* ------------------ WORK CARD COMPONENT ------------------ */
function WorkCard({
  title,
  tag,
  href,
  imageSrc,
  description,
}: {
  title: string;
  tag: string;
  href: string;
  imageSrc?: string;
  description?: string;
}) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open ${title} in a new tab`}
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
      className="group bg-gradient-to-b from-[#0b0b10]/60 to-[#0b0b10]/80 rounded-2xl border border-white/8 overflow-hidden shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-pink-400/30"
    >
      <div className="p-4">
        <div className="rounded-xl overflow-hidden border border-white/5 bg-[#05050a] p-1 group-hover:border-pink-500/20 transition-all">
          <div className="rounded-lg overflow-hidden relative aspect-[16/9]">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={`${title} screenshot`}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-pink-400/10 to-purple-300/10">
                <span className="text-gray-400 text-xs">Preview coming soon</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="absolute top-3 left-3 px-2 py-1 rounded-md text-[11px] bg-black/40 backdrop-blur-md text-white/90 border border-white/10">
              Live
            </span>
          </div>
        </div>

        <div className="mt-3 flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-[15px] text-white/90">{title}</h3>
            <p className="text-[12px] text-gray-400 mt-1">
              {tag} {description && <span>· {description}</span>}
            </p>
          </div>

          {/* Desktop CTA */}
          <div className="hidden sm:flex items-center">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                window.open(href, "_blank", "noopener,noreferrer");
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/10 hover:border-pink-400/40 text-white text-xs font-semibold transition-all hover:bg-white/5"
            >
              Visit
              <ArrowRight className="w-4 h-4 opacity-70" />
            </button>
          </div>
        </div>

        {/* Mobile CTA */}
        <div className="sm:hidden mt-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              window.open(href, "_blank", "noopener,noreferrer");
            }}
            className="inline-flex items-center gap-2 px-4 py-2 w-full justify-center rounded-xl bg-white/10 border border-white/10 hover:border-pink-400/40 text-white text-sm font-semibold transition-all hover:bg-white/5"
          >
            Visit site
            <ArrowRight className="w-4 h-4 opacity-70" />
          </button>
        </div>
      </div>
    </motion.a>
  );
}

/* ------------------ LIVE WORKS SECTION ------------------ */
export default function LiveWorksSection() {
  return (
    <section id="work" className="w-full px-4 py-20 bg-[#05050a] relative overflow-hidden">
      {/* Minimal grid bg */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:60px_60px]" />

<div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-blue-300"
          >
            Our Live Case Studies
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-gray-400 text-sm md:text-base mt-3 max-w-2xl mx-auto leading-relaxed"
          >
            Real products, real clients — engineered for
            <span className="text-white font-semibold"> speed, credibility, and conversion.</span>
            Explore what we’ve shipped across industries.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75 }}
            className="flex justify-center items-center gap-3 mt-6"
          >
            <span className="text-[11px] px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
              Some projects are private — NDA protected
            </span>

            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-pink-400/40 shadow-md shadow-pink-500/10 hover:shadow-pink-500/20 transition-all text-white text-xs font-semibold"
            >
              Request full portfolio
              <ArrowRight className="w-3 h-3 opacity-70" />
            </a>
          </motion.div>
        </div>

        {/* WORK CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <WorkCard
            title="Personal Portfolio"
            tag="Static · Modern UI"
            href="https://yourportfolio.com"
            imageSrc="/assets/portfolio.png"
            description="Next.js & Tailwind"
          />
          <WorkCard
            title="E-commerce Store"
            tag="Dynamic · Payments"
            href="https://yourecommerce.com"
            imageSrc="/assets/linkedin.png"
            description="Stripe · CMS"
          />
          <WorkCard
            title="CRM Dashboard"
            tag="Full-stack · Auth + DB"
            href="https://yourcrm.com"
            description="MongoDB · Auth"
          />
          <WorkCard
            title="Blog Platform"
            tag="Content · SEO"
            href="https://yourblog.com"
            description="Headless CMS"
          />
          <WorkCard
            title="Resume Builder"
            tag="Tools · Export PDFs"
            href="https://resumebuilder.com"
            description="React · PDF Export"
          />
          <WorkCard
            title="Interview Prep"
            tag="Practice · Data-Driven"
            href="https://interviewprep.com"
            description="SWR · Auth"
          />
        </div>
      </div>
    </section>
  );
}
