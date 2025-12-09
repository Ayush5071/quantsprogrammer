"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";

const navItems = [
  { name: "Home", link: "#hero" },
  { name: "Work", link: "#work" },
  { name: "Services", link: "#services" },
  { name: "Pricing", link: "#pricing" },
  { name: "Why Us", link: "#why-us" },
];

export default function NavbarNew() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const listen = () => setScrolled(window.scrollY > 20);
    listen();
    window.addEventListener("scroll", listen, { passive: true });
    return () => window.removeEventListener("scroll", listen);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && menuOpen && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-screen transition-all duration-300 ${
        scrolled
          ? "bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/10 shadow-[0_0_25px_rgba(236,72,153,0.2)] py-2"
          : "py-5"
      }`}
      role="banner"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link href="#hero" className="flex items-center gap-3 group">
            <img
              src="/navrion.png"
              alt="NAVRION"
              className="h-10 w-10 rounded-md object-contain group-hover:scale-105 transition-transform duration-300"
            />
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="font-semibold text-white tracking-wide">NAVRION</span>
              <span className="text-[11px] text-gray-400">Web Dev Studio</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.link}
                className="relative px-3 py-2 text-sm text-gray-300 hover:text-white transition-colors group"
              >
                {item.name}
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-full transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* CTA + Mobile Menu */}
          <div className="flex items-center gap-3">
            <Link
              href="#contact"
              className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-sm font-semibold text-white shadow-xl shadow-pink-500/20 hover:scale-105 hover:shadow-pink-400/30 active:scale-95 transition-all duration-300"
            >
              Start a Project <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              aria-label="Menu"
              onClick={() => setMenuOpen(true)}
              className="lg:hidden p-2 rounded-md border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 transition"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE NAV */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="fixed top-24 inset-x-4 z-50 bg-[#111118]/95 border border-white/10 rounded-2xl p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-white">Navigation</span>
                <button
                  aria-label="Close"
                  className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-white/5 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.link}
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-3 rounded-lg text-gray-200 hover:text-white hover:bg-white/5 transition-all"
                >
                  {item.name}
                </Link>
              ))}

              <button
                onClick={() => { setMenuOpen(false); window.location.href = "#contact"; }}
                className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold shadow-lg hover:opacity-95 transition"
              >
                Start a Project
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
