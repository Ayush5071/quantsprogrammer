"use client";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function SignupPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
    username: "",
  });
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return false;
    }
    setPasswordError(null);
    return true;
  };

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      setEmailError("Please enter a valid email address.");
      return false;
    }
    setEmailError(null);
    return true;
  };

  // Memoized submit handler
  const onSignup = useCallback(async () => {
    if (!validatePassword(user.password) || !validateEmail(user.email)) return;
    if (user.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post("/api/users/signup", user);
      toast.success("Signup successful!");
      router.push("/auth/remindverify");
    } catch (error: any) {
      toast.error(error.message || "An error occurred during signup.");
    } finally {
      setLoading(false);
    }
  }, [user, validatePassword, validateEmail]);

  useEffect(() => {
    if (
      user.email.length > 0 &&
      user.password.length > 0 &&
      user.username.length > 0 &&
      !passwordError &&
      !emailError
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user, passwordError, emailError]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-black via-gray-900 to-black px-6 relative overflow-hidden">
      {/* Optimized Subtle Pattern Background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none" />
      {/* Glassmorphism Effect Signup Card */}
      <div className="max-w-md w-full p-12 bg-gradient-to-br from-zinc-900/80 via-blue-900/60 to-purple-900/70 backdrop-blur-2xl border border-blue-400/30 rounded-3xl shadow-2xl z-10 relative flex flex-col items-center animate-fade-in">
        {/* Logo/Icon */}
        <div className="mb-6 flex items-center justify-center">
          <svg className="w-14 h-14 text-blue-300 animate-spin-slow" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-20"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" className="opacity-60"/></svg>
        </div>
        <h1 className="text-4xl font-extrabold text-center text-white mb-8 drop-shadow-lg tracking-tight font-sans">{loading ? "Processing..." : "Signup"}</h1>
        <hr className="w-1/2 mx-auto mb-8 border-blue-400 opacity-20" />
        {/* Username Input */}
        <div className="mb-6 w-full">
          <label htmlFor="username" className="block text-base font-semibold text-blue-100 mb-3 tracking-wide">Username</label>
          <input
            className="p-4 w-full bg-white/90 text-blue-900 border border-blue-400/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-md font-medium placeholder:text-blue-400/60"
            id="username"
            type="text"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            placeholder="Enter your username"
            autoComplete="username"
          />
        </div>
        {/* Email Input */}
        <div className="mb-6 w-full">
          <label htmlFor="email" className="block text-base font-semibold text-blue-100 mb-3 tracking-wide">Email</label>
          <input
            className="p-4 w-full bg-white/90 text-blue-900 border border-blue-400/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-md font-medium placeholder:text-blue-400/60"
            id="email"
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder="Enter your email"
            onBlur={() => validateEmail(user.email)}
            autoComplete="email"
          />
          {emailError && <p className="text-sm text-red-400 mt-2">{emailError}</p>}
        </div>
        {/* Password Input */}
        <div className="mb-6 w-full">
          <label htmlFor="password" className="block text-base font-semibold text-blue-100 mb-3 tracking-wide">Password</label>
          <input
            className="p-4 w-full bg-white/90 text-blue-900 border border-blue-400/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-md font-medium placeholder:text-blue-400/60"
            id="password"
            type="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            placeholder="Enter your password"
            onBlur={() => validatePassword(user.password)}
            autoComplete="new-password"
          />
          {passwordError && <p className="text-sm text-red-400 mt-2">{passwordError}</p>}
        </div>
        {/* Signup Button */}
        <button
          onClick={onSignup}
          disabled={buttonDisabled}
          className={`w-full p-4 text-white rounded-xl font-bold text-lg transition-all duration-300 ease-in-out mt-2 mb-4 shadow-lg bg-gradient-to-r from-blue-700/90 to-purple-800/90 hover:from-blue-800 hover:to-purple-900 active:scale-95 focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 ${buttonDisabled ? "bg-gray-600 cursor-not-allowed" : ""}`}
        >
          {loading ? "Signing up..." : "Signup"}
        </button>
        {/* Link to login page */}
        <div className="mt-4 text-center w-full">
          <p className="text-blue-200 text-base font-medium">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-blue-400 hover:underline cursor-pointer font-semibold">Login here</Link>
          </p>
        </div>
        <footer className="mt-10 text-xs text-blue-200/80 text-center w-full flex flex-col gap-2 items-center">
          <div>
            Need help? <a href="/contact-support" className="text-blue-400 font-medium hover:underline">Contact support</a>
          </div>
          <div>
            <a href="/auth/forgotpassword" className="text-blue-400 hover:underline font-medium">Forgot password?</a>
            <span className="mx-2 text-blue-300">|</span>
            <a href="/auth/resendverification" className="text-blue-400 hover:underline font-medium">Resend verification</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
