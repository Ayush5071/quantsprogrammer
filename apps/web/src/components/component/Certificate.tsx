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

// Handwritten signature SVG component
const SignatureSVG = () => (
  <svg 
    viewBox="0 0 200 60" 
    className="w-36 h-12"
    style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.1))' }}
  >
    <defs>
      <linearGradient id="signatureGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{ stopColor: '#1e3a5f', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#2d5a87', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    {/* Stylized "Ayush Tiwari" signature path */}
    <path 
      d="M10 35 Q15 20 25 25 Q35 30 30 40 Q25 50 35 45 L45 35 
         Q50 30 55 35 Q60 40 65 30 L70 25 Q75 22 80 28 Q85 35 82 40 
         L90 25 Q95 20 100 30 Q102 35 105 30 
         M115 25 Q120 22 125 28 L130 35 Q132 40 138 30 
         Q142 25 148 30 Q155 35 158 28 
         M165 30 Q170 25 175 32 Q180 38 185 30 Q188 25 192 35"
      fill="none"
      stroke="url(#signatureGradient)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Underline flourish */}
    <path 
      d="M5 48 Q50 52 100 48 Q150 44 195 50"
      fill="none"
      stroke="url(#signatureGradient)"
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.6"
    />
  </svg>
);

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
      className="w-[800px] h-[600px] bg-gradient-to-br from-slate-50 via-white to-blue-50 rounded-lg shadow-2xl border-[3px] border-slate-800 flex flex-col items-center px-12 py-6 relative overflow-hidden"
    >
      {/* Elegant Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg width="100%" height="100%" className="absolute inset-0">
          <pattern id="elegantPattern" width="60" height="60" patternUnits="userSpaceOnUse">
            <circle cx="30" cy="30" r="1" fill="#1e3a5f"/>
            <path d="M0 30 L60 30 M30 0 L30 60" stroke="#1e3a5f" strokeWidth="0.5" opacity="0.5"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#elegantPattern)" />
        </svg>
      </div>

      {/* Double Border Frame */}
      <div className="absolute inset-3 border-2 border-slate-300 rounded pointer-events-none" />
      <div className="absolute inset-5 border border-slate-200 rounded pointer-events-none" />

      {/* Top Header Bar */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-slate-800 via-blue-700 to-slate-800" />

      {/* PrepSutra Logo/Header */}
      <div className="relative z-10 flex flex-col items-center mt-6 mb-4">
        <div className="flex items-center gap-3 mb-2">
          <img 
            src="/official_logo.png" 
            alt="PrepSutra Logo" 
            className="w-12 h-12 rounded-full object-contain shadow-lg"
          />
          <span className="text-3xl font-bold tracking-wide text-slate-800">PrepSutra</span>
        </div>
        <p className="text-xs text-slate-500 tracking-[0.3em] uppercase">www.prepsutra.tech</p>
      </div>

      {/* Certificate Title */}
      <div className="relative z-10 flex flex-col items-center mb-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-slate-400" />
          <h1 className="text-2xl font-bold text-slate-700 tracking-[0.2em] uppercase">
            Certificate of Excellence
          </h1>
          <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-slate-400" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center flex-1 justify-center -mt-2">
        <p className="text-sm text-slate-600 mb-2 text-center">This is to certify that</p>
        
        <div className="text-3xl font-bold text-slate-900 mb-2 text-center relative px-8">
          <span className="relative z-10">{displayName}</span>
          <div className="absolute bottom-1 left-4 right-4 h-2 bg-gradient-to-r from-yellow-200/60 via-yellow-300/60 to-yellow-200/60 -z-0 rounded-full" />
        </div>
        
        <p className="text-sm text-slate-600 mb-3 text-center">has successfully completed the certification for</p>
        
        <div className="text-xl font-bold text-blue-700 mb-4 text-center px-8 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 shadow-sm">
          {displayTitle}
        </div>

        {/* Stats Row */}
        <div className="flex flex-row items-center justify-center gap-8 bg-slate-50 px-8 py-3 rounded-lg border border-slate-200">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Date Issued</span>
            <span className="text-sm font-semibold text-slate-800">{displayDate}</span>
          </div>
          <div className="w-px h-8 bg-slate-300" />
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Score Achieved</span>
            <span className="text-sm font-semibold text-blue-700">{displayScore}/100 ({displayPercentage}%)</span>
          </div>
          <div className="w-px h-8 bg-slate-300" />
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Certificate ID</span>
            <span className="text-xs font-mono font-semibold text-slate-700">{certificateId}</span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Signature & Seal */}
      <div className="absolute bottom-8 left-12 right-12 flex items-end justify-between">
        {/* Decorative Seal */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 flex items-center justify-center shadow-lg border-2 border-white relative">
            <div className="absolute inset-1 rounded-full border border-dashed border-white/40" />
            <div className="flex flex-col items-center">
              <Award className="w-6 h-6 text-yellow-300" />
              <span className="text-[6px] text-white/90 font-semibold mt-0.5">VERIFIED</span>
            </div>
          </div>
          <span className="text-[10px] text-blue-700 mt-2 font-bold tracking-[0.15em]">PREPSUTRA</span>
        </div>

        {/* Footer Text */}
        <div className="flex flex-col items-center absolute left-1/2 -translate-x-1/2 bottom-0">
          <p className="text-[10px] text-slate-500 tracking-wider italic">Master the Art of Development</p>
        </div>

        {/* Signature */}
        <div className="flex flex-col items-center">
          <SignatureSVG />
          <div className="w-32 h-[1px] bg-slate-400 mt-1 mb-1" />
          <span className="text-xs text-slate-700 font-medium">Ayush Tiwari</span>
          <span className="text-[10px] text-slate-500">Founder & Director</span>
        </div>
      </div>

      {/* Bottom Border Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-slate-800 via-blue-700 to-slate-800" />
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
