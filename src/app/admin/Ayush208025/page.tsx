"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const AdminPanel = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch users and their course progress
    axios.get("/api/admin/Ayush208025")
      .then((response) => {
        setUsers(response.data.data);  // Assuming response format includes a 'data' field
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-xl font-semibold text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <h1 className="text-4xl font-bold text-center text-white mb-8">Admin Panel</h1>

      <div className="flex flex-wrap justify-start gap-4">
        {/* Each user will be wrapped in a flexible box */}
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-gray-800 shadow-lg rounded-lg p-4 w-full sm:w-auto flex flex-col sm:flex-row items-start sm:items-center sm:space-x-4 space-y-4 sm:space-y-0"
          >
            {/* User Info: Username */}
            <div className="flex-none w-full sm:w-1/5">
              <h2 className="text-sm font-semibold text-white">{user.username}</h2>
            </div>

            {/* User Info: Email */}
            <div className="flex-none w-full sm:w-1/5">
              <p className="text-sm text-gray-300">{user.email}</p>
            </div>

            {/* User Info: Verification Status */}
            <div className="flex-none w-full sm:w-1/5">
              <p className="text-xs text-gray-400">
                {user.isVerified ? "         " : ""}
              </p>
            </div>

            {/* Course Progress */}
            <div className="flex-grow w-full sm:w-2/5">
              <div className="space-y-2">
                {Object.keys(user.courseProgress).map((course) => {
                  const { totalTasks, completedTasks, progressPercentage } = user.courseProgress[course];
                  return (
                    <div key={course} className="bg-gray-700 p-2 rounded-lg">
                      <div className="flex justify-between text-white text-xs">
                        <h4>{course}</h4>
                        <span>{progressPercentage.toFixed(2)}%</span>
                      </div>
                      <div className="mt-1">
                        <div className="bg-gray-600 rounded-full h-2.5">
                          <div
                            className="bg-blue-500 h-2.5 rounded-full"
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
