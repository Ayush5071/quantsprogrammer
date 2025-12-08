"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export function useGoogleAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Sync token when session is available
  useEffect(() => {
    if (status === "authenticated" && session) {
      // Get the JWT token from session (created by authOptions.ts jwt callback)
      const tokenToUse = session.accessToken;
      
      if (tokenToUse) {
        // Store token in localStorage
        localStorage.setItem("token", tokenToUse);
        
        // Store token in cookie
        document.cookie = `token=${tokenToUse}; path=/; max-age=86400; SameSite=Lax`;
        
        console.log('[useGoogleAuth] Token synced:', {
          tokenLength: tokenToUse.length,
          isJWT: tokenToUse.includes('.') && tokenToUse.split('.').length === 3
        });
      }
    }
  }, [session, status]);

  const signInWithGoogle = useCallback(async () => {
    try {
      // Use redirect: true for proper OAuth flow
      await signIn("google", { 
        callbackUrl: "/auth/callback",
      });
    } catch (error) {
      console.error("Google sign in error:", error);
      toast.error("Failed to sign in with Google");
    }
  }, []);

  return {
    signInWithGoogle,
    session,
    status,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
  };
}

export default useGoogleAuth;
