"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FaUserShield, FaEnvelope, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black py-10 px-4">
        <h1 className="text-5xl font-extrabold text-center text-white mb-10 tracking-tight drop-shadow-lg flex items-center justify-center gap-3">
          <FaUserShield className="text-blue-400" /> Admin Panel
        </h1>
        {/* Top Interview Admin Actions */}
        <div className="w-full max-w-5xl mx-auto mb-10 flex flex-col items-end">
          <a href="/admin/top-interview-create" className="px-6 py-3 bg-pink-700 hover:bg-pink-800 text-white rounded-xl text-lg font-semibold shadow transition-all">Create Top Interview</a>
          <a href="/top-interviews" className="mt-3 px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-lg font-semibold shadow transition-all">View Top Interviews</a>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
            <thead>
              <tr className="bg-blue-900 text-white text-lg">
                <th className="py-4 px-6">Username</th>
                <th className="py-4 px-6">Email</th>
                <th className="py-4 px-6">Verified</th>
                <th className="py-4 px-6">Course Progress</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b border-gray-700 hover:bg-gray-700/30 transition-all">
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
                                  className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
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
    </>
  );
};

export default AdminPanel;
