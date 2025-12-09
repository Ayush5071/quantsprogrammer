"use client";

import React from "react";

export default function NavrionSectionWrapper({
  id,
  children,
  className = "",
  hero = false,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  hero?: boolean;
}) {
  return (
    <section
      id={id}
      className={`relative w-full overflow-hidden bg-[#05050a] text-white ${className}`}
    >
      {/* --- DEPTH LAYERS (Premium Agency Look) --- */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#08080e] via-[#0a0a12] to-[#05050a] pointer-events-none" />



      {/* ---- CONTENT WRAPPER ---- */}
      <div className="relative z-10">{children}</div>

      {/* Animation Keys */}

    </section>
  );
}
