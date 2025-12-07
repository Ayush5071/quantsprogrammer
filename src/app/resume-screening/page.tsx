"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function ResumeScreeningPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to bulk screening page
    router.replace("/resume-screening/bulk");
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="text-gray-400 text-sm">Redirecting to AI Resume Screening...</p>
      </div>
    </div>
  );
}
