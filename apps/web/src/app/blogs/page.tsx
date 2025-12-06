"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { 
  ArrowLeft, 
  PenLine, 
  BookOpen, 
  Clock, 
  User, 
  Trash2, 
  Edit3, 
  Plus,
  Search,
  Sparkles,
  TrendingUp
} from "lucide-react";

interface UserType {
  isAdmin?: boolean;
  _id?: string;
}
interface BlogRequest {
  status?: string;
}

const BlogSection = () => {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState<UserType | null>(null);
  const [blogRequest, setBlogRequest] = useState<BlogRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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
    router.push(`/blogs/edit?id=${blog._id}`);
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

  const canCreateBlog = user && (user.isAdmin || (blogRequest && blogRequest.status === "accepted"));

  const filteredBlogs = blogs.filter((blog: any) =>
    blog.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.author?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-[128px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/')}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-400" />
                <h1 className="text-lg font-bold text-white">Tech Blogs</h1>
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              {user && !user.isAdmin && (!blogRequest || blogRequest.status !== "accepted") && (
                <button
                  onClick={handleRequest}
                  disabled={blogRequest?.status === "pending"}
                  className="px-4 py-2 text-sm text-gray-300 hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-all disabled:opacity-50"
                >
                  {blogRequest?.status === "pending" ? "Pending..." : "Request Access"}
                </button>
              )}
              {canCreateBlog && (
                <Link
                  href="/blogs/create"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-blue-500 hover:to-indigo-500 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Write Blog
                </Link>
              )}
            </div>

            {/* Mobile Create Button */}
            {canCreateBlog && (
              <Link
                href="/blogs/create"
                className="md:hidden p-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg"
              >
                <Plus className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-300">Community Blog Hub</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Explore Tech
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Insights</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Discover tutorials, guides, and knowledge shared by our developer community.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-xl mx-auto mb-10"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search blogs by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#111118] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex items-center justify-center gap-6 mb-10 text-sm"
        >
          <div className="flex items-center gap-2 text-gray-400">
            <BookOpen className="w-4 h-4 text-blue-400" />
            <span>{blogs.length} Blogs</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span>Updated Daily</span>
          </div>
        </motion.div>

        {/* Blog Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse p-6 bg-[#111118] border border-white/5 rounded-2xl">
                <div className="h-6 bg-white/10 rounded mb-4 w-3/4" />
                <div className="h-4 bg-white/5 rounded mb-2" />
                <div className="h-4 bg-white/5 rounded mb-4 w-2/3" />
                <div className="h-10 bg-white/10 rounded" />
              </div>
            ))}
          </div>
        ) : filteredBlogs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-blue-500/10 rounded-full flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchQuery ? "No blogs found" : "No blogs yet"}
            </h3>
            <p className="text-gray-400 mb-6">
              {searchQuery ? "Try a different search term" : "Be the first to share your knowledge!"}
            </p>
            {canCreateBlog && (
              <Link
                href="/blogs/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all"
              >
                <PenLine className="w-5 h-5" />
                Write First Blog
              </Link>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog: any, index: number) => (
              <motion.article
                key={blog._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group relative p-6 bg-[#111118] border border-white/5 rounded-2xl hover:border-white/10 transition-all cursor-pointer"
                onClick={() => router.push(`/blogs/${blog._id}`)}
              >
                {/* Category Badge */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-medium rounded-full">
                    Tech
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    5 min read
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                  {blog.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {blog.description || blog.content?.replace(/<[^>]+>/g, '').slice(0, 100) + '...'}
                </p>

                {/* Author */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm text-gray-300">{blog.author}</span>
                  </div>

                  {/* Edit/Delete for authorized users */}
                  {user && (blog.authorId === user._id || user.isAdmin) && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {blog.authorId === user._id && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleEdit(blog); }}
                          className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-blue-400 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}
                      {user.isAdmin && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(blog); }}
                          className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default BlogSection;
 