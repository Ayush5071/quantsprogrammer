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
  const [FullStackCheckedItems, setFullStackCheckedItems] = useState<string[]>([]);
  const [backendCheckedItems, setBackendCheckedItems] = useState<string[]>([]);
  const [dataAnalysisCheckedItems, setDataAnalysisCheckedItems] = useState<string[]>([]);
  const [loadingFrontend, setLoadingFrontend] = useState<boolean>(true);
  const [loadingFullStack, setLoadingFullStack] = useState<boolean>(true);
  const [loadingBackend, setLoadingBackend] = useState<boolean>(true);
  const [loadingDataAnalysis, setLoadingDataAnalysis] = useState<boolean>(true);

  const totalFrontendTasks = 18;
  const totalFullStackTasks = 40;
  const totalBackendTasks = 26;
  const totalDataAnalysisTasks = 16;

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
        if (res.ok) {
          setFrontendCheckedItems(data.checkedData || []);
        } else {
          console.error("Error fetching Frontend roadmap progress");
        }
      } catch (error) {
        console.error("Error fetching Frontend roadmap progress:", error);
      }
      setLoadingFrontend(false);
    };

    const fetchFullStackProgress = async () => {
      try {
        const res = await fetch(`/api/roadmap/fetch?topic=FullStackWeb`);
        const data = await res.json();
        if (res.ok) {
          setFullStackCheckedItems(data.checkedData || []);
        } else {
          console.error("Error fetching FullStack roadmap progress");
        }
      } catch (error) {
        console.error("Error fetching FullStack roadmap progress:", error);
      }
      setLoadingFullStack(false);
    };

    const fetchBackendProgress = async () => {
      try {
        const res = await fetch(`/api/roadmap/fetch?topic=BackEndWeb`);
        const data = await res.json();
        if (res.ok) {
          setBackendCheckedItems(data.checkedData || []);
        } else {
          console.error("Error fetching Backend roadmap progress");
        }
      } catch (error) {
        console.error("Error fetching Backend roadmap progress:", error);
      }
      setLoadingBackend(false);
    };

    const fetchDataAnalysisProgress = async () => {
      try {
        const res = await fetch(`/api/roadmap/fetch?topic=DataAnalysis`);
        const data = await res.json();
        if (res.ok) {
          setDataAnalysisCheckedItems(data.checkedData || []);
        } else {
          console.error("Error fetching Data Analysis roadmap progress");
        }
      } catch (error) {
        console.error("Error fetching Data Analysis roadmap progress:", error);
      }
      setLoadingDataAnalysis(false);
    };

    fetchUserDetails();
    fetchFrontendProgress();
    fetchFullStackProgress();
    fetchBackendProgress();
    fetchDataAnalysisProgress();
  }, []);

  const calculateFrontendProgress = () => {
    return frontendCheckedItems.length
      ? Math.round((frontendCheckedItems.length / totalFrontendTasks) * 100)
      : 0;
  };

  const calculateFullStackProgress = () => {
    return FullStackCheckedItems.length
      ? Math.round((FullStackCheckedItems.length / totalFullStackTasks) * 100)
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
  const FullStackProgress = calculateFullStackProgress();
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
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 py-12 px-6">
      {/* Back Button */}
      <Link
        href="/"
        className="absolute top-4 left-4 text-white text-lg md:text-2xl font-bold hover:text-zinc-300 transition-all"
      >
        &larr;
      </Link>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-zinc-800 rounded-lg shadow-lg p-6 max-w-lg w-full"
      >
        <h1 className="text-3xl font-semibold text-zinc-200 mb-6 text-center">Profile</h1>

        {userData ? (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-white"
          >
            {/* Profile Header */}
            <div className="w-24 h-24 mb-4 rounded-full bg-zinc-600 flex items-center justify-center text-3xl font-bold">
              {userData.username[0]}
            </div>

            <h2 className="text-2xl font-semibold">{userData.username}</h2>
            <p className="text-zinc-400 text-sm">{userData.email}</p>
            <p
              className={`mt-2 px-4 py-1 rounded-full text-xs font-semibold ${userData.isVerified ? "bg-green-500" : "bg-red-500"}`}
            >
              {userData.isVerified ? "Verified" : "Not Verified"}
            </p>

            {/* Course Progress Section */}
            <div className="w-full mt-6 space-y-6">
              {/* FullStack Progress */}
              <div>
                <h3 className="text-xl font-semibold text-zinc-300 mb-2">FullStack WebDev Progress</h3>
                <div className="bg-zinc-700 rounded-full h-2 mb-2">
                  <div
                    className="h-2 bg-blue-500 rounded-full"
                    style={{ width: `${FullStackProgress}%` }}
                  />
                </div>
                <p className="text-center text-sm text-zinc-400">{FullStackProgress}% Complete</p>
              </div>

              {/* Frontend Progress */}
              <div>
                <h3 className="text-xl font-semibold text-zinc-300 mb-2">Frontend Development Progress</h3>
                <div className="bg-zinc-700 rounded-full h-2 mb-2">
                  <div
                    className="h-2 bg-purple-500 rounded-full"
                    style={{ width: `${frontendProgress}%` }}
                  />
                </div>
                <p className="text-center text-sm text-zinc-400">{loadingFrontend ? "Loading..." : `${frontendProgress}% Complete`}</p>
              </div>

              {/* Backend Progress */}
              <div>
                <h3 className="text-xl font-semibold text-zinc-300 mb-2">BackEnd Development Progress</h3>
                <div className="bg-zinc-700 rounded-full h-2 mb-2">
                  <div
                    className="h-2 bg-green-500 rounded-full"
                    style={{ width: `${backendProgress}%` }}
                  />
                </div>
                <p className="text-center text-sm text-zinc-400">{loadingBackend ? "Loading..." : `${backendProgress}% Complete`}</p>
              </div>

              {/* Data Analysis Progress */}
              <div>
                <h3 className="text-xl font-semibold text-zinc-300 mb-2">Data Analysis Progress</h3>
                <div className="bg-zinc-700 rounded-full h-2 mb-2">
                  <div
                    className="h-2 bg-yellow-500 rounded-full"
                    style={{ width: `${dataAnalysisProgress}%` }}
                  />
                </div>
                <p className="text-center text-sm text-zinc-400">{loadingDataAnalysis ? "Loading..." : `${dataAnalysisProgress}% Complete`}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4 w-full">
              <Link
                href="/forgotpassword"
                className="w-full px-4 py-2 text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md"
              >
                Change Password
              </Link>
              <button
                onClick={logout}
                className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md"
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
            className="text-white text-lg text-center"
          >
            Loading profile...
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
