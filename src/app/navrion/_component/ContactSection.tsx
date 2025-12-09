import React from "react";
import { motion } from "framer-motion";

export default function ContactSection() {
  return (
    <section id="contact" className="w-full px-4 py-16 bg-[#0a0a13]">
      <div className="max-w-3xl mx-auto rounded-xl border border-white/10 bg-[#111118] p-8 shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-yellow-400 text-center">Contact Us</h2>
        <form className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Your Name"
            className="px-4 py-2 rounded bg-[#18181f] border border-white/10 text-white focus:outline-none focus:border-yellow-400"
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            className="px-4 py-2 rounded bg-[#18181f] border border-white/10 text-white focus:outline-none focus:border-yellow-400"
            required
          />
          <textarea
            placeholder="Your Message"
            className="px-4 py-2 rounded bg-[#18181f] border border-white/10 text-white focus:outline-none focus:border-yellow-400"
            rows={4}
            required
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="bg-yellow-400 text-black font-semibold py-2 rounded hover:bg-yellow-500 transition-all"
            type="submit"
          >
            Send Message
          </motion.button>
        </form>
      </div>
    </section>
  );
}
