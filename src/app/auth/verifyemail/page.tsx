"use client";

import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion"; // To apply animations to different UI elements
import { useMemo } from "react";

export default function VerifyEmailPage() {
  const [token, setToken] = useState<string>("");
  const [verified, setVerified] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const verifyUserEmail = async () => {
    try {
      await axios.post("/api/users/verifyemail", { token });
      setVerified(true); // Set verification status
    } catch (error: any) {
      setError(true); // Handle error
      console.error(error.response?.data || "Error occurred while verifying email.");
    }
  };

  useEffect(() => {
    // Extract token from the URL if present
    const urlToken = window.location.search.split("=")[1];
    setToken(urlToken || "");
  }, []);

  useEffect(() => {
    if (token.length > 0) {
      verifyUserEmail(); // Trigger verification when the token is available
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-black via-gray-900 to-black py-12 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Optimized Subtle Pattern Background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none" />
      {/* Glassmorphism Effect Verify Email Card */}
      <div className="max-w-md w-full p-12 bg-gradient-to-br from-zinc-900/80 via-blue-900/60 to-purple-900/70 backdrop-blur-2xl border border-blue-400/30 rounded-3xl shadow-2xl z-10 relative flex flex-col items-center animate-fade-in">
        {/* Logo/Icon */}
        <div className="mb-6 flex items-center justify-center">
          <svg className="w-14 h-14 text-blue-300 animate-spin-slow" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-20"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" className="opacity-60"/></svg>
        </div>
        <h1 className="text-4xl font-extrabold text-center text-white mb-8 drop-shadow-lg tracking-tight font-sans">Email Verification</h1>
        <hr className="w-1/2 mx-auto mb-8 border-blue-400 opacity-20" />
        {/* Verification Results */}
        <div className="space-y-6 w-full">
          {token && !verified && (
            <div className="p-3 bg-yellow-500/80 text-black rounded-lg mb-6 text-center font-semibold">Verifying your email address...</div>
          )}
          {token && verified && (
            <div className="p-3 bg-green-500/80 text-white rounded-lg mb-6 text-center font-semibold">Your email is verified!</div>
          )}
          {token && !verified && !error && (
            <div className="p-3 bg-orange-500/80 text-black rounded-lg mb-6 text-center font-semibold">We are validating Token..... resend if not verified in 2min</div>
          )}
          {verified && (
            <div className="text-center">
              <h2 className="text-2xl text-green-500 font-bold mb-4">Your Email has been Verified Successfully!</h2>
              <a href="/auth/login">
                <button className="mt-4 bg-gradient-to-r from-blue-700/90 to-purple-800/90 text-white py-3 px-8 rounded-xl shadow-lg hover:from-blue-800 hover:to-purple-900 transition duration-200 font-semibold">Proceed to Login</button>
              </a>
            </div>
          )}
        </div>
        <footer className="mt-10 text-xs text-blue-200/80 text-center w-full">
          Need help? <a href="/contact-support" className="text-blue-400 font-medium hover:underline">Contact support</a>.
        </footer>
      </div>

      {/* Footer Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 text-center text-gray-300 text-sm z-10 relative"
      >
        <p>If you did not request verification, ignore this email.</p>
      </motion.div>
    </div>
  );
}
