"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import parse from "html-react-parser";
import axios from "axios";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, BookOpen, Heart, MessageCircle, Send, Trash2, User, Share2 } from "lucide-react";
import { toast } from "react-hot-toast";

interface Comment {
  _id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

interface Blog {
  _id: string;
  title: string;
  description?: string;
  content: string;
  coverImage?: string;
  author: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  likes?: string[];
  comments?: Comment[];
}

interface CurrentUser {
  _id: string;
  username: string;
  email: string;
}

export default function BlogDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const commentInputRef = React.useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [blogRes, userRes] = await Promise.all([
          axios.get(`/api/blogs?id=${id}`),
          axios.get("/api/users/me").catch(() => null)
        ]);
        
        const blogData = blogRes.data.blog;
        setBlog(blogData);
        setLikesCount(blogData.likes?.length || 0);
        setComments(blogData.comments || []);
        
        if (userRes?.data?.user) {
          setUser(userRes.data.user);
          setLiked(blogData.likes?.includes(userRes.data.user._id) || false);
        }
      } catch (err) {
        setError("Failed to load blog.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleLike = async () => {
    if (!user) {
      toast.error("Please login to like this article");
      router.push("/auth/login");
      return;
    }

    try {
      const res = await axios.post("/api/blogs/like", {
        blogId: id,
        userId: user._id
      });
      
      setLiked(res.data.liked);
      setLikesCount(res.data.likesCount);
      
      if (res.data.liked) {
        toast.success("Added to your liked articles!");
      }
    } catch (error) {
      toast.error("Failed to update like");
    }
  };

  const handleAddComment = async () => {
    if (!user) {
      toast.error("Please login to comment");
      router.push("/auth/login");
      return;
    }

    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    setSubmittingComment(true);
    try {
      const res = await axios.post("/api/blogs/comments", {
        blogId: id,
        userId: user._id,
        userName: user.username || user.email.split("@")[0],
        content: newComment.trim()
      });
      
      setComments([...comments, res.data.comment]);
      setNewComment("");
      toast.success("Comment added!");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to add comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!user) return;

    try {
      await axios.delete(`/api/blogs/comments?blogId=${id}&commentId=${commentId}&userId=${user._id}`);
      setComments(comments.filter(c => c._id !== commentId));
      toast.success("Comment deleted");
    } catch (error) {
      toast.error("Failed to delete comment");
    }
  };

  const getReadingTime = (content: string) => {
    const text = content.replace(/<[^>]*>/g, '');
    const words = text.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return minutes;
  };

  const formatDate = (date: string) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffMs = now.getTime() - commentDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return commentDate.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-400">Loading article...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Error Loading Blog</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => router.push('/blogs')}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-500 hover:to-indigo-500 transition-all"
          >
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-500/10 flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Blog Not Found</h2>
          <p className="text-gray-400 mb-6">The article you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/blogs')}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-500 hover:to-indigo-500 transition-all"
          >
            Browse All Blogs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.06),transparent_50%)]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2 text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-medium">Back</span>
            </button>
            <div className="flex-1" />
            <button
              onClick={() => router.push('/blogs')}
              className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            >
              All Blogs
            </button>
            <button onClick={() => { setShowComments((s) => !s); setTimeout(() => commentInputRef.current?.focus(), 150); }} className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">Comments</button>
            <div className="relative">
              <button onClick={() => setShowShareMenu(s => !s)} className="px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">Share</button>
              {showShareMenu && (
                <div className="absolute right-0 mt-2 w-[210px] bg-[#0b0b12] border border-white/10 rounded-lg shadow-lg p-2 z-50">
                  <button className="w-full text-left px-3 py-2 hover:bg-white/5 rounded-md text-sm" onClick={() => { window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(blog?.title + ' ' + window.location.href)}`, '_blank'); setShowShareMenu(false); }}>WhatsApp</button>
                  <button className="w-full text-left px-3 py-2 hover:bg-white/5 rounded-md text-sm" onClick={() => { window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank'); setShowShareMenu(false); }}>Facebook</button>
                  <button className="w-full text-left px-3 py-2 hover:bg-white/5 rounded-md text-sm" onClick={() => { window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog?.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank'); setShowShareMenu(false); }}>Twitter</button>
                  <button className="w-full text-left px-3 py-2 hover:bg-white/5 rounded-md text-sm" onClick={() => { window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank'); setShowShareMenu(false); }}>LinkedIn</button>
                  <button className="w-full text-left px-3 py-2 hover:bg-white/5 rounded-md text-sm" onClick={() => { navigator.clipboard.writeText(window.location.href); setShowShareMenu(false); toast.success('Link copied'); }}>Copy link</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Cover Image */}
          {blog.coverImage && (
            <div className="relative mb-8 rounded-2xl overflow-hidden">
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="w-full h-64 sm:h-80 md:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {blog.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-8 pb-8 border-b border-white/10">
            {/* Author */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                {blog.author?.[0]?.toUpperCase() || 'A'}
              </div>
              <div>
                <p className="text-white font-medium text-sm">{blog.author || "Anonymous"}</p>
                <p className="text-gray-500 text-xs">Author</p>
              </div>
            </div>

            <div className="hidden sm:block w-px h-8 bg-white/10" />

            {/* Date */}
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">
                {new Date(blog.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            {/* Reading Time */}
            <div className="flex items-center gap-2 text-gray-400">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{getReadingTime(blog.content)} min read</span>
            </div>
          </div>

          {/* Description */}
          {blog.description && (
            <div className="mb-8 p-6 rounded-xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10">
              <p className="text-lg text-gray-300 leading-relaxed italic">
                {blog.description}
              </p>
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg prose-invert max-w-none
            prose-headings:text-white prose-headings:font-bold
            prose-h1:text-3xl prose-h1:mt-10 prose-h1:mb-4
            prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
            prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4
            prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-white prose-strong:font-semibold
            prose-code:text-blue-300 prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-[#111118] prose-pre:rounded-xl prose-pre:p-4
            prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-white/5 prose-blockquote:rounded-r-lg prose-blockquote:pl-6 prose-blockquote:py-4 prose-blockquote:italic prose-blockquote:text-gray-300
            prose-ul:text-gray-300 prose-ol:text-gray-300
            prose-li:marker:text-blue-400
            prose-img:rounded-xl prose-img:shadow-lg
            prose-hr:border-white/10
          ">
            {parse(blog.content)}
          </div>

          {/* Like and Comment Actions */}
          <div className="mt-10 pt-8 border-t border-white/10">
            <div className="flex items-center gap-6">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
                  liked
                    ? "bg-pink-500/20 text-pink-400 border border-pink-500/30"
                    : "bg-white/5 text-gray-400 hover:text-pink-400 hover:bg-pink-500/10 border border-white/10"
                }`}
              >
                <Heart className={`w-5 h-5 ${liked ? "fill-pink-400" : ""}`} />
                <span>{likesCount}</span>
                <span className="hidden sm:inline">{likesCount === 1 ? "Like" : "Likes"}</span>
              </button>
              
              <button
                onClick={() => setShowComments(!showComments)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
                  showComments
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    : "bg-white/5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 border border-white/10"
                }`}
              >
                <MessageCircle className="w-5 h-5" />
                <span>{comments.length}</span>
                <span className="hidden sm:inline">{comments.length === 1 ? "Comment" : "Comments"}</span>
              </button>
            </div>

            {/* Comments Section */}
            {showComments && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6"
              >
                {/* Add Comment */}
                <div className="mb-6">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {user ? (user.username?.[0] || user.email[0]).toUpperCase() : <User className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <textarea
                        ref={commentInputRef}
                        id="blog-comment-input"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder={user ? "Write a comment..." : "Login to comment"}
                        className="w-full px-4 py-3 bg-white/5 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                        rows={3}
                        disabled={!user}
                      />
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={handleAddComment}
                          disabled={!user || submittingComment || !newComment.trim()}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-500 hover:to-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {submittingComment ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <Send className="w-4 h-4" />
                          )}
                          Post
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                  {comments.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageCircle className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                    </div>
                  ) : (
                    comments.map((comment) => (
                      <motion.div
                        key={comment._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3 p-4 bg-white/[0.02] rounded-xl"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                          {comment.userName?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <div className="flex items-center gap-2">
                              <span className="text-white font-medium text-sm">{comment.userName}</span>
                              <span className="text-gray-500 text-xs">{formatDate(comment.createdAt)}</span>
                            </div>
                            {user?._id === comment.userId && (
                              <button
                                onClick={() => handleDeleteComment(comment._id)}
                                className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <p className="text-gray-300 text-sm">{comment.content}</p>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-gray-500 text-sm">
                Last updated: {new Date(blog.updatedAt || blog.createdAt).toLocaleDateString()}
              </p>
              <button
                onClick={() => router.push('/blogs')}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium rounded-xl transition-all"
              >
                Read More Articles
              </button>
            </div>
          </div>
        </motion.article>
      </main>
    </div>
  );
}
