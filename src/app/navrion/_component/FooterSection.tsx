import React from "react";

export default function FooterSection() {
  return (
    <footer className="w-full px-4 py-8 bg-[#05050a] border-t border-white/10 text-center text-xs text-gray-400">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>© {new Date().getFullYear()} NAVRION. All rights reserved.</span>
        <span>
          Made with <span className="text-yellow-400">♥</span> by NAVRION Team
        </span>
      </div>
    </footer>
  );
}
