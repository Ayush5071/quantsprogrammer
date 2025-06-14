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
      <div ref={certRef} className="w-[700px] h-[500px] bg-white rounded-3xl shadow-2xl border-4 border-blue-700 flex flex-col items-center justify-center p-10 relative">
        <img src="/official_logo.png" alt="Quant Programmer Logo" className="w-24 h-24 absolute top-8 left-8" />
        <h1 className="text-4xl font-extrabold text-blue-800 mb-2 text-center">Certificate of Completion</h1>
        <p className="text-lg text-gray-700 mb-6 text-center">This is to certify that</p>
        <div className="text-3xl font-bold text-gray-900 mb-2 text-center">{user.fullName || user.username}</div>
        <p className="text-lg text-gray-700 mb-4 text-center">has successfully completed the roadmap</p>
        <div className="text-2xl font-semibold text-blue-700 mb-6 text-center">{roadmap.title}</div>
        <div className="flex flex-col items-center mt-4">
          <span className="text-base text-gray-600">Date: {new Date().toLocaleDateString()}</span>
          <span className="text-base text-gray-600 mt-2">Completion: 100%</span>
        </div>
        <div className="absolute bottom-8 right-8 flex flex-col items-end">
          <span className="text-lg font-semibold text-gray-800">Ayush (Quant Programmer)</span>
          <span className="text-xs text-gray-500">Program Director</span>
        </div>
      </div>
      <button
        onClick={handleDownload}
        className="mt-8 px-6 py-3 bg-blue-700 text-white rounded-xl text-lg font-semibold shadow hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all"
      >
        Download Certificate
      </button>
    </div>
  );
}
