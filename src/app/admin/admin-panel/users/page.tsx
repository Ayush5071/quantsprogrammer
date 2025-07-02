"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FaUserShield, FaEnvelope, FaCheckCircle, FaTimesCircle, FaEye, FaUser, FaCalendarAlt, FaPhone, FaGraduationCap, FaMapMarkerAlt, FaVenusMars, FaBirthdayCake } from "react-icons/fa";
import AdminNavbar from "../AdminNavbar";
import useCurrentUser from "@/lib/useCurrentUser";

interface User {
  _id: string;
  username: string;
  email: string;
  isVerified: boolean;
  isAdmin: boolean;
  fullName?: string;
  address?: string;
  age?: string;
  college?: string;
  gender?: string;
  contactNumber?: string;
  completedRoadmaps?: Array<{
    roadmapId: string;
    completedTasks: string[];
    completedAssignments: string[];
  }>;
  courseProgress?: Record<string, {
    totalTasks: number;
    completedTasks: number;
    progressPercentage: number;
  }>;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const user = useCurrentUser();

  // Check if user is admin
  useEffect(() => {
    if (user === null) {
      return;
    }
    if (user === false || (!user?.isAdmin && user?.role !== 'admin')) {
      setError("Access denied. Admin privileges required.");
      setLoading(false);
      return;
    }
  }, [user]);

