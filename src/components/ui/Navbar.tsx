"use client";

import React, { useEffect, useState } from "react";
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

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: JSX.Element;
  }[];
  className?: string;
}) => {
  const { scrollYProgress } = useScroll();
  const { isLoggedIn: contextIsLoggedIn } = useCheckedData(); // From context

  const [isLoggedIn, setIsLoggedIn] = useState(contextIsLoggedIn); // Local state for dynamic updates
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setIsLoggedIn(contextIsLoggedIn);
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
          "flex w-[90vw] max-w-xl font-Sfpro md:max-w-xl lg:min-w-fit fixed z-[5000] top-10 inset-x-0 mx-auto px-3 py-3 md:py-4 xl:py-4 rounded-full border border-black/.1 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] items-center justify-evenly space-x-auto",
          className
        )}
        style={{
          backdropFilter: "blur(16px) saturate(180%)",
          backgroundColor: "bg-neutral-950",
          borderRadius: "12px",
          border: "1px solid neutral-500",
        }}
      >
        {navItems.map((navItem: any, idx: number) => (
          <Link
            key={`link=${idx}`}
            href={navItem.link}
            className={cn(
              "relative text-neutral-50 items-center flex space-x-auto hover:text-neutral-300"
            )}
          >
            <span className="text-sm md:text-xl !cursor-pointer">{navItem.name}</span>
          </Link>
        ))}

        {/* Dynamic Profile/Login Item */}
        <Link
          href={isLoggedIn ? "/profile" : "/login"}
          className={cn(
            "relative text-neutral-50 items-center flex space-x-auto hover:text-neutral-300"
          )}
        >
          <span className="text-sm md:text-xl px-[6px] py-[4px]  md:px-4 md:py-2 border-2 rounded-2xl font-sfText font-bold border-white !cursor-pointer">
            {isLoggedIn ? "Profile" : "Login"}
            <span className="absolute inset-x-0 w-3/4 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent h-[5px]" />
          </span>
        </Link>
      </motion.div>
    </AnimatePresence>
  );
};
