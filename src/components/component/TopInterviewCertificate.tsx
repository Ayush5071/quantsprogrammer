"use client";

import React, { useRef } from "react";
import html2canvas from "html2canvas";
import { X, Download, Trophy, Crown, Medal, Award } from "lucide-react";

interface TopInterviewCertificateProps {
  userName: string;
  interviewTitle: string;
  company: string;
  rank: number;
  score: number;
  certificateId: string;
  issuedAt: string;
  isModal?: boolean;
  onClose?: () => void;
}

// Professional handwritten-style signature for "Ayush Tiwari"
const AyushTiwariSignature = () => (
  <svg 
    viewBox="0 0 220 70" 
    className="w-44 h-16"
    style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.08))' }}
  >
    <defs>
      <linearGradient id="signGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{ stopColor: '#1e3a5f', stopOpacity: 1 }} />
        <stop offset="50%" style={{ stopColor: '#2d4a6f', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#1e3a5f', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    
    {/* "Ayush" - flowing script */}
    <path 
      d="M8 42 
         Q10 25 18 28 Q28 32 22 42 Q18 50 28 48 L35 42 
         Q38 38 42 42 Q46 48 44 52 
         L52 30 Q54 25 58 30 L56 48 Q58 52 64 48 
         L68 38 Q70 32 74 35 Q78 38 76 45 Q74 52 80 48 
         L86 35 Q90 28 94 35 Q98 42 95 50"
      fill="none"
      stroke="url(#signGradient)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    
    {/* "Tiwari" - flowing script */}
    <path 
      d="M108 25 L108 50 
         M102 32 L116 32 
         M122 35 Q124 32 126 35 L126 48 
         M132 32 Q136 28 142 32 Q148 38 145 48 Q140 55 134 50 
         M150 35 Q154 28 162 32 Q168 38 165 48 Q160 55 154 50 
         M172 35 Q174 32 176 35 L176 48 
         M172 30 Q174 28 176 30"
      fill="none"
      stroke="url(#signGradient)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    
    {/* Decorative underline flourish */}
    <path 
      d="M5 58 Q50 62 110 56 Q170 50 215 58"
      fill="none"
      stroke="url(#signGradient)"
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.5"
    />
  </svg>
);

// Rank badge component
const RankBadge = ({ rank }: { rank: number }) => {
  const getColors = () => {
    if (rank === 1) return { bg: "from-yellow-400 to-amber-500", text: "text-yellow-900", icon: Crown };
    if (rank === 2) return { bg: "from-gray-300 to-slate-400", text: "text-gray-800", icon: Medal };
    return { bg: "from-amber-500 to-orange-600", text: "text-amber-900", icon: Award };
  };
  
  const { bg, text, icon: Icon } = getColors();
  const rankText = rank === 1 ? "1ST" : rank === 2 ? "2ND" : "3RD";
  
  return (
    <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${bg} flex flex-col items-center justify-center shadow-lg border-4 border-white`}>
      <Icon className={`w-6 h-6 ${text}`} />
      <span className={`text-xs font-bold ${text} mt-0.5`}>{rankText}</span>
    </div>
  );
};

export default function TopInterviewCertificate({
  userName,
  interviewTitle,
  company,
  rank,
  score,
  certificateId,
  issuedAt,
  isModal = false,
  onClose
}: TopInterviewCertificateProps) {
  const certRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!certRef.current) return;
    const canvas = await html2canvas(certRef.current, {
      scale: 3,
      backgroundColor: null,
      useCORS: true,
    });
    const link = document.createElement("a");
    link.download = `top-interview-certificate-${interviewTitle.replace(/\s+/g, "-").toLowerCase()}-rank${rank}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const getRankTitle = () => {
    if (rank === 1) return "First Place";
    if (rank === 2) return "Second Place";
    return "Third Place";
  };

  const displayDate = new Date(issuedAt).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const CertificateContent = () => (
    <div 
      ref={certRef} 
      className="w-[850px] h-[620px] bg-gradient-to-br from-slate-50 via-white to-indigo-50 rounded-xl shadow-2xl border-4 border-slate-800 flex flex-col items-center px-10 py-6 relative overflow-hidden"
    >
      {/* Elegant Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg width="100%" height="100%" className="absolute inset-0">
          <pattern id="elegantGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="1" fill="#1e3a5f"/>
            <path d="M0 20 L40 20 M20 0 L20 40" stroke="#1e3a5f" strokeWidth="0.3" opacity="0.5"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#elegantGrid)" />
        </svg>
      </div>

      {/* Golden decorative corners */}
      <div className="absolute top-4 left-4 w-20 h-20 border-t-4 border-l-4 border-yellow-500/60 rounded-tl-lg" />
      <div className="absolute top-4 right-4 w-20 h-20 border-t-4 border-r-4 border-yellow-500/60 rounded-tr-lg" />
      <div className="absolute bottom-4 left-4 w-20 h-20 border-b-4 border-l-4 border-yellow-500/60 rounded-bl-lg" />
      <div className="absolute bottom-4 right-4 w-20 h-20 border-b-4 border-r-4 border-yellow-500/60 rounded-br-lg" />

      {/* Top Gradient Bar */}
      <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500" />

      {/* PrepSutra Logo/Header */}
      <div className="relative z-10 flex flex-col items-center mt-6 mb-3">
        <div className="flex items-center gap-3 mb-2">
          <img 
            src="/official_logo.png" 
            alt="PrepSutra Logo" 
            className="w-14 h-14 rounded-full object-contain shadow-lg border-2 border-slate-200"
          />
          <span className="text-3xl font-bold tracking-wide text-slate-800">PrepSutra</span>
        </div>
        <p className="text-xs text-slate-500 tracking-[0.3em] uppercase">www.prepsutra.tech</p>
      </div>

      {/* Trophy Icon */}
      <div className="relative z-10 mb-2">
        <Trophy className="w-10 h-10 text-yellow-500" />
      </div>

      {/* Certificate Title */}
      <div className="relative z-10 flex flex-col items-center mb-3">
        <div className="flex items-center gap-4">
          <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />
          <h1 className="text-2xl font-bold text-slate-800 tracking-[0.15em] uppercase">
            Certificate of Achievement
          </h1>
          <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />
        </div>
        <p className="text-sm text-yellow-600 font-semibold mt-1">{getRankTitle()} Winner</p>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center flex-1 justify-center -mt-2">
        <p className="text-sm text-slate-600 mb-2 text-center">This is to certify that</p>
        
        <div className="text-3xl font-bold text-slate-900 mb-2 text-center relative px-10">
          <span className="relative z-10">{userName}</span>
          <div className="absolute bottom-1 left-4 right-4 h-3 bg-gradient-to-r from-yellow-200/70 via-amber-300/70 to-yellow-200/70 -z-0 rounded-full" />
        </div>
        
        <p className="text-sm text-slate-600 mb-3 text-center">
          has achieved <span className="font-bold text-yellow-600">{getRankTitle()}</span> in the Top Interview Challenge
        </p>
        
        <div className="text-xl font-bold text-blue-700 mb-4 text-center px-8 py-3 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 rounded-xl border border-blue-200 shadow-sm">
          <span className="block text-xs text-slate-500 mb-1 font-normal uppercase tracking-wider">{company}</span>
          {interviewTitle}
        </div>

        {/* Stats Row */}
        <div className="flex flex-row items-center justify-center gap-6 bg-slate-50 px-8 py-4 rounded-xl border border-slate-200 shadow-inner">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Date Issued</span>
            <span className="text-sm font-semibold text-slate-800">{displayDate}</span>
          </div>
          <div className="w-px h-10 bg-slate-300" />
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Final Score</span>
            <span className="text-sm font-bold text-green-600">{score}/100</span>
          </div>
          <div className="w-px h-10 bg-slate-300" />
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Rank Achieved</span>
            <span className="text-sm font-bold text-yellow-600">{getRankTitle()}</span>
          </div>
          <div className="w-px h-10 bg-slate-300" />
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Certificate ID</span>
            <span className="text-xs font-mono font-semibold text-slate-700">{certificateId}</span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Rank Badge & Signature */}
      <div className="absolute bottom-10 left-12 right-12 flex items-end justify-between">
        {/* Rank Badge */}
        <div className="flex flex-col items-center">
          <RankBadge rank={rank} />
          <span className="text-[10px] text-slate-600 mt-2 font-semibold tracking-wider uppercase">Rank</span>
        </div>

        {/* Footer Text */}
        <div className="flex flex-col items-center absolute left-1/2 -translate-x-1/2 bottom-0">
          <p className="text-[10px] text-slate-500 tracking-wider italic">Compete • Excel • Achieve</p>
        </div>

        {/* Signature */}
        <div className="flex flex-col items-center">
          <AyushTiwariSignature />
          <div className="w-36 h-[1px] bg-slate-400 mt-1 mb-1" />
          <span className="text-sm text-slate-800 font-semibold">Ayush Tiwari</span>
          <span className="text-[10px] text-slate-500">Founder & Director</span>
        </div>
      </div>

      {/* Bottom Gradient Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500" />
    </div>
  );

  // Modal wrapper
  if (isModal && onClose) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="relative max-w-[900px] w-full">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute -top-12 right-0 p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Certificate */}
          <div className="overflow-auto max-h-[85vh] rounded-2xl">
            <div className="flex flex-col items-center">
              <CertificateContent />
              
              {/* Download button */}
              <button
                onClick={handleDownload}
                className="mt-6 px-8 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-xl text-lg font-semibold shadow-lg hover:from-yellow-400 hover:to-amber-400 transition-all flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download Certificate
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Regular view (non-modal)
  return (
    <div className="flex flex-col items-center justify-center">
      <CertificateContent />
      <button
        onClick={handleDownload}
        className="mt-8 px-8 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-2xl text-xl font-bold shadow-lg hover:from-yellow-400 hover:to-amber-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition-all flex items-center gap-2"
      >
        <Download className="w-6 h-6" />
        Download Certificate
      </button>
    </div>
  );
}
