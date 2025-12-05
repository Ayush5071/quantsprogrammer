"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useCheckedData } from "@/context/checkedDataContext";
import Cookies from "js-cookie";
import { Menu, X, ChevronDown, User, Shield } from "lucide-react";

interface NavItem {
  name: string;
  link?: string;
  dropdown?: { name: string; link: string }[];
}

export const FloatingNav = ({
  navItems,
}: {
  navItems: NavItem[];
  className?: string;
}) => {
  const { isLoggedIn: contextIsLoggedIn } = useCheckedData();
  const [isLoggedIn, setIsLoggedIn] = useState(contextIsLoggedIn);
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoggedIn(contextIsLoggedIn);
    const token = Cookies.get("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setIsAdmin(payload.isAdmin === true);
      } catch {
        setIsAdmin(false);
      }
    } else {
      setIsAdmin(false);
    }
  }, [contextIsLoggedIn]);

  useEffect(() => {
    const token = Cookies.get("token");
    setIsLoggedIn(!!token);
  }, []);

  // Close menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setOpenDropdown(null);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[5000]">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between px-4 py-3 bg-[#111118]/80 backdrop-blur-xl border border-white/10 rounded-2xl"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="hidden sm:block text-white font-semibold">PrepSutra</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) =>
              item.link ? (
                <Link
                  key={item.name}
                  href={item.link}
                  className="px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                >
                  {item.name}
                </Link>
              ) : item.dropdown ? (
                <div key={item.name} className="relative group">
                  <button className="flex items-center gap-1 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                    {item.name}
                    <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-200" />
                  </button>
                  <div className="absolute top-full left-0 mt-2 py-2 w-48 bg-[#111118] border border-white/10 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                    {item.dropdown.map((subItem) => (
                      <Link
                        key={subItem.link}
                        href={subItem.link}
                        className="block px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Link
                href="/admin/admin-panel"
                className="hidden sm:flex items-center gap-1 px-3 py-2 text-sm text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-all"
              >
                <Shield className="w-4 h-4" />
                <span className="hidden md:inline">Admin</span>
              </Link>
            )}
            <Link
              href={isLoggedIn ? "/profile" : "/auth/login"}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-blue-500 hover:to-indigo-500 transition-all"
            >
              <User className="w-4 h-4" />
              <span>{isLoggedIn ? "Profile" : "Login"}</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </motion.div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden mt-2 p-4 bg-[#111118]/95 backdrop-blur-xl border border-white/10 rounded-2xl"
            >
              <div className="space-y-1">
                {navItems.map((item) =>
                  item.link ? (
                    <Link
                      key={item.name}
                      href={item.link}
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                    >
                      {item.name}
                    </Link>
                  ) : item.dropdown ? (
                    <div key={item.name}>
                      <button
                        onClick={() => setOpenDropdown(openDropdown === item.name ? null : item.name)}
                        className="w-full flex items-center justify-between px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                      >
                        {item.name}
                        <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === item.name ? "rotate-180" : ""}`} />
                      </button>
                      <AnimatePresence>
                        {openDropdown === item.name && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden ml-4 border-l border-white/10"
                          >
                            {item.dropdown.map((subItem) => (
                              <Link
                                key={subItem.link}
                                href={subItem.link}
                                onClick={() => setMenuOpen(false)}
                                className="block px-4 py-2 text-sm text-gray-400 hover:text-white transition-all"
                              >
                                {subItem.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : null
                )}
                {isAdmin && (
                  <Link
                    href="/admin/admin-panel"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-all"
                  >
                    <Shield className="w-4 h-4" />
                    Admin Panel
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};
