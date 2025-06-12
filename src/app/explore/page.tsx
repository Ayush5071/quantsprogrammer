"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Roadmapcard } from "@/components/component/Card";
import { gsap } from "gsap";

const page = () => {
  const router = useRouter();
  const [roadmaps, setRoadmaps] = useState<Array<{
    _id: string;
    title: string;
    description?: string;
    createdBy: string;
    linkedIn?: string;
  }>>([]);

  useEffect(() => {
    // Fetch roadmaps from API
    fetch("/api/roadmap/fetchall")
      .then((res) => res.json())
      .then((data) => setRoadmaps(data.roadmaps || []));
  }, []);

  useEffect(() => {
    const timeline = gsap.timeline();

    gsap.to(".planet", {
      rotation: 360,
      repeat: -1,
      duration: 10,
      ease: "linear",
    });

    timeline.fromTo(
      ".planet",
      {
        y: "50vh",
        scale: 0,
        opacity: 0,
      },
      {
        y: "-20vh",
        scale: 2,
        opacity: 1,
        duration: 3,
        ease: "power2.out",
      }
    );

    gsap.to(".star", {
      opacity: 0.7,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: {
        amount: 1,
        from: "random",
      },
    });
  }, []);

  return (
    <div className="relative py-4 h-screen text-white bg-gradient-to-b from-black via-gray-900 to-black overflow-x-hidden">
      {/* Back Arrow */}
      <div
        className="absolute top-6 left-6 flex items-center gap-2 cursor-pointer text-zinc-400 md:text-blue-400 md:hover:text-blue-600 z-20"
        onClick={() => router.push("/")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
        <span className="font-medium">Back</span>
      </div>

      {/* Planet */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 planet z-10 w-60 h-60 rounded-full bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-900 shadow-[0_0_60px_20px_rgba(80,180,255,0.4)] border-4 border-blue-300 overflow-hidden">
        {/* Planet Surface Texture */}
        <div className="absolute w-full h-full rounded-full bg-gradient-to-br from-purple-800/10 via-blue-700/20 to-indigo-600/20"></div>

        {/* Craters / Details */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full ${i % 2 === 0 ? "bg-blue-300/10" : "bg-purple-500/20"}`}
            style={{
              width: `${Math.random() * 15 + 20}px`,
              height: `${Math.random() * 15 + 20}px`,
              top: `${Math.random() * 90}%`,
              left: `${Math.random() * 90}%`,
              boxShadow: "0 0 20px rgba(255, 255, 255, 0.1)",
            }}
          ></div>
        ))}

        {/* Glow Halo */}
        <div className="absolute w-full h-full rounded-full bg-gradient-to-r from-blue-400/30 via-purple-700/20 to-blue-600/40 animate-pulse"></div>
      </div>

      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        {[...Array(100)].map((_, index) => (
          <div
            key={index}
            className="star absolute bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}vh`,
              left: `${Math.random() * 100}vw`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              opacity: 0.3,
            }}
          />
        ))}
      </div>

      <h1 className="relative z-20 text-5xl md:text-7xl text-center font-bold font-bebas text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-teal-300 to-indigo-500 my-12">
        Roadmaps to Mastering Technology
      </h1>

      <div className="relative z-20 flex flex-wrap justify-center gap-6 px-8">
        {roadmaps.length === 0 ? (
          <div className="text-center text-gray-400 text-xl">No roadmaps available yet.</div>
        ) : (
          roadmaps.map((roadmap, idx) => (
            <Roadmapcard
              key={roadmap._id || idx}
              heading={roadmap.title}
              description={roadmap.description || ""}
              link={`/explore/roadmap/${roadmap._id}`}
              author={roadmap.createdBy}
              linkedIn={roadmap.linkedIn || ""}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default page;
