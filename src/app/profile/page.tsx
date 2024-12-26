"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-hot-toast";

interface User {
  username: string;
  email: string;
  isVerified: boolean;
  checkedData: Array<{ module: string; completed: boolean }> | null;
}

export default function ProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<User | null>(null);
  const [frontendCheckedItems, setFrontendCheckedItems] = useState<string[]>([]);
  const [backendCheckedItems, setBackendCheckedItems] = useState<string[]>([]);
  const [dataAnalysisCheckedItems, setDataAnalysisCheckedItems] = useState<string[]>([]);
  const [loadingFrontend, setLoadingFrontend] = useState<boolean>(true);
  const [loadingBackend, setLoadingBackend] = useState<boolean>(true);
  const [loadingDataAnalysis, setLoadingDataAnalysis] = useState<boolean>(true);

  const totalFrontendTasks = 44;
  const totalBackendTasks = 30;
  const totalDataAnalysisTasks = 25; // Example data analysis tasks, adjust as needed

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await axios.get("/api/users/me");
        setUserData(res.data.user);
      } catch (error: any) {
        console.error(error.message);
        toast.error("Failed to fetch user details");
      }
    };

    const fetchFrontendProgress = async () => {
      try {
        const res = await fetch(`/api/roadmap/fetch?topic=FrontEndWeb`);
        const data = await res.json();
        if (res.ok) setFrontendCheckedItems(data.checkedData || []);
        else console.error("Error fetching Frontend roadmap progress");
      } catch (error) {
        console.error("Error fetching Frontend roadmap progress:", error);
      }
      setLoadingFrontend(false);
    };

    const fetchBackendProgress = async () => {
      try {
        const res = await fetch(`/api/roadmap/fetch?topic=BackEndWeb`);
        const data = await res.json();
        if (res.ok) setBackendCheckedItems(data.checkedData || []);
        else console.error("Error fetching Backend roadmap progress");
      } catch (error) {
        console.error("Error fetching Backend roadmap progress:", error);
      }
      setLoadingBackend(false);
    };

    const fetchDataAnalysisProgress = async () => {
      try {
        const res = await fetch(`/api/roadmap/fetch?topic=DataAnalysis`);
        const data = await res.json();
        if (res.ok) setDataAnalysisCheckedItems(data.checkedData || []);
        else console.error("Error fetching Data Analysis roadmap progress");
      } catch (error) {
        console.error("Error fetching Data Analysis roadmap progress:", error);
      }
      setLoadingDataAnalysis(false);
    };

    fetchUserDetails();
    fetchFrontendProgress();
    fetchBackendProgress();
    fetchDataAnalysisProgress();
  }, []);

  const calculateFrontendProgress = () => {
    return frontendCheckedItems.length
      ? Math.round((frontendCheckedItems.length / totalFrontendTasks) * 100)
      : 0;
  };

  const calculateBackendProgress = () => {
    return backendCheckedItems.length
      ? Math.round((backendCheckedItems.length / totalBackendTasks) * 100)
      : 0;
  };

  const calculateDataAnalysisProgress = () => {
    return dataAnalysisCheckedItems.length
      ? Math.round((dataAnalysisCheckedItems.length / totalDataAnalysisTasks) * 100)
      : 0;
  };

  const frontendProgress = calculateFrontendProgress();
  const backendProgress = calculateBackendProgress();
  const dataAnalysisProgress = calculateDataAnalysisProgress();

  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logout successful");
      router.push("/login");
    } catch (error: any) {
      console.error(error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-950 px-6 py-12 relative">
      {/* Back Button */}
      <Link href="/" className="absolute top-6 left-6 text-white text-3xl hover:text-purple-400 transition-all">
        &larr;
      </Link>

      <motion.div
        initial={{ opacity: 0.5, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="relative flex flex-col items-center max-w-lg w-full p-6 bg-gradient-to-br from-indigo-800 to-purple-800 rounded-xl shadow-lg"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-br from-pink-400 to-purple-500 bg-clip-text text-transparent mb-4">
          Profile
        </h1>

        {userData ? (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-white"
          >
            <div className="relative mb-4">
              <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-2xl font-bold uppercase">
                {userData.username[0]}
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">{userData.username}</h2>
              <p className="text-sm text-gray-400 mb-4">{userData.email}</p>
              <p
                className={`py-1 px-3 rounded-full text-xs font-bold ${
                  userData.isVerified
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {userData.isVerified ? "Verified" : "Not Verified"}
              </p>
            </div>

            {/* FullStack Course Progress */}
            <div className="w-full mt-6">
              <h3 className="text-xl font-semibold text-purple-400 mb-2">
                FullStack WebDev Course Progress
              </h3>
              <div className="relative w-full bg-gray-700 rounded-full h-4 mb-2">
                <div
                  className="absolute top-0 left-0 h-4 bg-purple-600 rounded-full"
                  style={{ width: `${frontendProgress}%` }}
                />
              </div>
              <p className="text-center text-sm text-gray-300">
                {frontendProgress}% Complete
              </p>
            </div>

            {/* Frontend Progress Bar */}
            <div className="w-full mt-4">
              <h3 className="text-xl font-semibold text-blue-400 mb-2">
                FrontEnd Development Progress
              </h3>
              <div className="relative w-full bg-gray-700 rounded-full h-4 mb-2">
                <div
                  className="absolute top-0 left-0 h-4 bg-blue-500 rounded-full"
                  style={{ width: `${frontendProgress}%` }}
                />
              </div>
              <p className="text-center text-sm text-gray-300">
                {loadingFrontend ? "Loading..." : `${frontendProgress}% Complete`}
              </p>
            </div>

            {/* Backend Progress Bar */}
            <div className="w-full mt-4">
              <h3 className="text-xl font-semibold text-green-400 mb-2">
                BackEnd Development Progress
              </h3>
              <div className="relative w-full bg-gray-700 rounded-full h-4 mb-2">
                <div
                  className="absolute top-0 left-0 h-4 bg-green-500 rounded-full"
                  style={{ width: `${backendProgress}%` }}
                />
              </div>
              <p className="text-center text-sm text-gray-300">
                {loadingBackend ? "Loading..." : `${backendProgress}% Complete`}
              </p>
            </div>

            {/* Data Analysis Progress Bar */}
            <div className="w-full mt-4">
              <h3 className="text-xl font-semibold text-yellow-400 mb-2">
                Data Analysis Progress
              </h3>
              <div className="relative w-full bg-gray-700 rounded-full h-4 mb-2">
                <div
                  className="absolute top-0 left-0 h-4 bg-yellow-500 rounded-full"
                  style={{ width: `${dataAnalysisProgress}%` }}
                />
              </div>
              <p className="text-center text-sm text-gray-300">
                {loadingDataAnalysis ? "Loading..." : `${dataAnalysisProgress}% Complete`}
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3 w-full">
              <Link
                href="/forgotpassword"
                className="w-full px-4 py-2 text-center bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-md"
              >
                Change Password
              </Link>
              <button
                onClick={logout}
                className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md"
              >
                Logout
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-white text-lg"
          >
            Loading profile...
          </motion.div>
        )}

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="absolute inset-auto top-full mt-6 w-72 h-16 rounded-full bg-purple-500 blur-3xl opacity-50"
        ></motion.div>
      </motion.div>
    </div>
  );
}
