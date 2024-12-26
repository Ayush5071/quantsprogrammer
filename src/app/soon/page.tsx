"use client";

import { useEffect } from "react";
import { gsap } from "gsap"; // Import GSAP
import Link from "next/link";

export default function PlaceholderPage() {
  useEffect(() => {
    // GSAP Animation for smooth opacity increase (from 0 to 1)
    const timeline = gsap.timeline();

    timeline
      .from(".coming-soon-message", {
        opacity: 0, // Start with opacity 0
        y: -30,     // Start with a little offset on Y-axis for smooth entrance
        duration: 1, // Duration of the animation
        ease: "power3.out", // Ease for smooth transition
      })
      .from(
        ".button-container button", {
          opacity: 0,  // Start button opacity from 0
          scale: 0.95, // Scale button for smooth effect
          duration: 0.8, // Duration for button animation
          stagger: 0.3, // Stagger effect for buttons to animate one after another
          ease: "power3.out", // Ease to make the transition smoother
        },
        "-=0.5" // Start the button animation half a second before the first animation ends
      );
  }, []);

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-r from-black via-gray-900 to-black py-12 flex flex-col items-center justify-center relative px-4 sm:px-6 md:px-12">
      {/* Starry Background */}
      <div className="absolute top-0 left-0 w-full h-full">
        {[...Array(200)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}vh`,
              left: `${Math.random() * 100}vw`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animation: `twinkle ${Math.random() * 3 + 1}s infinite`,
              opacity: Math.random() + 0.5,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl text-white font-extrabold coming-soon-message relative z-10 text-center">
        Content Coming Soon!
      </h1>
      <p className="text-lg sm:text-xl md:text-2xl text-gray-100 mt-4 coming-soon-message relative z-10 text-center leading-relaxed max-w-lg sm:max-w-xl md:max-w-2xl mx-auto">
        The text or feature you are looking for will be added in 3–4 days. Stay tuned for updates!
      </p>

      {/* Buttons */}
      <div className="button-container mt-8 space-y-4 flex flex-col items-center z-10">
        <Link href="/">
          <button className="bg-blue-500 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-blue-600 hover:scale-110 hover:shadow-xl transition-transform duration-300 w-full sm:w-auto">
            Back to Home
          </button>
        </Link>
        <Link href="/contact">
          <button className="bg-gray-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-700 hover:scale-110 hover:shadow-xl transition-transform duration-300 w-full sm:w-auto">
            Contact Us
          </button>
        </Link>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-sm text-gray-300 z-10 relative text-center">
        <p>
          For further updates, follow our <span className="text-blue-400 font-medium">blog</span> or <span className="text-blue-400 font-medium">news section</span>.
        </p>
      </footer>
    </div>
  );
}
