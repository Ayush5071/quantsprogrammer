"use client";

import React, { useState } from "react";
import NavrionSectionWrapper from "./NavrionSectionWrapper";
import { motion } from "framer-motion";
import { Send, Sparkles, Phone } from "lucide-react";

export default function ContactSection() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();

    const subject = encodeURIComponent(`New Project Inquiry from ${name}`);
    const body = encodeURIComponent(
      `Hey NAVRION Team,\n\nMy name is ${name}.\nMy contact number is: ${phone}\n\n${message}\n\nLooking forward to hearing from you!\n\nRegards,\n${name}`
    );

    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&to=quantsprogrammer@gmail.com&su=${subject}&body=${body}`,
      "_blank"
    );
  };

  return (
    <NavrionSectionWrapper id="contact" className="py-24">
      {/* Background provided by NavrionSectionWrapper */}

      <div className="relative z-10 max-w-3xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 border border-white/10">
            <Sparkles className="w-4 h-4 text-pink-300" />
            <span className="text-sm text-gray-300">Ready to Connect?</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400">
            Let's Build Something Legendary
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            Your idea deserves more than a placeholder. Share it — we’ll turn it into a digital product with traction.
          </p>
        </motion.div>

        {/* Contact Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-white/10 bg-[#111118]/80 backdrop-blur-sm p-8 shadow-sm"
        >
          <form onSubmit={handleSend} className="flex flex-col gap-5">
            {/* Name */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-300 mb-1">Your Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="px-4 py-3 rounded-xl bg-[#18181f] border border-white/10 text-white focus:outline-none focus:border-pink-400/50 transition"
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-300 mb-1">Contact Number</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="px-4 py-3 rounded-xl bg-[#18181f] border border-white/10 text-white focus:outline-none focus:border-blue-400/50 transition"
                placeholder="Enter Mobile Number with Country Code"
              />
            </div>

            {/* Message */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-300 mb-1">Your Message</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="px-4 py-3 rounded-xl bg-[#18181f] border border-white/10 text-white focus:outline-none focus:border-purple-400/50 transition resize-none"
                placeholder="Tell us what you're looking to build..."
              />
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 font-semibold text-white shadow-sm transition-all"
            >
              Send Message <Send className="w-4 h-4" />
            </motion.button>

            <p className="text-center text-gray-400 text-xs mt-3">
              Gmail will open with your message pre-filled
            </p>
          </form>

        </motion.div>
      </div>
    </NavrionSectionWrapper>
  );
}
