
import React from "react";
import InterviewDashboard from "../../components/sections/InterviewDashboard";

export default function InterviewPage() {
  // Height of navbar is about 64px (py-3 + px-4 + border/shadow), add a bit more for safety
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#24243e]">
      <InterviewDashboard />
    </div>
  );
}
