"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BlogCard } from "@/components/component/BlogCard";
import { gsap } from "gsap";
import axios from "axios";
import { toast } from "react-hot-toast";

interface User {
  isAdmin?: boolean;
  _id?: string;
}
interface BlogRequest {
  status?: string;
}

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState<User | null>(null);
  const [blogRequest, setBlogRequest] = useState<BlogRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("/api/blogs");
        setBlogs(res.data.blogs || []);
      } catch {
        setBlogs([]);
      }
    };
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/users/me");
        setUser(res.data.user);
        // Fetch blog request status
        const reqRes = await axios.get(
          `/api/blogs/request?userId=${res.data.user._id}`
        );
        setBlogRequest(reqRes.data.request || null);
      } catch {
        setUser(null);
      }
    };
    fetchBlogs();
    fetchUser();
    setLoading(false);
  }, []);

  const handleRequest = async () => {
    try {
      const res = await axios.post("/api/blogs/request", { userId: user!._id });
      setBlogRequest(res.data.request);
      toast.success("Request sent to admin!");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Request failed");
    }
  };

  const handleEdit = (blog: any) => {
    window.location.href = `/blogs/edit?id=${blog._id}`;
  };
  const handleDelete = async (blog: any) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await axios.delete("/api/blogs/edit", { data: { blogId: blog._id, adminId: user!._id } });
      setBlogs((prev) => prev.filter((b: any) => b._id !== blog._id));
      toast.success("Blog deleted!");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to delete blog");
    }
  };

  useEffect(() => {
    const timeline = gsap.timeline();
    timeline.fromTo(
      ".moon",
      { y: "50vh", x: "50%", opacity: 0 },
      { y: "-10vh", x: "50%", opacity: 1, duration: 3, ease: "power2.out", scale: 2 }
    );
    gsap.to(".star", {
      opacity: 0.7,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: { amount: 1, from: "random" },
    });
  }, []);

  // Add logic to check if user can create blog
  const canCreateBlog = user && (user.isAdmin || (blogRequest && blogRequest.status === "accepted"));

  return (
    <section className="w-full min-h-screen flex flex-col items-center justify-start px-4 sm:px-6 md:px-8 relative overflow-hidden">
      {/* Enhanced Background Effects - matching hero section exactly */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-900 to-black"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(37,99,235,0.12),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(29,78,216,0.08),transparent_70%)]"></div>
      
      {/* Animated Grid Pattern - matching hero section */}
      <div className="absolute inset-0 opacity-20">
        <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)]"></div>
      </div>

      {/* Action Buttons */}
      {user && !user.isAdmin && (!blogRequest || blogRequest.status === "rejected" || blogRequest.status === "pending") && (
        <button
          className="fixed top-6 right-6 z-30 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg text-sm font-semibold shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:from-blue-500 hover:to-blue-700 backdrop-blur-lg border border-white/20"
          onClick={handleRequest}
        >
          {blogRequest && blogRequest.status === "pending" ? "Pending" : "Request Access"}
        </button>
      )}
      {canCreateBlog && (
        <button
          className="fixed top-6 left-6 z-30 px-4 py-2 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-lg text-sm font-semibold shadow-lg hover:shadow-green-500/25 transition-all duration-300 hover:from-green-500 hover:to-green-700 backdrop-blur-lg border border-white/20"
          onClick={() => window.location.href = '/blogs/create'}
        >
          + Create Blog
        </button>
      )}

      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col justify-start py-8 pt-24 sm:pt-32">
        {/* Hero-style Header - matching HeroPage exactly */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6 sm:mb-8"
          >
            {/* Trust Badge - Hidden on mobile */}
            <div className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full text-sm text-zinc-300 mb-4 sm:mb-6 hover:bg-white/15 transition-all duration-300">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Tech Blog Hub</span>
            </div>
            
            {/* Main Heading - Hero style */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-blue-300 mb-4 sm:mb-6 leading-[0.85] tracking-tight text-center">
              Explore Our
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600">
                Tech Blogs
              </span>
            </h1>
            
            {/* Subtitle - Hero style */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-zinc-300 font-medium max-w-2xl md:max-w-4xl mx-auto mb-6 sm:mb-8 leading-relaxed px-4 text-center">
              <span className="md:hidden">Discover insights, tutorials, and knowledge from our developer community</span>
              <span className="hidden md:inline">Dive into insightful blogs about web development, machine learning, and everything tech—written by our community of 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 font-semibold"> passionate developers</span></span>
            </p>
          </motion.div>
        </div>

        {/* Blog Cards Grid - inspired by Complete Development Platform */}
        <div className="w-full">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl">
                    <div className="h-6 bg-white/10 rounded mb-4"></div>
                    <div className="h-4 bg-white/10 rounded mb-2"></div>
                    <div className="h-4 bg-white/10 rounded mb-4"></div>
                    <div className="h-10 bg-white/10 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center py-20"
            >
              <div className="p-12 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Blogs Yet</h3>
                <p className="text-zinc-300">Be the first to share your knowledge with the community!</p>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog: any, index: number) => (
                <motion.div
                  key={blog._id || index}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="group relative p-8 bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-lg border border-white/10 rounded-2xl hover:border-white/20 transition-all duration-500 shadow-xl cursor-pointer"
                  onClick={() => window.location.href = `/blogs/${blog._id}`}
                >
                  {/* Background Gradient Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl" />
                  
                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-6">
                      <div className="p-3 bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-blue-200 transition-all duration-300 line-clamp-2">
                          {blog.title}
                        </h3>
                        <p className="text-zinc-300 text-sm md:text-base leading-relaxed group-hover:text-zinc-200 transition-colors duration-300 line-clamp-3">
                          {blog.description || blog.content?.replace(/<[^>]+>/g, '').slice(0, 150) + '...'}
                        </p>
                      </div>
                    </div>

                    {/* Author Info */}
                    <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 mb-6">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex-shrink-0" />
                      <span className="text-sm font-medium text-zinc-200 group-hover:text-zinc-100 transition-colors duration-300">
                        By {blog.author}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          window.location.href = `/blogs/${blog._id}`;
                        }}
                      >
                        Read Blog
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </motion.button>
                      
                      {/* Edit/Delete buttons for authorized users */}
                      {(user && blog.authorId === user._id) && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="py-3 px-4 bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold rounded-xl shadow-lg transition-all duration-300"
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            handleEdit(blog);
                          }}
                        >
                          Edit
                        </motion.button>
                      )}
                      {(user && user.isAdmin) && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="py-3 px-4 bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold rounded-xl shadow-lg transition-all duration-300"
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            handleDelete(blog);
                          }}
                        >
                          Delete
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
