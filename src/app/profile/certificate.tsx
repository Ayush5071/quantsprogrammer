"use client";

import React, { useEffect, useState } from "react";
import Certificate from "@/components/component/Certificate";
import { useRouter, useSearchParams } from "next/navigation";

export default function CertificatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const roadmapId = searchParams.get("roadmapId");
  const [user, setUser] = useState<any>(null);
  const [roadmap, setRoadmap] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!userId || !roadmapId) return setLoading(false);
      try {
        const userRes = await fetch(`/api/users/${userId}`);
        const userData = await userRes.json();
        setUser(userData.user);
        const roadmapRes = await fetch(`/api/roadmap/${roadmapId}`);
        const roadmapData = await roadmapRes.json();
        setRoadmap(roadmapData.roadmap);
      } catch {
        setUser(null);
        setRoadmap(null);
      }
      setLoading(false);
    }
    fetchData();
  }, [userId, roadmapId]);

  if (loading) {
    return <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-zinc-200">Loading...</div>;
  }
  if (!user || !roadmap) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-zinc-200">
        <h1 className="text-3xl font-bold mb-4">Certificate Not Found</h1>
        <button onClick={() => router.back()} className="px-6 py-3 bg-blue-700 text-white rounded-xl mt-4">Back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 py-12 px-2">
      <button
        onClick={() => router.back()}
        className="fixed top-6 left-4 flex items-center gap-2 text-blue-400 hover:text-blue-300 hover:underline text-xl md:text-2xl px-6 py-3 rounded-2xl bg-zinc-900 shadow-lg border-2 border-blue-700 transition-all z-50"
        style={{ position: 'fixed', top: '1.5rem', left: '1rem', zIndex: 50 }}
      >
        <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        <span className="hidden sm:inline">Back</span>
      </button>
      <Certificate user={user} roadmap={roadmap} percent={100} />
    </div>
  );
}
