"use client";

import { Suspense, useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function ResetPasswordForm() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const searchParams = useSearchParams();
    const token = searchParams.get("token"); // Extract the token parameter
    const router = useRouter();

    // Create the stars only once when the component is mounted
    const stars = useMemo(() => {
        return [...Array(500)].map(() => ({
            top: Math.random() * 100, // Random vertical position in vh
            left: Math.random() * 100, // Random horizontal position in vw
            size: Math.random() * 2 + 1, // Random size of star
            duration: Math.random() * 3 + 1, // Random animation duration
            delay: Math.random() * 2, // Random delay for animation
            opacity: Math.random(), // Random opacity
        }));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        if (!token) {
            setMessage("Invalid or missing token.");
            return;
        }

        const res = await fetch("/api/users/password/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, newPassword, confirmPassword }),
        });

        const data = await res.json();
        if (res.ok) {
            setMessage(data.message);
            setTimeout(() => router.push("/login"), 1000); // Navigate to login page
        } else {
            setMessage(data.error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-black via-gray-900 to-black px-6 relative overflow-hidden">
            {/* Starry Background */}
            <div className="absolute top-0 left-0 w-full h-full z-0">
                {stars.map((star, index) => (
                    <div
                        key={index}
                        className="absolute bg-white rounded-full animate-pulse"
                        style={{
                            top: `${star.top}vh`,
                            left: `${star.left}vw`,
                            width: `${star.size}px`,
                            height: `${star.size}px`,
                            opacity: star.opacity,
                            animationDuration: `${star.duration}s`,
                            animationDelay: `${star.delay}s`,
                        }}
                    />
                ))}
            </div>

            {/* Glassmorphism Effect Reset Password Card */}
            <div className="max-w-md w-full p-8 bg-white bg-opacity-20 backdrop-blur-md border-2 border-white rounded-xl shadow-xl z-10 relative">
                <h1 className="text-3xl font-semibold text-center text-indigo-500 mb-6">Reset Your Password</h1>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-white mb-2">New Password</label>
                        <input
                            id="newPassword"
                            type="password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full p-3 border-2 border-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-black"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">Confirm New Password</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-3 border-2 border-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-black"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full p-3 text-white rounded-lg bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
                    >
                        Reset Password
                    </button>
                </form>

                {/* Message */}
                {message && (
                    <p className={`mt-4 text-center text-sm ${message.includes("error") ? "text-red-600" : "text-green-600"}`}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}

export default function ResetPassword() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <ResetPasswordForm />
        </Suspense>
    );
}
