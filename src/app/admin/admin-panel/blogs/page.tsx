"use client";

import { useEffect, useState } from "react";
import AdminNavbar from "../AdminNavbar";
import useCurrentUser from "@/lib/useCurrentUser";
import { FaBlog, FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const ManageBlogs = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
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
    setLoading(false);
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-black">
        <div className="text-xl font-semibold text-white animate-pulse">Loading...</div>
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
            <FaBlog className="text-blue-400" /> Manage Blogs
          </h1>
          
          <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl shadow-2xl p-8 text-center">
            <div className="text-6xl text-blue-400 mb-6">
              <FaBlog />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Blog Management</h2>
            <p className="text-gray-300 text-lg mb-8">This feature is coming soon. You'll be able to view, edit, and manage all blogs here.</p>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <a href="/blogs/create" className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-xl font-semibold hover:scale-105 transition-all duration-200">
                <FaPlus /> Create New Blog
              </a>
              <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold opacity-50 cursor-not-allowed">
                <FaEdit /> Edit Blogs (Coming Soon)
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-xl font-semibold opacity-50 cursor-not-allowed">
                <FaTrash /> Delete Blogs (Coming Soon)
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageBlogs;
