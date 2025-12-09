"use client";
import React from "react";
import NavrionSectionWrapper from "./NavrionSectionWrapper";
import { Mail, Linkedin, MapPin, Phone } from "lucide-react";

export default function FooterSection() {
  return (
    <NavrionSectionWrapper className="pt-16 pb-10">
      <footer className="relative w-full border-t border-white/10 bg-transparent pt-16 pb-10 overflow-hidden">
      {/* Background provided by NavrionSectionWrapper */}

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">

          {/* Brand */}
          <div className="flex flex-col items-start">
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-blue-300">
              NAVRION
            </h3>
            <p className="text-gray-400 text-sm mt-2 leading-relaxed">
              We design, build, and scale digital products that define brands and accelerate businesses.
            </p>
            <p className="text-[11px] text-gray-500 mt-2">
              Trusted by creators, colleges, and growing businesses.
            </p>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-white tracking-wide mb-1">Contact</h4>

            <a
              href="mailto:quantsprogrammer@gmail.com"
              className="flex items-center gap-2 text-gray-300 text-sm hover:text-pink-300 transition"
            >
              <Mail className="w-4 h-4 text-pink-300" />
              quantsprogrammer@gmail.com
            </a>

            <a
              href="https://www.linkedin.com/in/ayush-tiwari-84a823281"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-300 text-sm hover:text-blue-300 transition"
            >
              <Linkedin className="w-4 h-4 text-blue-300" />
              LinkedIn Profile
            </a>
          </div>

          {/* Address */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-white tracking-wide mb-1">Office Address</h4>
            <p className="flex items-start gap-2 text-gray-300 text-sm leading-relaxed">
              <MapPin className="w-4 h-4 text-pink-300 mt-1" />
              Motilal Nehru National Institute of Technology (MNNIT), Allahabad, Prayagraj, Uttar Pradesh, India - 211004
            </p>
            <p className="text-[12px] text-gray-400 mt-1">
              Contact us through mail & our team will reach out as soon as possible.
            </p>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-gray-400 text-xs">
          <span className="text-sm text-gray-300">
            © {new Date().getFullYear()} NAVRION. All rights reserved.
          </span>
          <span className="text-sm text-gray-300">
            Made with <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">♥</span> in MNNIT Allahabad
          </span>
        </div>
      </div>
      </footer>
    </NavrionSectionWrapper>
  );
}
