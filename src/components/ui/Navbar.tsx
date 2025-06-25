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
          duration: 0.2,
        }}
        className={cn(
          "flex w-[95vw] max-w-2xl font-Sfpro md:max-w-xl lg:min-w-fit fixed z-[5000] top-10 inset-x-0 mx-auto px-3 py-3 md:py-4 xl:py-4 rounded-full border border-black/.1 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] items-center justify-between space-x-auto bg-neutral-950",
          className
        )}
        style={{
          backdropFilter: "blur(16px) saturate(180%)",
          borderRadius: "12px",
          border: "1px solid neutral-500",
        }}
      >
        {/* Hamburger for mobile */}
        <div className="md:hidden flex items-center flex-1 justify-center">
          <button
            className="p-2 focus:outline-none"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Open navigation menu"
          >
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
        {/* Main nav for desktop */}
        <div className="hidden md:flex items-center gap-4 flex-1 justify-evenly">
          {navItems.map((navItem, idx) =>
            "link" in navItem ? (
              <Link
                key={`link=${idx}`}
                href={navItem.link}
                className={cn(
                  "relative text-neutral-50 items-center flex space-x-auto hover:text-neutral-300"
                )}
              >
                <span className="text-sm md:text-xl !cursor-pointer flex items-center gap-2">
                  {navItem.icon}
                  {navItem.name}
                </span>
              </Link>
            ) : "dropdown" in navItem ? (
              <div className="relative group" key={navItem.name}>
                <button className="text-sm md:text-xl text-neutral-50 flex items-center gap-1 hover:text-neutral-300 px-3 py-2 rounded-lg focus:outline-none">
                  {navItem.icon}
                  {navItem.name}
                  <svg
                    className="w-4 h-4 ml-1"
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
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-zinc-900 border border-blue-700 rounded-xl shadow-2xl p-2 z-50 hidden group-hover:block">
                  {navItem.dropdown.map((item, idx) => (
                    <Link
                      key={item.link}
                      href={item.link}
                      className="block px-4 py-2 text-white hover:bg-blue-800 rounded"
                    >
                      {item.name}
                    </Link>
                  ))}
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
                  <div key={navItem.name} className="flex flex-col gap-1">
                    <span className="text-blue-400 font-bold mt-2 mb-1 flex items-center gap-2">
                      {navItem.icon}
                      {navItem.name}
                    </span>
                    {navItem.dropdown.map((item, idx) => (
                      <Link
                        key={item.link}
                        href={item.link}
                        className="block px-4 py-2 text-white hover:bg-blue-800 rounded"
                        onClick={() => setMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
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
