import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Pricing", href: "#pricing" },
  { label: "Why Us", href: "#why-us" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-[#05050a]/80 backdrop-blur">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="#hero" className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-purple-500 via-blue-500 to-cyan-400 flex items-center justify-center">
            <span className="text-xs font-bold tracking-tight">NV</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-semibold text-sm sm:text-base tracking-wide">NAVRION</span>
            <span className="text-[11px] text-gray-400 group-hover:text-gray-300 transition-colors">Web Dev Studio</span>
          </div>
        </Link>
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6 text-sm">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="relative text-gray-300 hover:text-white transition-colors">
                {link.label}
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full transition-all group-hover:w-full" />
              </a>
            ))}
          </div>
          <Link href="#contact" className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 text-sm font-medium shadow-lg shadow-purple-600/30 hover:shadow-purple-500/50 hover:-translate-y-[1px] transition-all">
            Start a Project
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {/* Mobile Menu Button */}
        <button className="md:hidden p-2 rounded-lg border border-white/10" onClick={() => setMenuOpen((prev) => !prev)}>
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/5 bg-[#05050a]">
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-3">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="text-gray-200 text-sm py-1">
                {link.label}
              </a>
            ))}
            <Link href="#contact" onClick={() => setMenuOpen(false)} className="mt-2 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 text-sm font-medium shadow-lg shadow-purple-600/30">
              Start a Project
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
