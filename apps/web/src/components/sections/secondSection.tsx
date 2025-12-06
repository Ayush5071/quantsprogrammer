"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ContainerScroll } from "../ui/Container-scroll";

export function SecondSection() {
  const [imageSrc, setImageSrc] = useState("/secondSection-small.webp");

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1536) {
        setImageSrc("/secondSection-large.webp");
      } else if (width >= 608) {
        setImageSrc("/secondSection-med.webp"); 
      } else if (width >= 408) {
        setImageSrc("/secondSection-med-s.webp"); 
      } else {
        setImageSrc("/secondSection-small.webp"); 
      }
    };

    // Initial check on mount
    handleResize();

    // Add event listener for resize
    window.addEventListener("resize", handleResize);

    // Clean up the event listener when component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-bebas font-semibold text-white">
              Empowering You with <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                Development Roadmaps
              </span>
            </h1>
          </>
        }
      >
        {/* Cool cards explaining the project instead of image/canvas */}
        <div className="w-full flex flex-wrap justify-center items-center gap-6 py-8">
          <div className="bg-gradient-to-br from-blue-900 via-blue-950 to-purple-950 border-2 border-blue-700 rounded-3xl shadow-xl p-8 w-full max-w-xs flex flex-col items-center hover:scale-105 transition-transform duration-300">
            <span className="text-4xl mb-2">🗺️</span>
            <h3 className="text-xl font-bold text-blue-200 mb-2 text-center">Curated Roadmaps</h3>
            <p className="text-zinc-300 text-center text-sm">Explore step-by-step learning paths for every tech stack, from beginner to advanced, crafted by industry experts.</p>
          </div>
          <div className="bg-gradient-to-br from-purple-900 via-purple-950 to-blue-950 border-2 border-purple-700 rounded-3xl shadow-xl p-8 w-full max-w-xs flex flex-col items-center hover:scale-105 transition-transform duration-300">
            <span className="text-4xl mb-2">📈</span>
            <h3 className="text-xl font-bold text-purple-200 mb-2 text-center">Track Your Progress</h3>
            <p className="text-zinc-300 text-center text-sm">Mark tasks as complete, save your journey, and unlock achievements as you grow your skills.</p>
          </div>
          <div className="bg-gradient-to-br from-pink-900 via-pink-950 to-blue-950 border-2 border-pink-700 rounded-3xl shadow-xl p-8 w-full max-w-xs flex flex-col items-center hover:scale-105 transition-transform duration-300">
            <span className="text-4xl mb-2">🤝</span>
            <h3 className="text-xl font-bold text-pink-200 mb-2 text-center">Community & AI</h3>
            <p className="text-zinc-300 text-center text-sm">Get AI-powered suggestions, join discussions, and connect with a vibrant community of learners and mentors.</p>
          </div>
        </div>
      </ContainerScroll>
    </div>
  );
}
