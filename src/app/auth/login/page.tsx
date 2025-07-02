"use client";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return false;
    }
    setPasswordError(null);
    return true;
  };

  // Memoized login handler
  const onLogin = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (!validatePassword(user.password)) {
        return;
      }

      try {
        setLoading(true);
        toast.dismiss();

        const response = await axios.post(
          "/api/users/login",
          user,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        // console.log("Login success:", response.data);

        toast.success("Login successful! Redirecting...");
        // Token is already set as httpOnly cookie by the API
        // localStorage.setItem("token", response.data.token);
        router.push("/");
      } catch (error: any) {
        console.error("Login failed:", error.response?.data?.error || error.message);

        toast.error(error.response?.data?.error || "An error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  useEffect(() => {
    if (user.email.trim() && user.password.trim()) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black px-6 relative overflow-hidden">
      {/* Optimized Subtle Pattern Background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none" />

      {/* Glassmorphism Effect Login Card */}
      <div className="max-w-md w-full p-12 bg-gradient-to-br from-zinc-900/80 via-blue-900/60 to-purple-900/70 backdrop-blur-2xl border border-blue-400/30 rounded-3xl shadow-2xl z-10 relative flex flex-col items-center animate-fade-in">
        {/* Logo/Icon */}
        <div className="mb-6 flex items-center justify-center">
          <svg className="w-14 h-14 text-blue-300 animate-spin-slow" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-20"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" className="opacity-60"/></svg>
        </div>
        <h1 className="text-4xl font-extrabold text-center text-white mb-8 drop-shadow-lg tracking-tight font-sans">{loading ? "Processing..." : "Login"}</h1>
        <hr className="w-1/2 mx-auto mb-8 border-blue-400 opacity-20" />
        <form autoComplete="off" className="space-y-8 w-full">
          <div className="mb-6 w-full">
            <label htmlFor="email" className="block text-base font-semibold text-blue-100 mb-3 tracking-wide">Email Address</label>
            <input
              className="p-4 w-full bg-white/90 text-blue-900 border border-blue-400/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-md font-medium placeholder:text-blue-400/60"
              id="email"
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              placeholder="your@email.com"
              autoComplete="email"
            />
          </div>
          <div className="mb-6 w-full">
            <label htmlFor="password" className="block text-base font-semibold text-blue-100 mb-3 tracking-wide">Password</label>
            <input
              className="p-4 w-full bg-white/90 text-blue-900 border border-blue-400/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-md font-medium placeholder:text-blue-400/60"
              id="password"
              type="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
            {passwordError && <p className="text-sm text-red-400 mt-2">{passwordError}</p>}
          </div>
          <button
            onClick={onLogin}
            disabled={buttonDisabled}
            className={`w-full p-4 text-white rounded-xl font-bold text-lg transition-all duration-300 ease-in-out mt-2 mb-4 shadow-lg bg-gradient-to-r from-blue-700/90 to-purple-800/90 hover:from-blue-800 hover:to-purple-900 active:scale-95 focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 ${buttonDisabled ? "bg-gray-600 cursor-not-allowed" : ""}`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="flex flex-col gap-2 w-full mt-2">
          <Link href="/auth/forgotpassword" className="text-blue-400 hover:underline text-center text-base font-semibold">Forgot password?</Link>
          <p className="text-center text-blue-200 text-base font-medium mt-2">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-blue-400 hover:underline cursor-pointer font-semibold">Sign up</Link>
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
