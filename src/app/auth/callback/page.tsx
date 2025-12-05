"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function AuthCallback() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session?.accessToken && !synced) {
      // Sync token to localStorage and cookie
      localStorage.setItem("token", session.accessToken);
      document.cookie = `token=${session.accessToken}; path=/; max-age=86400; SameSite=Lax`;
      
      setSynced(true);
      toast.success("Signed in successfully!");
      
      // Small delay to ensure cookie is set
      setTimeout(() => {
        router.push("/");
      }, 500);
    } else if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [session, status, router, synced]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white text-lg font-medium mb-2">Completing sign in...</p>
        <p className="text-gray-500 text-sm">Please wait while we set up your session</p>
      </div>
    </div>
  );
}
