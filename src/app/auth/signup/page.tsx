"use client";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const router = useRouter();
  const [user, setUser] = useState({ email: "", password: "", username: "" });
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const onSignup = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(user.email)) {
        toast.error("Please enter a valid email");
        return;
      }
      if (user.password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }
      try {
        setLoading(true);
        toast.dismiss();
        const response = await axios.post("/api/users/signup", user);
        toast.success(response.data.message || "Account created!");
        router.push("/auth/remindverify");
      } catch (error: any) {
        if (error.code === 'ERR_NETWORK' || !error.response) {
          toast.error("Network error. Check your connection.");
        } else {
          toast.error(error.response?.data?.error || "Registration failed.");
        }
      } finally {
        setLoading(false);
      }
    },
    [user, router]
  );

  useEffect(() => {
    setButtonDisabled(!(user.email.trim() && user.password.trim() && user.username.trim()));
  }, [user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] p-4">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-950/40 via-[#0a0a0f] to-[#0a0a0f]" />
      <div className="fixed top-0 left-1/4 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl" />
      <div className="fixed bottom-0 right-1/4 w-56 h-56 bg-indigo-600/8 rounded-full blur-3xl" />

      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="fixed top-4 right-4 z-50 flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-md transition-all"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="hidden sm:inline">Back</span>
      </button>

      {/* Card */}
      <div className="relative w-full max-w-[340px] bg-[#111118] border border-white/10 rounded-xl p-5 sm:p-6 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-5">
          <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-lg font-semibold text-white">Create account</h1>
          <p className="text-xs text-gray-500 mt-0.5">Join us to get started</p>
        </div>

        {/* Form */}
        <form onSubmit={onSignup} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Username</label>
            <input
              type="text"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              placeholder="johndoe"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Email</label>
            <input
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              placeholder="you@example.com"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Password</label>
            <input
              type="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              placeholder="••••••••"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
            />
            <p className="text-[10px] text-gray-600 mt-1">Minimum 6 characters</p>
          </div>

          <button
            type="submit"
            disabled={buttonDisabled || loading}
            className="w-full py-2 mt-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-all active:scale-[0.98]"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-[#111118] text-gray-500">or continue with</span>
          </div>
        </div>

        {/* Google Sign Up */}
        <button
          type="button"
          onClick={() => {
            setGoogleLoading(true);
            signIn("google", { callbackUrl: "/auth/callback" });
          }}
          disabled={googleLoading}
          className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {googleLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          )}
          {googleLoading ? "Signing up..." : "Continue with Google"}
        </button>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-white/10 text-center">
          <p className="text-xs text-gray-500">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 font-medium">Sign in</Link>
          </p>
        </div>

        <div className="mt-3 flex justify-center gap-2 text-[10px] text-gray-600">
          <Link href="/contact-support" className="hover:text-gray-400">Support</Link>
          <span>•</span>
          <Link href="/auth/resendverification" className="hover:text-gray-400">Resend verification</Link>
        </div>
      </div>
    </div>
  );
}
