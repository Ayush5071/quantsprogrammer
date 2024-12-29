"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
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
  const [stars, setStars] = useState<any[]>([]);

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return false;
    }
    setPasswordError(null);
    return true;
  };

  const onLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!validatePassword(user.password)) {
      return;
    }

    try {
      setLoading(true);
      toast.dismiss();

      const response = await axios.post("/api/users/login", user);
      // console.log("Login success:", response.data);

      toast.success("Login successful! Redirecting...");
      localStorage.setItem("token", response.data.token);
      router.push("/"); 
    } catch (error: any) {
      console.error("Login failed:", error.response?.data?.error || error.message);

      toast.error(error.response?.data?.error || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
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
  }, []); // This ensures that stars are only generated once when the component is mounted

  useEffect(() => {
    if (user.email.trim() && user.password.trim()) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black px-6 relative overflow-hidden">
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

      {/* Glassmorphism Effect Login Card */}
      <div className="max-w-md w-full p-8 bg-white bg-opacity-20 backdrop-blur-lg border-2 border-transparent rounded-xl shadow-2xl z-10 relative">
        <h1 className="text-4xl font-extrabold text-center text-white mb-6">
          {loading ? "Processing..." : "Login"}
        </h1>
        <hr className="w-1/2 mx-auto mb-4 border-gray-200 opacity-50" />

        <div className="mb-6">
          <label htmlFor="email" className="block text-lg font-medium text-white mb-2">
            Email Address
          </label>
          <input
            className="p-4 w-full bg-transparent text-white border-2 border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-xl"
            id="email"
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder="Enter your email"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-lg font-medium text-white mb-2">
            Password
          </label>
          <input
            className="p-4 w-full bg-transparent text-white border-2 border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-xl"
            id="password"
            type="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            placeholder="Enter your password"
            onBlur={() => validatePassword(user.password)}
          />
          {passwordError && <p className="text-sm text-red-500 mt-1">{passwordError}</p>}
        </div>

        <button
          onClick={onLogin}
          disabled={buttonDisabled}
          className={`w-full p-4 text-white rounded-lg transition-all duration-300 ease-in-out ${buttonDisabled ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600 active:scale-95 shadow-lg"}`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-6 text-center text-white text-lg">
          Don’t have an account?{" "}
          <Link href="/signup">
            <span className="text-blue-400 hover:underline cursor-pointer">Sign up here</span>
          </Link>
        </p>

        <p className="mt-1 text-center text-white text-sm">
          Account not verified?{" "}
          <Link href="/resendverification">
            <span className="text-blue-400 hover:underline cursor-pointer">Verify Email</span>
          </Link>
        </p>

        <div className="mt-6 text-center text-white text-xs">
          <Link href="/forgotpassword">
            <span className="hover:underline cursor-pointer">Forgot password?</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
