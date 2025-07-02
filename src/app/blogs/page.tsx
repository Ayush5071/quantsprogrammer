"use client";
import React, { useEffect, useState } from "react";
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
    <div className="relative overflow-x-hidden min-h-screen text-white bg-gradient-to-br from-blue-950 via-zinc-900 to-purple-950">
      {/* Animated grid overlay for glassmorphism effect */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-blue-200/10 to-purple-300/10 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08)_0,transparent_60%),radial-gradient(circle_at_80%_80%,rgba(0,255,255,0.07)_0,transparent_70%)]" />
        {[...Array(50)].map((_, index) => (
          <div
            key={index}
            className="star absolute bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}vh`,
              left: `${Math.random() * 100}vw`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              opacity: 0.5,
              filter: 'blur(0.5px)'
            }}
          />
        ))}
      </div>

      {/* Glassy moon accent */}
      {/* Animated moon accent, styled to match interview page */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 h-48 w-48 rounded-full bg-gradient-to-br from-blue-400 via-white to-purple-400 shadow-2xl border-4 border-blue-200/40 opacity-90 backdrop-blur-2xl animate-moon-bounce" />
/* Add moon bounce animation to global styles if not present */

      {/* Request Button */}
      {user && !user.isAdmin && (!blogRequest || blogRequest.status === "rejected" || blogRequest.status === "pending") && (
        <button
          className="fixed top-8 right-8 z-30 px-6 py-3 bg-gradient-to-r from-blue-700 via-blue-500 to-purple-700 text-white rounded-2xl text-lg font-bold shadow-lg hover:from-blue-800 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all border-2 border-blue-400 hover:border-purple-400 backdrop-blur-xl"
          onClick={handleRequest}
        >
          {blogRequest && blogRequest.status === "pending" ? "Request Pending" : "Request to Write Blog"}
        </button>
      )}
      {/* Create Blog Button for eligible users */}
      {canCreateBlog && (
        <button
          className="fixed top-8 left-8 z-30 px-6 py-3 bg-gradient-to-r from-blue-700 via-blue-600 to-purple-700 text-white rounded-2xl text-lg font-bold shadow-lg hover:from-blue-800 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all border-2 border-blue-400 hover:border-purple-400 backdrop-blur-xl"
          onClick={() => window.location.href = '/blogs/create'}
        >
          + Create Blog
        </button>
      )}

      <div className="relative z-20 text-center py-20 px-4">
        <h1 className="text-5xl font-bebas lg:text-7xl xl:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-teal-400 drop-shadow-lg">
          Discover the Cosmos of Tech Blogs
        </h1>
        <p className="text-xl font-serif text-gray-300 mt-4 max-w-2xl mx-auto">
          Dive into insightful blogs about web development, machine learning, hackathons, and everything tech!
        </p>
      </div>

      <div className="relative z-20 py-8 px-2 sm:px-6 lg:px-16 flex justify-center">
        <div
          className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 glass-panel p-8 rounded-3xl shadow-2xl border border-white/20 backdrop-blur-2xl bg-white/10"
        >
          {blogs.map((blog: any, index: number) => (
            <BlogCard
              key={blog._id || index}
              title={blog.title}
              description={blog.description || blog.content?.replace(/<[^>]+>/g, '').slice(0, 200) + '...'}
              author={blog.author}
              link={`/blogs/${blog._id}`}
              canEdit={!!(user && blog.authorId === user._id)}
              canDelete={!!(user && user.isAdmin)}
              onEdit={() => handleEdit(blog)}
              onDelete={() => handleDelete(blog)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogSection;
