"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../AdminLayout";
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
  courseProgress?: Record<
    string,
    {
      totalTasks: number;
      completedTasks: number;
      progressPercentage: number;
    }
  >;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const user = useCurrentUser();

  useEffect(() => {
    // undefined = still loading, wait
    if (user === undefined) return;
    
    // null = not logged in or user loaded without admin
    if (user === null || !user?.isAdmin) {
      setError("Access denied. Admin privileges required.");
      setLoading(false);
      return;
    }
  }, [user]);

  useEffect(() => {
    if (user && user.isAdmin) {
      axios
        .get("/api/admin/admin-panel")
        .then((response) => {
          setUsers(response.data.data);
          setLoading(false);
        })
        .catch(() => {
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

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-400 text-sm">Loading users...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-red-400 font-medium">{error}</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">User Management</h1>
          <p className="text-gray-400 text-sm">View and manage all registered users.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="px-3 py-1 bg-[#111118] border border-white/10 rounded-lg">
            {users.length} total users
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by username or email..."
            className="w-full pl-10 pr-4 py-3 bg-[#111118] border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="bg-[#111118] border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all"
          >
            {/* User Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium text-lg">
                  {user.username?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{user.username}</span>
                    {user.isAdmin && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-yellow-500/20 text-yellow-400">
                        ADMIN
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 truncate max-w-[180px]">{user.email}</div>
                </div>
              </div>
              {user.isVerified ? (
                <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                  Verified
                </span>
              ) : (
                <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
                  Pending
                </span>
              )}
            </div>

            {/* User Info */}
            <div className="space-y-2 mb-4">
              {user.college && (
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                  <span className="truncate">{user.college}</span>
                </div>
              )}
              {user.courseProgress && Object.keys(user.courseProgress).length > 0 && (
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>{Object.keys(user.courseProgress).length} courses in progress</span>
                </div>
              )}
            </div>

            {/* View Details Button */}
            <button
              onClick={() => openUserDetails(user)}
              className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Details
            </button>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <svg className="w-12 h-12 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <p className="text-gray-500">No users found matching your search.</p>
        </div>
      )}

      {/* User Details Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111118] border border-white/10 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-medium">
                  {selectedUser.username?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white">{selectedUser.username}</h2>
                    {selectedUser.isAdmin && (
                      <span className="px-2 py-0.5 rounded text-xs font-bold bg-yellow-500/20 text-yellow-400">ADMIN</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400">{selectedUser.fullName || "Name not provided"}</p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 space-y-6">
              {/* Personal Info */}
              <div>
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">Personal Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">Email</div>
                    <div className="text-sm text-white">{selectedUser.email}</div>
                  </div>
                  {selectedUser.contactNumber && (
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">Phone</div>
                      <div className="text-sm text-white">{selectedUser.contactNumber}</div>
                    </div>
                  )}
                  {selectedUser.age && (
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">Age</div>
                      <div className="text-sm text-white">{selectedUser.age} years</div>
                    </div>
                  )}
                  {selectedUser.gender && (
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">Gender</div>
                      <div className="text-sm text-white">{selectedUser.gender}</div>
                    </div>
                  )}
                  {selectedUser.college && (
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">College</div>
                      <div className="text-sm text-white">{selectedUser.college}</div>
                    </div>
                  )}
                  {selectedUser.address && (
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">Address</div>
                      <div className="text-sm text-white">{selectedUser.address}</div>
                    </div>
                  )}
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">Account Status</div>
                    <div className={`text-sm font-medium ${selectedUser.isVerified ? "text-green-400" : "text-yellow-400"}`}>
                      {selectedUser.isVerified ? "Verified" : "Pending Verification"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Course Progress */}
              {selectedUser.courseProgress && Object.keys(selectedUser.courseProgress).length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">Course Progress</h3>
                  <div className="space-y-3">
                    {Object.entries(selectedUser.courseProgress).map(([course, progress]) => (
                      <div key={course} className="bg-white/5 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-white font-medium">{course}</span>
                          <span className="text-xs text-blue-400 font-bold">{progress.progressPercentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                            style={{ width: `${progress.progressPercentage}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {progress.completedTasks} of {progress.totalTasks} tasks
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Completed Roadmaps */}
              {selectedUser.completedRoadmaps && selectedUser.completedRoadmaps.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">Completed Roadmaps</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedUser.completedRoadmaps.map((roadmap, index) => (
                      <div key={index} className="bg-white/5 rounded-lg p-3">
                        <div className="text-sm text-white font-medium mb-1">Roadmap #{roadmap.roadmapId}</div>
                        <div className="text-xs text-gray-500">
                          {roadmap.completedTasks.length} tasks • {roadmap.completedAssignments.length} assignments
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-white/10">
              <button
                onClick={closeModal}
                className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-sm font-medium rounded-lg transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default UserManagement;
