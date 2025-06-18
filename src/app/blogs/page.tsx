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
    <div className="relative overflow-x-hidden min-h-screen text-white bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Request Button */}
      {user && !user.isAdmin && (!blogRequest || blogRequest.status === "rejected" || blogRequest.status === "pending") && (
        <button
          className="fixed top-8 right-8 z-30 px-6 py-3 bg-blue-700 text-white rounded-xl text-lg font-semibold shadow hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all"
          onClick={handleRequest}
        >
          {blogRequest && blogRequest.status === "pending" ? "Request Pending" : "Request to Write Blog"}
        </button>
      )}
      {/* Create Blog Button for eligible users */}
      {canCreateBlog && (
        <button
          className="fixed top-8 left-8 z-30 px-6 py-3 bg-green-700 text-white rounded-xl text-lg font-semibold shadow hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition-all"
          onClick={() => window.location.href = '/blogs/create'}
        >
          + Create Blog
        </button>
      )}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
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
            }}
          />
        ))}
      </div>
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 moon z-10 h-48 w-48 rounded-full bg-gradient-to-br from-gray-300 via-white to-blue-200 shadow-2xl border-4 border-white"></div>
      <div className="relative z-20 text-center py-16">
        <h1 className="text-5xl font-bebas lg:text-7xl xl:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-teal-400">
          Discover the Cosmos of Tech Blogs
        </h1>
        <p className="text-xl font-serif text-gray-400 mt-4">
          Dive into insightful blogs about web development, machine learning, hackathons, and everything tech!
        </p>
      </div>
      <div className="relative z-20 py-8 px-4 sm:px-6 lg:px-12">
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          style={{
            background: "inherit",
            boxShadow: "inset 0px 0px 10px rgba(255, 255, 255, 0.1)",
            borderRadius: "8px",
            padding: "1rem",
          }}
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
