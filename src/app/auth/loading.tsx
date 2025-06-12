import React from "react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400 mb-8"></div>
      <p className="text-white text-xl font-semibold">Loading...</p>
      <p className="text-blue-300 mt-2">Preparing your space journey...</p>
    </div>
  );
}