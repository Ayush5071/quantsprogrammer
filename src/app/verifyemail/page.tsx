"use client";

import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion"; // To apply animations to different UI elements

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
      {/* Starry Background */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        {[...Array(500)].map((_, index) => (
          <div
            key={index}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}vh`,
              left: `${Math.random() * 100}vw`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              opacity: Math.random(),
              animationDuration: `${Math.random() * 3 + 1}s`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Header Section */}
      <motion.h1
        className="text-4xl text-white font-extrabold mb-8 z-10 relative"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Email Verification
      </motion.h1>

      {/* Message Display (No Token or Token processing status) */}
      {token && !verified && (
        <motion.h2
          className="p-2 bg-yellow-500 text-black rounded-lg mb-6 z-10 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Verifying your email address...
        </motion.h2>
      )}

      {token && verified && (
        <motion.h2
          className="p-2 bg-green-500 text-white rounded-lg mb-6 z-10 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Your email is verified!
        </motion.h2>
      )}

      {token && !verified && !error && (
        <motion.h2
          className="p-2 bg-orange-500 text-black rounded-lg mb-6 z-10 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          We are validating Token..... resend if not verified in 2min
        </motion.h2>
      )}

      {/* Verification Results */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-4 z-10 relative"
      >
        {verified && (
          <div className="text-center">
            <motion.h2
              className="text-2xl text-green-500 font-bold"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Your Email has been Verified Successfully!
            </motion.h2>
            <Link href="/login">
              <motion.button
                className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
                whileHover={{ scale: 1.05 }}
              >
                Proceed to Login
              </motion.button>
            </Link>
          </div>
        )}

        {error && (
          <div className="text-center">
            <motion.h2
              className="text-2xl text-red-500 font-bold"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              There was an error verifying your email.
            </motion.h2>
            <motion.p
              className="text-lg text-gray-200 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Please try again later or contact support if the issue persists.
            </motion.p>
          </div>
        )}
      </motion.div>

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
