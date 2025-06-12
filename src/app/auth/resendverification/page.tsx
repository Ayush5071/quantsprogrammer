"use client";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { HiArrowLeft } from "react-icons/hi"; // Arrow Icon from React Icons

export default function ResendVerification() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [stars, setStars] = useState<any[]>([]);

  // Email validation function
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/users/resendverification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    setLoading(false);

    if (res.ok) {
      setMessage(data.message);
      toast.success(data.message || "Verification email sent successfully.");
    } else {
      setMessage(data.error);
      toast.error(data.error || "An error occurred while sending the verification email.");
    }
  };

  useEffect(() => {
    // Generate stars once and store their positions
    const newStars = [...Array(800)].map(() => ({
      top: `${Math.random() * 500}vh`,
      left: `${Math.random() * 100}vw`,
      size: `${Math.random() * 1.5 + 0.5}px`,
      opacity: Math.random() * 0.8,
      animationDuration: `${Math.random() * 3 + 2}s`,
      animationDelay: `${Math.random() * 3}s`,
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-black via-gray-900 to-black px-6 relative overflow-hidden">
              <button
          onClick={() => router.push("/login")}
          className="absolute top-6 cursor-pointer left-6 text-blue-500 hover:text-blue-700 text-lg"
        >
          <HiArrowLeft className="inline-block mr-2" /> Back to Login
        </button>
      {/* Starry Background */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        {stars.map((star, index) => (
          <div
            key={index}
            className="star absolute bg-white rounded-full animate-pulse"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
              animationDuration: star.animationDuration,
              animationDelay: star.animationDelay,
            }}
          />
        ))}
      </div>

      {/* Glassmorphism Effect Resend Verification Card */}
      <div className="max-w-md w-full p-8 bg-white bg-opacity-20 backdrop-blur-md border-2 border-gray-300 rounded-xl shadow-2xl z-10 relative">
        {/* Back to Login Button */}


        <h1 className="text-3xl font-extrabold text-center text-white mb-6">Resend Verification Email</h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
              Enter your email address
            </label>
            <input
              id="email"
              type="email"
              className="w-full p-3 border-2 border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 text-white rounded-lg transition-all duration-300 ease-in-out ${
              loading ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-lg"
            }`}
          >
            {loading ? "Sending..." : "Resend Verification Link"}
          </button>
        </form>

        {message && (
          <div
            className={`mt-4 text-center text-sm ${message.includes("error") ? "text-red-500" : "text-green-500"}`}
          >
            <p>{message}</p>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-gray-300 text-sm">
            Already verified?{" "}
            <a href="/auth/login" className="text-blue-400 hover:underline cursor-pointer">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
