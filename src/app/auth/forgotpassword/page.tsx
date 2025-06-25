"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { HiArrowLeft } from "react-icons/hi"; // Arrow Icon from React Icons

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Email validation function
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Memoized submit handler
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setMessage("");

      if (!validateEmail(email)) {
        toast.error("Please enter a valid email address.");
        return;
      }

      if (email.length < 6) {
        toast.error("Email must be at least 6 characters long.");
        return;
      }

      setLoading(true);

      const res = await fetch("/api/users/password/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      setLoading(false);

      if (res.ok) {
        setMessage(data.message);
        toast.success(data.message || "Reset link sent successfully.");
      } else {
        setMessage(data.error);
        toast.error(data.error || "An error occurred while sending the reset link.");
      }
    },
    [email]
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-black via-gray-900 to-black px-6 relative overflow-hidden">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="fixed top-6 left-4 flex items-center gap-2 text-blue-300 hover:text-blue-400 hover:underline text-lg md:text-xl px-4 py-2 rounded-lg bg-zinc-900/80 shadow border-2 border-blue-400/40 transition-all z-50"
        style={{ position: 'fixed', top: '1.5rem', left: '1rem', zIndex: 50 }}
      >
        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        <span className="hidden sm:inline">Back</span>
      </button>

      {/* Optimized Subtle Pattern Background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none" />

      {/* Glassmorphism Effect Forgot Password Card */}
      <div className="max-w-md w-full p-12 bg-gradient-to-br from-zinc-900/80 via-blue-900/60 to-purple-900/70 backdrop-blur-2xl border border-blue-400/30 rounded-3xl shadow-2xl z-10 relative flex flex-col items-center animate-fade-in">
        {/* Logo/Icon */}
        <div className="mb-6 flex items-center justify-center">
          <svg className="w-14 h-14 text-blue-300 animate-spin-slow" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-20"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" className="opacity-60"/></svg>
        </div>
        <h1 className="text-4xl font-extrabold text-center text-white mb-8 drop-shadow-lg tracking-tight font-sans">Forgot Password</h1>
        <hr className="w-1/2 mx-auto mb-8 border-blue-400 opacity-20" />

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8 w-full" autoComplete="off">
          <div className="mb-4">
            <label htmlFor="email" className="block text-base font-semibold text-blue-100 mb-3 tracking-wide">
              Enter your email address
            </label>
            <input
              id="email"
              type="email"
              className="w-full p-4 border border-blue-400/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 text-blue-900 bg-white/90 placeholder:text-blue-400/60 shadow-md font-medium"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-4 text-white rounded-xl font-bold text-lg transition-all duration-300 ease-in-out mt-2 mb-2 shadow-lg bg-gradient-to-r from-blue-700/90 to-purple-800/90 hover:from-blue-800 hover:to-purple-900 active:scale-95 focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 ${loading ? "bg-gray-600 cursor-not-allowed" : ""}`}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {/* Success/Error Message */}
        {message && (
          <div className={`mt-6 text-center text-base font-semibold ${message.includes('error') ? "text-red-400" : "text-green-400"}`}>
            <p>{message}</p>
          </div>
        )}

        {/* Back to login link */}
        <div className="mt-8 text-center w-full">
          <p className="text-blue-200 text-base font-medium">
            Remember your password?{' '}
            <a href="/auth/login" className="text-blue-400 hover:underline cursor-pointer font-semibold">Login here</a>
          </p>
        </div>
        <footer className="mt-10 text-xs text-blue-200/80 text-center w-full">
          Need help? <a href="/contact-support" className="text-blue-400 font-medium hover:underline">Contact support</a>.
        </footer>
      </div>
    </div>
  );
}
