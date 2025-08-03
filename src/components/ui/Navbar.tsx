"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useCheckedData } from "@/context/checkedDataContext";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: (
    | {
        name: string;
        link: string;
        icon?: JSX.Element;
        group?: string;
      }
    | {
        name: string;
        icon?: JSX.Element;
        dropdown: { name: string; link: string }[];
      }
  )[];
  className?: string;
}) => {
  const { scrollYProgress } = useScroll();
  const { isLoggedIn: contextIsLoggedIn } = useCheckedData(); // From context

  const [isLoggedIn, setIsLoggedIn] = useState(contextIsLoggedIn); // Local state for dynamic updates
  const [visible, setVisible] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Group nav items by group property (legacy, not used for dropdowns)
  const groupedNav: Record<string, any[]> = {};
  navItems.forEach((item) => {
    if ("group" in item && item.group) {
      if (!groupedNav[item.group]) groupedNav[item.group] = [];
      groupedNav[item.group].push(item);
    }
  });
  // Only nav items with a direct link (not dropdowns)
  const mainNav = navItems.filter((item) => "link" in item && !("dropdown" in item));

  useEffect(() => {
    setIsLoggedIn(contextIsLoggedIn);
    // Check admin from token (if present)
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

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      const direction = current - scrollYProgress.getPrevious()!;
      if (scrollYProgress.get() < 0.05) {
        setVisible(true);
      } else {
        // Hide on scroll down, show on scroll up
        setVisible(direction < 0);
      }
    }
  });

  // Close menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.3,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
        className={cn(
          "flex w-[95vw] max-w-2xl font-Sfpro md:max-w-xl lg:min-w-fit fixed z-[5000] top-4 md:top-6 inset-x-0 mx-auto px-4 py-3 md:py-4 xl:py-4 rounded-2xl md:rounded-3xl border shadow-2xl items-center justify-between space-x-auto transition-all duration-300",
          // Enhanced glassmorphism design based on scroll
          scrollYProgress.get() > 0.05 
            ? "bg-white/20 backdrop-blur-xl border-blue-200/30 shadow-blue-900/30" 
            : "bg-white/10 backdrop-blur-lg border-blue-100/20 shadow-blue-900/20",
          className
        )}
        style={{
          backdropFilter: "blur(20px) saturate(180%)",
        }}
      >
        {/* Hamburger for mobile (show until 1028px) */}
        <div className="max-[1028px]:flex hidden items-center flex-1 justify-between">
          <motion.button
            className="p-2 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 hover:border-white/30 focus:outline-none transition-all duration-300"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Open navigation menu"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              animate={{ rotate: menuOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </motion.svg>
          </motion.button>
        </div>
        {/* Main nav for desktop (show from 1028px and up) */}
        <div className="hidden min-[1028px]:flex items-center gap-4 flex-1 justify-evenly">
          {navItems.map((navItem, idx) =>
            "link" in navItem ? (
              <motion.div
                key={`link=${idx}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Link
                  href={navItem.link}
                  className={cn(
                    "relative text-neutral-50 items-center flex space-x-auto hover:text-white transition-all duration-300 px-3 py-2 rounded-xl hover:bg-white/10 backdrop-blur-sm border border-transparent hover:border-white/20"
                  )}
                >
                  <span className="text-sm md:text-base !cursor-pointer flex items-center gap-2 font-medium">
                    <span className="group-hover:scale-110 transition-transform duration-300">
                      {navItem.icon}
                    </span>
                    {navItem.name}
                  </span>
                  {/* Enhanced hover effect */}
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 scale-x-0 hover:scale-x-100 transition-transform duration-300 rounded-full"></div>
                </Link>
              </motion.div>
            ) : "dropdown" in navItem ? (
              <div className="relative group" key={navItem.name}>
                <motion.button 
                  className="text-sm md:text-base text-neutral-50 flex items-center gap-2 hover:text-white px-3 py-2 rounded-xl focus:outline-none group-hover:bg-white/10 backdrop-blur-sm border border-transparent group-hover:border-white/20 transition-all duration-300 font-medium"
                  whileHover={{ scale: 1.05 }}
                >
                  {navItem.icon}
                  {navItem.name}
                  <svg
                    className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </motion.button>
                <div className="absolute left-0 mt-2 w-64 bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-black/30 p-3 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                  <div className="space-y-1">
                    {navItem.dropdown.map((item, idx) => (
                      <motion.div
                        key={item.link}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                      >
                        <Link
                          href={item.link}
                          className="flex items-center gap-3 px-4 py-3 text-white hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 rounded-xl transition-all duration-200 group/item border border-transparent hover:border-blue-400/30"
                        >
                          <div className="w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity duration-200"></div>
                          <span className="text-sm font-medium">{item.name}</span>
                          <motion.div
                            className="ml-auto opacity-0 group-hover/item:opacity-100"
                            whileHover={{ x: 3 }}
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          </motion.div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                  <div className="absolute -top-2 left-6 w-4 h-4 bg-black/80 border-l border-t border-white/20 transform rotate-45"></div>
                </div>
              </div>
            ) : null
          )}
        </div>
        {/* Mobile menu dropdown */}
        {menuOpen && (
          <div className="fixed inset-0 z-[6000] bg-black bg-opacity-60 flex flex-col items-center justify-center">
            <div
              ref={menuRef}
              className="bg-zinc-950 rounded-2xl shadow-2xl border-2 border-blue-900 p-8 w-11/12 max-w-sm mx-auto flex flex-col gap-4"
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "absolute",
                top: "calc(100% + 20px)", // 20px below the navbar
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              {navItems.map((navItem, idx) =>
                "link" in navItem ? (
                  <Link
                    key={`mobile-link=${idx}`}
                    href={navItem.link}
                    className="text-white text-lg py-2 px-4 rounded hover:bg-blue-800 transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    {navItem.name}
                  </Link>
                ) : "dropdown" in navItem ? (
                  <div key={navItem.name} className="flex flex-col gap-2">
                    <div className="text-blue-400 font-bold mt-3 mb-2 flex items-center gap-2 px-2">
                      {navItem.icon}
                      <span className="text-lg">{navItem.name}</span>
                    </div>
                    <div className="bg-white/5 rounded-xl p-2 space-y-1">
                      {navItem.dropdown.map((item, idx) => (
                        <Link
                          key={item.link}
                          href={item.link}
                          className="flex items-center gap-3 px-4 py-3 text-white hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 rounded-lg transition-all duration-200 group"
                          onClick={() => setMenuOpen(false)}
                        >
                          <div className="w-2 h-2 bg-blue-400 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"></div>
                          <span className="text-sm font-medium">{item.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null
              )}
            </div>
          </div>
        )}
        {/* Profile/Login and Admin Panel always at the end */}
        <div className="flex items-center gap-2 ml-2">
          <Link
            href={isLoggedIn ? "/profile" : "/auth/login"}
            className={cn(
              "relative text-neutral-50 items-center flex space-x-auto hover:text-neutral-300"
            )}
          >
            <span className="text-sm md:text-xl px-[6px] py-[4px]  md:px-4 md:py-2 border-2 rounded-2xl font-sfText font-bold border-white !cursor-pointer">
              {isLoggedIn ? "Profile" : "Login"}
              <span className="absolute inset-x-0 w-3/4 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent h-[5px]" />
            </span>
          </Link>
          {isAdmin && (
            <Link
              href="/admin/admin-panel"
              className={cn(
                "relative text-yellow-300 items-center flex space-x-auto hover:text-yellow-200 font-bold border-2 border-yellow-400 rounded-2xl px-4 py-2 ml-2"
              )}
            >
              Admin Panel
            </Link>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
