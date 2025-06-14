import React, { useRef } from "react";
import html2canvas from "html2canvas";

export default function Certificate({ user, roadmap, percent }: { user: any, roadmap: any, percent: number }) {
  const certRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!certRef.current) return;
    const canvas = await html2canvas(certRef.current);
    const link = document.createElement("a");
    link.download = `certificate-${roadmap.title}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div ref={certRef} className="w-[750px] h-[540px] bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-[40px] shadow-2xl border-[6px] border-blue-700 flex flex-col items-center justify-center px-16 py-10 relative overflow-hidden">
        {/* Decorative Borders */}
        <div className="absolute inset-0 pointer-events-none">
          <svg width="100%" height="100%" className="absolute inset-0" style={{zIndex:0}}>
            <rect x="10" y="10" width="97%" height="93%" rx="32" fill="none" stroke="#2563eb" strokeWidth="3" strokeDasharray="12 8" />
          </svg>
        </div>
        {/* Ribbon */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-10 bg-gradient-to-r from-blue-700 to-blue-400 rounded-b-2xl flex items-center justify-center shadow-lg z-10">
          <span className="text-white text-xl font-bold tracking-widest drop-shadow">ACHIEVEMENT</span>
        </div>
        <h1 className="text-5xl font-extrabold text-blue-800 mb-2 text-center mt-8 tracking-wide drop-shadow">Certificate of Completion</h1>
        <p className="text-lg text-gray-700 mb-6 text-center italic">This is to certify that</p>
        <div className="text-4xl font-bold text-gray-900 mb-2 text-center underline decoration-blue-400 decoration-4 underline-offset-8">{user.fullName || user.username}</div>
        <p className="text-lg text-gray-700 mb-4 text-center">has successfully completed the roadmap</p>
        <div className="text-2xl font-semibold text-blue-700 mb-6 text-center">{roadmap.title}</div>
        <div className="flex flex-row items-center justify-center gap-8 mt-4">
          <div className="flex flex-col items-center">
            <span className="text-base text-gray-600">Date</span>
            <span className="text-lg font-medium text-gray-800">{new Date().toLocaleDateString()}</span>
          </div>
          <div className="w-1 h-10 bg-blue-200 rounded-full" />
          <div className="flex flex-col items-center">
            <span className="text-base text-gray-600">Completion</span>
            <span className="text-lg font-medium text-blue-700">100%</span>
          </div>
        </div>
        {/* Signature */}
        <div className="absolute bottom-8 right-12 flex flex-col items-end">
          <span className="text-lg font-semibold text-gray-800">AYUSH TIWARI</span>
          <span className="text-xs text-gray-500">Issuer</span>
          <div className="w-24 h-1 bg-blue-300 mt-1 rounded-full" />
        </div>
        {/* Decorative Seal */}
        <div className="absolute bottom-8 left-12 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-300 flex items-center justify-center shadow-lg border-4 border-white">
            <span className="text-white text-2xl font-extrabold tracking-widest">✓</span>
          </div>
          <span className="text-xs text-blue-700 mt-1 font-semibold tracking-wide">VERIFIED</span>
        </div>
      </div>
      <button
        onClick={handleDownload}
        className="mt-8 px-8 py-3 bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-2xl text-xl font-bold shadow-lg hover:from-blue-800 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all"
      >
        Download Certificate
      </button>
    </div>
  );
}
