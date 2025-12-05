"use client";

import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [token, setToken] = useState<string>("");
  const [verified, setVerified] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const verifyUserEmail = async () => {
    try {
      await axios.post("/api/users/verifyemail", { token });
      setVerified(true);
      setLoading(false);
    } catch (error: any) {
      setError(true);
      setLoading(false);
      console.error(error.response?.data || "Error occurred while verifying email.");
    }
  };

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    setToken(urlToken || "");
  }, []);

  useEffect(() => {
    if (token.length > 0) {
      verifyUserEmail();
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] p-4">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-950/40 via-[#0a0a0f] to-[#0a0a0f]" />
      <div className="fixed top-1/4 left-1/4 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl" />
      <div className="fixed bottom-1/4 right-1/4 w-56 h-56 bg-indigo-600/8 rounded-full blur-3xl" />

      {/* Back Button */}
      <button
        onClick={() => router.push("/")}
        className="fixed top-4 right-4 z-50 flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-md transition-all"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
        <span className="hidden sm:inline">Close</span>
      </button>

      {/* Card */}
      <div className="relative w-full max-w-[360px] bg-[#111118] border border-white/10 rounded-xl p-6 sm:p-8 shadow-2xl text-center">
        {loading && token ? (
          <>
            {/* Loading State */}
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
              <svg className="w-7 h-7 text-yellow-400 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-white mb-2">Verifying Email</h1>
            <p className="text-sm text-gray-400">Please wait while we verify your email address...</p>
          </>
        ) : verified ? (
          <>
            {/* Success State */}
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
              <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-white mb-2">Email Verified!</h1>
            <p className="text-sm text-gray-400 mb-6">Your email has been successfully verified. You can now log in.</p>
            <Link
              href="/auth/login"
              className="block w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-medium rounded-lg transition-all active:scale-[0.98]"
            >
              Go to Login
            </Link>
          </>
        ) : error ? (
          <>
            {/* Error State */}
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-500/20 to-rose-500/20 flex items-center justify-center">
              <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-white mb-2">Verification Failed</h1>
            <p className="text-sm text-gray-400 mb-6">The verification link is invalid or has expired.</p>
            <div className="space-y-3">
              <Link
                href="/auth/resendverification"
                className="block w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-medium rounded-lg transition-all"
              >
                Resend Verification
              </Link>
              <Link
                href="/auth/login"
                className="block w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-sm font-medium rounded-lg transition-all"
              >
                Back to Login
              </Link>
            </div>
          </>
        ) : (
          <>
            {/* No Token State */}
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-500/20 to-slate-500/20 flex items-center justify-center">
              <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-white mb-2">No Token Found</h1>
            <p className="text-sm text-gray-400 mb-6">Please use the verification link sent to your email.</p>
            <Link
              href="/auth/resendverification"
              className="block w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-medium rounded-lg transition-all"
            >
              Resend Verification Email
            </Link>
          </>
        )}

        <p className="text-[10px] text-gray-600 mt-5">
          Need help? <Link href="/contact-support" className="text-blue-400 hover:text-blue-300">Contact support</Link>
        </p>
      </div>
    </div>
  );
}
