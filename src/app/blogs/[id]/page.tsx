"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import parse from "html-react-parser";
import axios from "axios";

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
}

export default function BlogDetailPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBlog() {
      try {
        const res = await axios.get(`/api/blogs?id=${id}`);
        setBlog(res.data.blog);
      } catch (err) {
        setError("Failed to load blog.");
      } finally {
        setLoading(false);
      }
    }
    fetchBlog();
  }, [id]);

  if (loading) return <div className="py-10 text-center">Loading...</div>;
  if (error) return <div className="py-10 text-center text-red-500">{error}</div>;
  if (!blog) return <div className="py-10 text-center">Blog not found.</div>;

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-blue-950 py-12 px-2">
      <article className="max-w-3xl mx-auto bg-white/95 rounded-3xl shadow-2xl p-8 md:p-14 border border-blue-200">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => window.history.length > 1 ? window.history.back() : window.location.href = '/blogs'}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 transition-colors shadow"
          >
            ← Back
          </button>
          <a
            href="/blogs"
            className="px-4 py-2 bg-zinc-100 text-zinc-700 rounded-lg font-semibold hover:bg-zinc-200 transition-colors shadow"
          >
            All Blogs
          </a>
        </div>
        {blog.coverImage && (
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full max-h-96 object-cover rounded-2xl mb-8 shadow-lg border border-blue-100"
          />
        )}
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-4 leading-tight tracking-tight">
          {blog.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 mb-8 text-zinc-500 text-base font-medium">
          <span className="inline-flex items-center gap-2">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="#3b82f6" />
              <text
                x="12"
                y="16"
                textAnchor="middle"
                fontSize="12"
                fill="#fff"
              >
                {blog.author[0]}
              </text>
            </svg>
            {blog.author || "Unknown"}
          </span>
          <span>•</span>
          <span>
            {new Date(blog.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
        {blog.description && (
          <p className="text-xl text-blue-700 font-medium mb-8 bg-blue-50 rounded-lg px-6 py-4 border-l-4 border-blue-400">
            {blog.description}
          </p>
        )}
        <div className="prose prose-lg max-w-none text-zinc-900 prose-img:rounded-xl prose-img:shadow-md prose-img:border prose-img:border-blue-100 prose-a:text-blue-700 prose-a:underline">
          {parse(blog.content)}
        </div>
      </article>
    </main>
  );
}
