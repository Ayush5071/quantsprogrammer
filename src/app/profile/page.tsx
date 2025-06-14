"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-hot-toast";
import Certificate from "@/components/component/Certificate";
import ReactConfetti from "react-confetti";

interface User {
  username: string;
  email: string;
  isVerified: boolean;
  checkedData: Array<{ module: string; completed: boolean }> | null;
  fullName?: string;
  address?: string;
  age?: string;
  college?: string;
  gender?: string;
  contactNumber?: string;
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
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, { completedTasks: string[]; completedAssignments: string[] }>>({});
  const [loadingRoadmaps, setLoadingRoadmaps] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<User | null>(null);

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
    const fetchRoadmapsAndProgress = async () => {
      setLoadingRoadmaps(true);
      try {
        const res = await fetch("/api/roadmap/fetchall");
        const data = await res.json();
        setRoadmaps(data.roadmaps || []);
        // Fetch progress for each roadmap
        const progressObj: Record<string, { completedTasks: string[]; completedAssignments: string[] }> = {};
        for (const roadmap of data.roadmaps) {
          try {
            const progressRes = await fetch(`/api/roadmap/progress?roadmapId=${roadmap._id}`);
            const progressData = await progressRes.json();
            progressObj[roadmap._id] = progressData.progress || { completedTasks: [], completedAssignments: [] };
          } catch {
            progressObj[roadmap._id] = { completedTasks: [], completedAssignments: [] };
          }
        }
        setProgressMap(progressObj);
      } catch (error) {
        console.error("Error fetching roadmaps or progress", error);
      }
      setLoadingRoadmaps(false);
    };
    fetchUserDetails();
    fetchRoadmapsAndProgress();
  }, []);

  useEffect(() => {
    if (userData) setEditData(userData);
  }, [userData]);

  // Calculate progress for each roadmap from DB data
  const progressData = useMemo(() =>
    roadmaps.map((roadmap) => {
      const totalTasks = roadmap.phases?.reduce((acc: number, phase: any) => acc + (phase.tasks?.length || 0), 0) || 0;
      const totalAssignments = roadmap.phases?.reduce((acc: number, phase: any) => acc + (phase.assignments?.length || 0), 0) || 0;
      const progress = progressMap[roadmap._id] || { completedTasks: [], completedAssignments: [] };
      const completedTasks = progress.completedTasks.length;
      const completedAssignments = progress.completedAssignments.length;
      const percent = totalTasks + totalAssignments === 0 ? 0 : Math.round(((completedTasks + completedAssignments) / (totalTasks + totalAssignments)) * 100);
      return {
        label: roadmap.title,
        percent,
        color: "from-blue-500 to-purple-700", // You can customize per roadmap if needed
      };
    }),
    [roadmaps, progressMap]
  );

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editData) return;
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await axios.post("/api/users/updateprofile", editData);
      toast.success("Profile updated");
      setEditMode(false);
      setUserData(editData);
    } catch (error: any) {
      toast.error("Failed to update profile");
    }
  };

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
    <div className="min-h-screen flex flex-col items-center bg-zinc-950 py-12 px-2 md:px-8">
      {/* Removed: Confetti and Modal */}
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="fixed top-6 left-4 flex items-center gap-2 text-blue-400 hover:text-blue-300 hover:underline text-xl md:text-2xl px-6 py-3 rounded-2xl bg-zinc-900 shadow-lg border-2 border-blue-700 transition-all z-50"
        style={{ position: 'fixed', top: '1.5rem', left: '1rem', zIndex: 50 }}
      >
        <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        <span className="hidden sm:inline">Back</span>
      </button>
      <div className="w-full max-w-6xl mx-auto mt-12 md:mt-24">
        <div className="flex flex-col md:flex-row gap-12 items-start justify-between bg-zinc-900 rounded-3xl shadow-2xl p-10 md:p-16 border-2 border-blue-900">
          {/* Profile Avatar and Info */}
          <div className="flex flex-col items-center md:items-start gap-8 flex-1 w-full">
            <div className="w-40 h-40 rounded-full bg-zinc-800 flex items-center justify-center text-6xl font-extrabold shadow-lg border-4 border-blue-900 text-blue-300">
              {userData?.username?.[0]}
            </div>
            <div className="text-center md:text-left w-full">
              {editMode ? (
                <>
                  <input name="fullName" value={editData?.fullName || ""} onChange={handleEditChange} placeholder="Full Name" className="w-full mb-4 px-4 py-3 rounded-lg bg-zinc-800 text-zinc-100 border border-zinc-700 text-lg" />
                  <input name="address" value={editData?.address || ""} onChange={handleEditChange} placeholder="Address" className="w-full mb-4 px-4 py-3 rounded-lg bg-zinc-800 text-zinc-100 border border-zinc-700 text-lg" />
                  <input name="age" value={editData?.age || ""} onChange={handleEditChange} placeholder="Age" className="w-full mb-4 px-4 py-3 rounded-lg bg-zinc-800 text-zinc-100 border border-zinc-700 text-lg" />
                  <input name="college" value={editData?.college || ""} onChange={handleEditChange} placeholder="College" className="w-full mb-4 px-4 py-3 rounded-lg bg-zinc-800 text-zinc-100 border border-zinc-700 text-lg" />
                  <input name="gender" value={editData?.gender || ""} onChange={handleEditChange} placeholder="Gender" className="w-full mb-4 px-4 py-3 rounded-lg bg-zinc-800 text-zinc-100 border border-zinc-700 text-lg" />
                  <input name="contactNumber" value={editData?.contactNumber || ""} onChange={handleEditChange} placeholder="Contact Number" className="w-full mb-4 px-4 py-3 rounded-lg bg-zinc-800 text-zinc-100 border border-zinc-700 text-lg" />
                  <input value={userData?.email} disabled className="w-full mb-4 px-4 py-3 rounded-lg bg-zinc-900 text-zinc-400 border border-zinc-800 cursor-not-allowed text-lg" />
                  <div className="flex gap-4 mt-4">
                    <button onClick={handleSave} className="px-6 py-3 bg-blue-700 text-white rounded-xl text-lg hover:bg-blue-800">Save</button>
                    <button onClick={() => setEditMode(false)} className="px-6 py-3 bg-zinc-700 text-white rounded-xl text-lg hover:bg-zinc-800">Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-4xl md:text-5xl font-bold mb-4 text-zinc-100">{userData?.fullName || userData?.username}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4 mt-6 text-lg">
                    <div className="flex flex-col">
                      <span className="text-xs text-zinc-400">Email</span>
                      <span className="text-base md:text-lg text-zinc-200 font-medium">{userData?.email}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-zinc-400">Address</span>
                      <span className="text-base md:text-lg text-zinc-200 font-medium">{userData?.address || '-'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-zinc-400">Age</span>
                      <span className="text-base md:text-lg text-zinc-200 font-medium">{userData?.age || '-'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-zinc-400">College</span>
                      <span className="text-base md:text-lg text-zinc-200 font-medium">{userData?.college || '-'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-zinc-400">Gender</span>
                      <span className="text-base md:text-lg text-zinc-200 font-medium">{userData?.gender || '-'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-zinc-400">Contact Number</span>
                      <span className="text-base md:text-lg text-zinc-200 font-medium">{userData?.contactNumber || '-'}</span>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-4">
                    <p className={`px-6 py-2 rounded-full text-sm font-semibold inline-block ${userData?.isVerified ? "bg-blue-700 text-white" : "bg-zinc-700 text-zinc-300"}`}>{userData?.isVerified ? "Verified" : "Not Verified"}</p>
                    <button onClick={() => setEditMode(true)} className="px-6 py-3 bg-blue-700 text-white rounded-xl text-lg font-semibold shadow hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all w-full md:w-auto md:ml-4 mt-4 md:mt-0 flex items-center justify-center">
                      <svg className="inline-block w-5 h-5 mr-2 -mt-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2l-6 6m-2 2h6a2 2 0 002-2v-6a2 2 0 00-2-2H7a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg>
                      Edit Profile
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
          {/* Progress Section */}
          <div className="flex-1 w-full flex flex-col gap-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
            <h3 className="text-2xl md:text-3xl font-bold text-zinc-200 mb-4 text-center md:text-left">Roadmap Progress</h3>
            <div className="space-y-8">
              {loadingRoadmaps ? (
                <div className="flex justify-center items-center h-24">
                  <svg className="animate-spin h-10 w-10 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                </div>
              ) : progressData.length === 0 ? (
                <div className="text-center text-zinc-400 text-lg">No roadmaps found.</div>
              ) : progressData.map((item, idx) => (
                <div key={idx} className="w-full mb-12">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-zinc-300 text-lg md:text-xl">{item.label}</span>
                    <span className="font-bold text-xl text-blue-400">{item.percent}%</span>
                  </div>
                  <div className="w-full h-6 rounded-full bg-zinc-800 overflow-hidden shadow-inner mb-4">
                    <div className="h-6 rounded-full bg-blue-900 transition-all duration-500" style={{ width: `${item.percent}%` }} />
                  </div>
                  {item.percent === 100 && userData && userData.fullName && userData.address && userData.age && userData.college && userData.gender && userData.contactNumber && null}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Actions */}
        <div className="mt-14 flex flex-col md:flex-row gap-6 items-center justify-center">
          <Link
            href="/auth/forgotpassword"
            className="px-8 py-4 text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow text-lg"
          >
            Change Password
          </Link>
          <button
            onClick={logout}
            className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-2xl shadow text-lg"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
