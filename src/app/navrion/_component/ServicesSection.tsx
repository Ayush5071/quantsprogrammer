"use client";

import React, { useState, useEffect } from "react";
import NavrionSectionWrapper from "./NavrionSectionWrapper";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layout,
  Globe2,
  Store,
  Code2,
  Rocket,
  PhoneCall,
  Sparkles,
  X,
} from "lucide-react";

function ServiceItem({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="group flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] backdrop-blur-sm border border-white/10 hover:border-pink-400/60 transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500/30 to-purple-500/20 shadow-inner">
        <Icon className="w-5 h-5 text-pink-300" />
      </div>
      <span className="font-semibold text-white">{label}</span>
      <span className="ml-auto hidden sm:inline-flex px-3 py-1 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-semibold shadow">
        Explore
      </span>
    </motion.div>
  );
}

export default function ServicesSection() {
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowModal(false);
    };
    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "";
  }, [showModal]);

  return (
    <NavrionSectionWrapper id="services" className="py-20 md:py-32">
      {/* Background provided by NavrionSectionWrapper */}

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-white/10 mb-6"
          >
            <Sparkles className="w-4 h-4 text-pink-300" />
            <span className="text-pink-200 text-sm font-medium">
              Services We Offer
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
            From Simple Sites to Full-Scale Web Systems
          </h2>

          <p className="text-gray-300 text-sm sm:text-lg">
            Whether it's a sleek portfolio or a multi-layered platform —
            <span className="font-semibold text-white"> we build experiences that scale.</span><br />
            If you can think it, <span className="text-purple-300 font-semibold">we can build it.</span>
          </p>

          <button
            onClick={() => {
              setSelectedService("Custom Project");
              setShowModal(true);
            }}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold shadow-sm hover:opacity-90 transition"
          >
            Start a Project
          </button>
        </motion.div>

        {/* Services Grid */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-white">
          <ServiceItem
            icon={Layout}
            label="Portfolios & Personal Sites"
            onClick={() => {
              setSelectedService("Portfolios & Personal Sites");
              setShowModal(true);
            }}
          />
          <ServiceItem icon={Globe2} label="Business & Brand Websites" />
          <ServiceItem
            icon={Store}
            label="E-commerce Stores"
            onClick={() => {
              setSelectedService("E-commerce Stores");
              setShowModal(true);
            }}
          />
          <ServiceItem icon={Code2} label="Dashboards & Admin Panels" />
          <ServiceItem icon={Rocket} label="Start-up Landing Pages" />
          <ServiceItem icon={PhoneCall} label="Booking & CRM Systems" />
          <ServiceItem
            icon={Globe2}
            label="E-learning Platforms"
            onClick={() => {
              setSelectedService("E-learning Platforms");
              setShowModal(true);
            }}
          />
          <ServiceItem icon={Sparkles} label="Any Custom Idea You Have" />
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 20 }}
              transition={{ duration: 0.22 }}
              className="bg-gradient-to-br from-[#0b0b14] to-[#10101a] border border-white/10 rounded-2xl p-6 max-w-lg w-full relative shadow-sm"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 p-2 text-gray-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-1">
                  {selectedService}
                </h3>
                <p className="text-sm text-gray-400 mb-5">
                  Tell us your requirements — we’ll provide a custom quote and
                  roadmap tailored to your idea.
                </p>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => {
                      setShowModal(false);
                      window.location.href = "#contact";
                    }}
                    className="py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold shadow hover:opacity-95 transition"
                  >
                    Contact & Get Quote
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="py-3 rounded-xl border border-white/10 text-gray-200 bg-white/5 hover:bg-white/10 transition"
                  >
                    Maybe Later
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </NavrionSectionWrapper>
  );
}
