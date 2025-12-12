import React, { useRef } from "react";
import html2canvas from "html2canvas";
import { X, Download, Award } from "lucide-react";

interface CertificateProps {
  user: any;
  roadmap?: any;
  percent?: number;
  // New props for certification data
  certification?: {
    roadmapTitle: string;
    certificateId: string;
    score: number;
    percentage: number;
    mcqScore?: number;
    shortAnswerScore?: number;
    issuedAt: string;
    userName: string;
  };
  isModal?: boolean;
  onClose?: () => void;
}

import SignaturePlaceholder from "@/components/component/SignaturePlaceholder";

export default function Certificate({ 
  user, 
  roadmap, 
  percent, 
  certification,
  isModal = false,
  onClose 
}: CertificateProps) {
  const certRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!certRef.current) return;
    const canvas = await html2canvas(certRef.current, {
      scale: 2,
      backgroundColor: null,
      useCORS: true,
    });
    const link = document.createElement("a");
    const title = certification?.roadmapTitle || roadmap?.title || "certificate";
    link.download = `certificate-${title.replace(/\s+/g, "-").toLowerCase()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const displayName = certification?.userName || user?.fullName || user?.username || "Student";
  const displayTitle = certification?.roadmapTitle || roadmap?.title || "Roadmap";
  const displayScore = certification?.score || 100;
  const displayPercentage = certification?.percentage || percent || 100;
  const displayDate = certification?.issuedAt 
    ? new Date(certification.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const certificateId = certification?.certificateId || `PS-${Date.now().toString(36).toUpperCase()}`;

  const CertificateContent = () => (
    <div 
      ref={certRef} 
      className="max-w-[850px] w-full min-h-[620px] bg-gradient-to-br from-slate-50 via-white to-blue-50 rounded-xl shadow-2xl border-4 border-slate-800 flex flex-col items-center px-8 md:px-14 py-8 relative overflow-hidden"
    >
      {/* Elegant Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <svg width="100%" height="100%" className="absolute inset-0">
          <pattern id="elegantPattern" width="50" height="50" patternUnits="userSpaceOnUse">
            <circle cx="25" cy="25" r="1" fill="#1e3a5f"/>
            <path d="M0 25 L50 25 M25 0 L25 50" stroke="#1e3a5f" strokeWidth="0.3" opacity="0.5"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#elegantPattern)" />
        </svg>
      </div>

      {/* Golden corner decorations */}
      <div className="absolute top-5 left-5 w-16 h-16 border-t-3 border-l-3 border-blue-600/50 rounded-tl-lg" />
      <div className="absolute top-5 right-5 w-16 h-16 border-t-3 border-r-3 border-blue-600/50 rounded-tr-lg" />
      <div className="absolute bottom-5 left-5 w-16 h-16 border-b-3 border-l-3 border-blue-600/50 rounded-bl-lg" />
      <div className="absolute bottom-5 right-5 w-16 h-16 border-b-3 border-r-3 border-blue-600/50 rounded-br-lg" />

      {/* Top Header Bar */}
      <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-slate-800 via-blue-700 to-slate-800" />

      {/* PrepSutra Logo/Header */}
      <div className="relative z-10 flex flex-col items-center mt-4 mb-3">
        <div className="flex items-center gap-4 mb-2">
          <img 
            src="/official_logo.png" 
            alt="PrepSutra Logo" 
            className="w-14 h-14 rounded-full object-contain shadow-lg border-2 border-slate-200"
          />
          <span className="text-4xl font-bold tracking-wide text-slate-800">PrepSutra</span>
        </div>
        <p className="text-xs text-slate-500 tracking-[0.4em] uppercase font-medium">www.prepsutra.tech</p>
      </div>

      {/* Certificate Title */}
      <div className="relative z-10 flex flex-col items-center mb-5">
        <div className="flex items-center gap-5">
          <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-blue-600/60 to-transparent" />
          <h1 className="text-2xl font-bold text-slate-800 tracking-[0.2em] uppercase">
            Certificate of Excellence
          </h1>
          <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-blue-600/60 to-transparent" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center flex-1 justify-center">
        <p className="text-base text-slate-600 mb-3 text-center">This is to certify that</p>
        
        <div className="text-4xl font-bold text-slate-900 mb-3 text-center relative px-6 w-full max-w-[720px] mx-auto break-words">
          <span className="relative z-10 block">{displayName}</span>
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-[78%] h-3 bg-gradient-to-r from-yellow-200/70 via-yellow-300/70 to-yellow-200/70 -z-0 rounded-full" />
        </div>
        
        <p className="text-base text-slate-600 mb-4 text-center">has successfully completed the certification for</p>
        
        <div className="text-2xl font-bold text-blue-700 mb-5 text-center px-6 py-3 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 rounded-xl border border-blue-200 shadow-sm max-w-[80%] mx-auto break-words whitespace-normal">
          {displayTitle}
        </div>

        {/* Stats Row */}
        <div className="flex flex-row items-center justify-center gap-10 bg-slate-50/80 px-10 py-4 rounded-xl border border-slate-200 shadow-inner">
          <div className="flex flex-col items-center">
            <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-1">Date Issued</span>
            <span className="text-sm font-bold text-slate-800">{displayDate}</span>
          </div>
          <div className="w-px h-10 bg-slate-300" />
          <div className="flex flex-col items-center">
            <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-1">Score Achieved</span>
            <span className="text-sm font-bold text-green-600">{displayScore}/100 ({displayPercentage}%)</span>
          </div>
          <div className="w-px h-10 bg-slate-300" />
          <div className="flex flex-col items-center">
            <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-1">Certificate ID</span>
            <span className="text-sm font-mono font-bold text-slate-700">{certificateId}</span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Signature & Seal */}
      <div className="absolute bottom-12 left-8 right-8 flex items-center justify-between">
        {/* Decorative Seal */}
        <div className="flex-shrink-0 flex flex-col items-center mr-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 flex items-center justify-center shadow-xl border-3 border-white relative">
            <div className="absolute inset-1.5 rounded-full border-2 border-dashed border-white/40" />
            <div className="flex flex-col items-center">
              <Award className="w-7 h-7 text-yellow-300" />
              <span className="text-[7px] text-white/90 font-bold mt-0.5 tracking-wider">VERIFIED</span>
            </div>
          </div>
          <span className="text-[11px] text-blue-700 mt-2 font-bold tracking-[0.2em]">PREPSUTRA</span>
        </div>

        {/* Footer Text (center) */}
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[11px] text-slate-500 tracking-widest italic font-medium">Master the Art of Development</p>
        </div>

        {/* Signature */}
        <div className="flex-shrink-0 flex flex-col items-center text-center ml-6">
          <SignaturePlaceholder />
          <div className="w-36 h-[1.5px] bg-gradient-to-r from-transparent via-slate-400 to-transparent mt-1 mb-2" />
          <span className="text-sm text-slate-800 font-bold">Authorized Signatory</span>
          <span className="text-[11px] text-slate-500 font-medium">PrepSutra</span>
        </div>
      </div>

      {/* Bottom Border Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-slate-800 via-blue-700 to-slate-800" />
    </div>
  );

  // Modal wrapper
  if (isModal && onClose) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="relative max-w-[850px] w-full">
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
                className="mt-6 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-lg font-semibold shadow-lg hover:from-blue-500 hover:to-indigo-500 transition-all flex items-center gap-2"
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
        className="mt-8 px-8 py-3 bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-2xl text-xl font-bold shadow-lg hover:from-blue-800 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all flex items-center gap-2"
      >
        <Download className="w-5 h-5" />
        Download Certificate
      </button>
    </div>
  );
}