  useEffect(() => {
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

  const openUserDetails = (user: User) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setShowModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-black">
        <div className="text-xl font-semibold text-white animate-pulse">Loading User Data...</div>
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
            <FaUser className="text-blue-400" /> User Management
          </h1>
          
          {/* User Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <div key={user._id} className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                {/* User Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <FaUser className="text-white text-xl" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{user.username}</h3>
                      <p className="text-blue-300 text-sm">{user.fullName || "Name not provided"}</p>
                    </div>
                  </div>
                  {user.isAdmin && (
                    <div className="bg-yellow-600 text-yellow-100 px-2 py-1 rounded-full text-xs font-bold">
                      ADMIN
                    </div>
                  )}
                </div>

                {/* Basic Info */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-blue-200">
                    <FaEnvelope className="text-blue-400" />
                    <span className="text-sm truncate">{user.email}</span>
                  </div>
                  
                  {user.contactNumber && (
                    <div className="flex items-center gap-2 text-blue-200">
                      <FaPhone className="text-green-400" />
                      <span className="text-sm">{user.contactNumber}</span>
                    </div>
                  )}

                  {user.college && (
                    <div className="flex items-center gap-2 text-blue-200">
                      <FaGraduationCap className="text-purple-400" />
                      <span className="text-sm truncate">{user.college}</span>
                    </div>
                  )}
                </div>

                {/* Status Indicators */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {user.isVerified ? (
                      <div className="flex items-center gap-1 text-green-400">
                        <FaCheckCircle />
                        <span className="text-xs">Verified</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-red-400">
                        <FaTimesCircle />
                        <span className="text-xs">Unverified</span>
                      </div>
                    )}
                  </div>
                  
                  {user.age && (
                    <div className="flex items-center gap-1 text-blue-300">
                      <FaBirthdayCake className="text-pink-400" />
                      <span className="text-xs">{user.age} years</span>
                    </div>
                  )}
                </div>

                {/* Progress Overview */}
                {user.courseProgress && Object.keys(user.courseProgress).length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-white mb-2">Course Progress</h4>
                    <div className="space-y-2">
                      {Object.entries(user.courseProgress).slice(0, 2).map(([course, progress]) => (
                        <div key={course}>
                          <div className="flex justify-between text-xs text-gray-300">
                            <span className="truncate">{course}</span>
                            <span>{progress.progressPercentage.toFixed(0)}%</span>
                          </div>
                          <div className="w-full bg-gray-600 rounded-full h-1.5">
                            <div
                              className="bg-gradient-to-r from-blue-400 to-purple-500 h-1.5 rounded-full"
                              style={{ width: `${progress.progressPercentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                      {Object.keys(user.courseProgress).length > 2 && (
                        <div className="text-xs text-gray-400">
                          +{Object.keys(user.courseProgress).length - 2} more courses
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* View Details Button */}
                <button
                  onClick={() => openUserDetails(user)}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-xl font-semibold hover:scale-105 transition-all duration-200"
                >
                  <FaEye /> View Full Details
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* User Details Modal */}
        {showModal && selectedUser && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/20">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <FaUser className="text-white text-2xl" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">{selectedUser.username}</h2>
                    <p className="text-blue-300">{selectedUser.fullName || "Name not provided"}</p>
                    {selectedUser.isAdmin && (
                      <span className="inline-block bg-yellow-600 text-yellow-100 px-3 py-1 rounded-full text-xs font-bold mt-2">
                        ADMIN USER
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="text-white hover:text-red-400 text-2xl transition-colors"
                >
                  ×
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="bg-white/10 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <FaUser className="text-blue-400" /> Personal Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <FaEnvelope className="text-blue-400 w-5" />
                      <div>
                        <p className="text-gray-300 text-sm">Email</p>
                        <p className="text-white">{selectedUser.email}</p>
                      </div>
                    </div>
                    
                    {selectedUser.contactNumber && (
                      <div className="flex items-center gap-3">
                        <FaPhone className="text-green-400 w-5" />
                        <div>
                          <p className="text-gray-300 text-sm">Phone</p>
                          <p className="text-white">{selectedUser.contactNumber}</p>
                        </div>
                      </div>
                    )}

                    {selectedUser.age && (
                      <div className="flex items-center gap-3">
                        <FaBirthdayCake className="text-pink-400 w-5" />
                        <div>
                          <p className="text-gray-300 text-sm">Age</p>
                          <p className="text-white">{selectedUser.age} years</p>
                        </div>
                      </div>
                    )}

                    {selectedUser.gender && (
                      <div className="flex items-center gap-3">
                        <FaVenusMars className="text-purple-400 w-5" />
                        <div>
                          <p className="text-gray-300 text-sm">Gender</p>
                          <p className="text-white">{selectedUser.gender}</p>
                        </div>
                      </div>
                    )}

                    {selectedUser.address && (
                      <div className="flex items-center gap-3">
                        <FaMapMarkerAlt className="text-red-400 w-5" />
                        <div>
                          <p className="text-gray-300 text-sm">Address</p>
                          <p className="text-white">{selectedUser.address}</p>
                        </div>
                      </div>
                    )}

                    {selectedUser.college && (
                      <div className="flex items-center gap-3">
                        <FaGraduationCap className="text-yellow-400 w-5" />
                        <div>
                          <p className="text-gray-300 text-sm">College</p>
                          <p className="text-white">{selectedUser.college}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <div className="w-5 flex justify-center">
                        {selectedUser.isVerified ? (
                          <FaCheckCircle className="text-green-400" />
                        ) : (
                          <FaTimesCircle className="text-red-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-gray-300 text-sm">Account Status</p>
                        <p className={`font-semibold ${selectedUser.isVerified ? 'text-green-400' : 'text-red-400'}`}>
                          {selectedUser.isVerified ? 'Verified' : 'Unverified'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Course Progress */}
                <div className="bg-white/10 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <FaGraduationCap className="text-blue-400" /> Course Progress
                  </h3>
                  {selectedUser.courseProgress && Object.keys(selectedUser.courseProgress).length > 0 ? (
                    <div className="space-y-4">
                      {Object.entries(selectedUser.courseProgress).map(([course, progress]) => (
                        <div key={course} className="bg-white/10 rounded-xl p-4">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="text-white font-semibold">{course}</h4>
                            <span className="text-blue-300 font-bold">{progress.progressPercentage.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-gray-600 rounded-full h-3 mb-2">
                            <div
                              className="bg-gradient-to-r from-blue-400 via-blue-600 to-purple-500 h-3 rounded-full transition-all duration-500"
                              style={{ width: `${progress.progressPercentage}%` }}
                            ></div>
                          </div>
                          <div className="text-sm text-gray-300">
                            {progress.completedTasks} of {progress.totalTasks} tasks completed
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-400 text-center py-8">
                      No course progress available
                    </div>
                  )}
                </div>

                {/* Completed Roadmaps */}
                {selectedUser.completedRoadmaps && selectedUser.completedRoadmaps.length > 0 && (
                  <div className="bg-white/10 rounded-2xl p-6 lg:col-span-2">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <FaCheckCircle className="text-green-400" /> Completed Roadmaps
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedUser.completedRoadmaps.map((roadmap, index) => (
                        <div key={index} className="bg-white/10 rounded-xl p-4">
                          <h4 className="text-white font-semibold mb-2">Roadmap ID: {roadmap.roadmapId}</h4>
                          <div className="text-sm text-gray-300">
                            <p>Completed Tasks: {roadmap.completedTasks.length}</p>
                            <p>Completed Assignments: {roadmap.completedAssignments.length}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-white/20 text-center">
                <button
                  onClick={closeModal}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:scale-105 transition-all duration-200"
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserManagement;
