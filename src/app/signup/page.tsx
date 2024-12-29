"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
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
  const [stars, setStars] = useState<any[]>([]);

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

  const onSignup = async () => {
    if (!validatePassword(user.password) || !validateEmail(user.email)) return;

    try {
      setLoading(true);
      const response = await axios.post("/api/users/signup", user);
      toast.success("Signup successful!");
      router.push("/remindverify");
    } catch (error: any) {

      toast.error(error.message || "An error occurred during signup.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Generate stars once and store their positions
    const newStars = [...Array(100)].map(() => ({
      top: `${Math.random() * 100}vh`,
      left: `${Math.random() * 100}vw`,
      size: `${Math.random() * 1.5 + 0.5}px`,
      opacity: Math.random() * 0.8,
      animationDuration: `${Math.random() * 3 + 2}s`,
      animationDelay: `${Math.random() * 3}s`,
    }));
    setStars(newStars);
  }, []); // This ensures that stars are only generated once when the component is mounted

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

      {/* Glassmorphism Effect Signup Card */}
      <div className="max-w-md w-full p-8 bg-white bg-opacity-20 backdrop-blur-md border-2 border-gray-300 rounded-xl shadow-2xl z-10 relative">
        <h1 className="text-4xl font-extrabold text-center text-white mb-6">
          {loading ? "Processing..." : "Signup"}
        </h1>
        <hr className="w-1/2 mx-auto mb-4 border-gray-200 opacity-50" />

        {/* Username Input */}
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-white mb-2">
            Username
          </label>
          <input
            className="p-3 w-full bg-transparent text-white border-2 border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            id="username"
            type="text"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            placeholder="Enter your username"
          />
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
            Email
          </label>
          <input
            className="p-3 w-full bg-transparent text-white border-2 border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            id="email"
            type="text"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder="Enter your email"
            onBlur={() => validateEmail(user.email)}
          />
          {emailError && <p className="text-sm text-red-500 mt-1">{emailError}</p>}
        </div>

        {/* Password Input */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
            Password
          </label>
          <input
            className="p-3 w-full bg-transparent text-white border-2 border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            id="password"
            type="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            placeholder="Enter your password"
            onBlur={() => validatePassword(user.password)}
          />
          {passwordError && <p className="text-sm text-red-500 mt-1">{passwordError}</p>}
        </div>

        {/* Signup Button */}
        <button
          onClick={onSignup}
          disabled={buttonDisabled}
          className={`w-full p-3 text-white rounded-lg transition-all duration-300 ease-in-out ${buttonDisabled ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600 active:scale-95 shadow-lg"}`}
        >
          {loading ? "Signing up..." : "Signup"}
        </button>

        {/* Link to login page */}
        <p className="mt-4 text-center text-white text-sm">
          Already have an account?{" "}
          <Link href="/login">
            <span className="text-blue-400 hover:underline cursor-pointer">Login here</span>
          </Link>
        </p>

        {/* Forgot password link */}
        <div className="mt-6 text-center text-white text-xs">
          <Link href="/forgotpassword">
            <span className="hover:underline cursor-pointer">Forgot password?</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
