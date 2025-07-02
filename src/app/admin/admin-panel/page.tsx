"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FaUserShield, FaEnvelope, FaCheckCircle, FaTimesCircle, FaMap, FaCertificate } from "react-icons/fa";
import AdminNavbar from "./AdminNavbar";
import useCurrentUser from "@/lib/useCurrentUser";

const AdminPanel = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const user = useCurrentUser();

  // Check if user is admin
  useEffect(() => {
    if (user === null) {
      // Still loading user data
      return;
    }
    if (user === false || (!user?.isAdmin && user?.role !== 'admin')) {
      // Not logged in or not admin
      setError("Access denied. Admin privileges required.");
      setLoading(false);
      return;
    }
  }, [user]);

  useEffect(() => {
    // Only fetch data if user is admin
    if (user && (user.isAdmin || user.role === 'admin')) {
      axios.get("/api/admin/admin-panel")
        .then((response) => {
          setUsers(response.data.data);
          setLoading(false);
        })
        .catch((error) => {
          setError("Failed to fetch user data.");
          setLoading(false);
        });
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-black">
        <div className="text-xl font-semibold text-white animate-pulse">Loading Admin Data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-black">
        <div className="text-xl font-semibold text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black py-10 px-2 md:px-4 relative overflow-hidden">
        {/* Glassmorphism animated background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.12),transparent_50%)] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(37,99,235,0.10),transparent_50%)] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(29,78,216,0.07),transparent_70%)] pointer-events-none"></div>
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)]"></div>
        </div>
        <div className="relative z-10 w-full max-w-7xl mx-auto">
          <h1 className="text-5xl font-extrabold text-center text-white mb-10 tracking-tight drop-shadow-lg flex items-center justify-center gap-3">
            <FaUserShield className="text-blue-400" /> Admin Panel
          </h1>
          {/* Admin Actions */}
          <div className="w-full max-w-5xl mx-auto mb-10 flex flex-col md:flex-row items-center justify-end gap-4 md:gap-6">
            <a href="/admin/blog-requests" className="px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-opacity-60 hover:bg-opacity-90 text-white rounded-2xl text-lg font-bold shadow-xl backdrop-blur-lg border border-white/20 transition-all duration-200 hover:scale-105">
              Blog Requests
            </a>
            <a href="/admin/top-interview-create" className="px-6 py-3 bg-gradient-to-r from-pink-700 to-pink-800 text-white rounded-2xl text-lg font-bold shadow-xl backdrop-blur-lg border border-white/20 transition-all duration-200 hover:scale-105">
              Create Top Interview
            </a>
            <a href="/top-interviews" className="px-6 py-3 bg-gradient-to-r from-blue-700 to-blue-800 text-white rounded-2xl text-lg font-bold shadow-xl backdrop-blur-lg border border-white/20 transition-all duration-200 hover:scale-105">
              View Top Interviews
            </a>
          </div>
          <div className="overflow-x-auto">
            <div className="w-full max-w-5xl mx-auto bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl shadow-2xl p-2 md:p-8">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-blue-900/80 text-white text-lg rounded-xl">
                    <th className="py-4 px-6">Username</th>
                    <th className="py-4 px-6">Email</th>
                    <th className="py-4 px-6">Verified</th>
                    <th className="py-4 px-6">Roadmaps</th>
                    <th className="py-4 px-6">Course Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-b border-gray-700/40 hover:bg-white/10 transition-all">
                      <td className="py-3 px-6 text-white font-semibold flex items-center gap-2">
                        <FaUserShield className="text-blue-300" /> {user.username}
                      </td>
                      <td className="py-3 px-6 text-blue-200 flex items-center gap-2">
                        <FaEnvelope className="text-blue-400" /> {user.email}
                      </td>
                      <td className="py-3 px-6 text-center">
                        {user.isVerified ? (
                          <FaCheckCircle className="text-green-400 inline-block text-xl" title="Verified" />
                        ) : (
                          <FaTimesCircle className="text-red-400 inline-block text-xl" title="Not Verified" />
                        )}
                      </td>
                      <td className="py-3 px-6">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-blue-300">
                            <FaMap className="text-green-400" />
                            <span className="text-sm font-semibold">
                              {user.completedRoadmaps?.length || 0} Completed
                            </span>
                          </div>
                          {user.completedRoadmaps && user.completedRoadmaps.length > 0 && (
                            <div className="space-y-1">
                              {user.completedRoadmaps.slice(0, 2).map((roadmap: any, index: number) => (
                                <div key={index} className="text-xs text-gray-300 bg-white/10 rounded px-2 py-1">
                                  <div className="flex items-center gap-1">
                                    <FaCertificate className="text-yellow-400" />
                                    <span>ID: {roadmap.roadmapId}</span>
                                  </div>
                                  <div className="text-gray-400">
                                    Tasks: {roadmap.completedTasks?.length || 0} | 
                                    Assignments: {roadmap.completedAssignments?.length || 0}
                                  </div>
                                </div>
                              ))}
                              {user.completedRoadmaps.length > 2 && (
                                <div className="text-xs text-gray-400">
                                  +{user.completedRoadmaps.length - 2} more roadmaps
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-6">
                        {user.courseProgress && Object.keys(user.courseProgress).length > 0 ? (
                          <div className="space-y-2">
                            {Object.keys(user.courseProgress).map((course) => {
                              const { totalTasks, completedTasks, progressPercentage } = user.courseProgress[course];
                              return (
                                <div key={course} className="mb-2">
                                  <div className="flex justify-between text-white text-sm font-medium">
                                    <span>{course}</span>
                                    <span>{progressPercentage.toFixed(2)}%</span>
                                  </div>
                                  <div className="w-full bg-gray-600 rounded-full h-2.5 mt-1">
                                    <div
                                      className="bg-gradient-to-r from-blue-400 via-blue-600 to-purple-500 h-2.5 rounded-full transition-all duration-500 shadow"
                                      style={{ width: `${progressPercentage}%` }}
                                    ></div>
                                  </div>
                                  <div className="text-xs text-gray-300 mt-1">
                                    {completedTasks} of {totalTasks} tasks completed
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="text-gray-400">No course data</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPanel;
