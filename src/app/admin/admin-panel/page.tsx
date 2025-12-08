"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "./AdminLayout";
import useCurrentUser from "@/lib/useCurrentUser";
import Link from "next/link";

const AdminPanel = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
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

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-400 text-sm">Loading dashboard...</span>
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

  const verifiedUsers = users.filter((u) => u.isVerified).length;
  const adminUsers = users.filter((u) => u.isAdmin || u.role === "admin").length;
  const usersWithProgress = users.filter((u) => u.courseProgress && Object.keys(u.courseProgress).length > 0).length;

  const stats = [
    {
      label: "Total Users",
      value: users.length,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: "blue",
    },
    {
      label: "Verified",
      value: verifiedUsers,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "green",
    },
    {
      label: "Admins",
      value: adminUsers,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      color: "purple",
    },
    {
      label: "Active Learners",
      value: usersWithProgress,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      color: "orange",
    },
  ];

  const quickActions = [
    {
      label: "Manage Users",
      href: "/admin/admin-panel/users",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      description: "View and manage all registered users",
    },
    {
      label: "Blog Requests",
      href: "/admin/blog-requests",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      description: "Review pending blog write access requests",
    },
    {
      label: "Create Roadmap",
      href: "/admin/admin-panel/roadmap-create",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      description: "Create a new learning roadmap",
    },
    {
      label: "Create Interview",
      href: "/admin/top-interview-create",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      description: "Generate AI-powered interview questions",
    },
    {
      label: "Pricing Settings",
      href: "/admin/pricing",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      description: "Manage premium feature prices",
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      blue: { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/30" },
      green: { bg: "bg-green-500/20", text: "text-green-400", border: "border-green-500/30" },
      purple: { bg: "bg-purple-500/20", text: "text-purple-400", border: "border-purple-500/30" },
      orange: { bg: "bg-orange-500/20", text: "text-orange-400", border: "border-orange-500/30" },
    };
    return colors[color] || colors.blue;
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400 text-sm">Welcome back! Here's an overview of your platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const colors = getColorClasses(stat.color);
          return (
            <div
              key={stat.label}
              className={`bg-[#111118] border ${colors.border} rounded-xl p-4 sm:p-5`}
            >
              <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center mb-3`}>
                <span className={colors.text}>{stat.icon}</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-xs sm:text-sm text-gray-400">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="group bg-[#111118] border border-white/10 rounded-xl p-4 hover:border-blue-500/50 hover:bg-[#151520] transition-all"
            >
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-500/30 transition-all">
                <span className="text-blue-400">{action.icon}</span>
              </div>
              <h3 className="text-white font-medium mb-1">{action.label}</h3>
              <p className="text-xs text-gray-500">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Users Table */}
      <div className="bg-[#111118] border border-white/10 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">Recent Users</h2>
          <Link
            href="/admin/admin-panel/users"
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider hidden sm:table-cell">Email</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider hidden md:table-cell">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.slice(0, 5).map((user) => (
                <tr key={user._id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-medium">
                        {user.username?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{user.username}</div>
                        <div className="text-xs text-gray-500 sm:hidden">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-400 hidden sm:table-cell">{user.email}</td>
                  <td className="py-3 px-4">
                    {user.isVerified ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    {user.courseProgress && Object.keys(user.courseProgress).length > 0 ? (
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                            style={{
                              width: `${Math.min(
                                Object.values(user.courseProgress).reduce(
                                  (acc: number, curr: any) => acc + (curr.progressPercentage || 0),
                                  0
                                ) / Object.keys(user.courseProgress).length,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-400">
                          {Object.keys(user.courseProgress).length} courses
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500">No activity</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPanel;
