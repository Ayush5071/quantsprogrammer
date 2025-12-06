"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const Editor = dynamic(() => import("@/components/ui/RichTextEditor"), { ssr: false });

export default function CreateBlogPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [link, setLink] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const router = useRouter();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post("/api/upload", formData);
      setCoverImage(res.data.url);
      toast.success("Image uploaded!");
    } catch {
      toast.error("Image upload failed");
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userRes = await axios.get("/api/users/me");
      const user = userRes.data.user;
      await axios.post("/api/blogs", {
        title,
        description,
        content,
        coverImage,
        author: user.fullName || user.username,
        authorId: user._id,
        link,
      });
      toast.success("Blog created!");
      router.push("/blogs");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to create blog");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 py-12 px-4">
      <div className="w-full max-w-3xl bg-zinc-900 rounded-3xl shadow-2xl p-10 border-2 border-blue-900 mb-8">
        <h1 className="text-3xl font-bold text-blue-400 mb-8 text-center">Create a Professional Blog</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="px-4 py-3 rounded-lg bg-zinc-800 text-zinc-100 border border-zinc-700 text-lg"
            required
          />
          <textarea
            placeholder="Short Description (for blog list)"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="px-4 py-3 rounded-lg bg-zinc-800 text-zinc-100 border border-zinc-700 text-lg min-h-[80px]"
            maxLength={300}
            required
          />
          <div>
            <label className="block text-zinc-200 mb-2">Cover Image</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-2" title="Upload cover image" />
            {uploading && <span className="text-blue-400 ml-2">Uploading...</span>}
            {coverImage && <img src={coverImage} alt="cover" className="w-full max-h-60 object-cover rounded-lg mt-2" />}
          </div>
          <Editor value={content} onChange={setContent} />
          <input
            type="text"
            placeholder="External Link (optional)"
            value={link}
            onChange={e => setLink(e.target.value)}
            className="px-4 py-3 rounded-lg bg-zinc-800 text-zinc-100 border border-zinc-700 text-lg"
          />
          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="px-6 py-2 bg-gray-700 text-white rounded-xl text-lg hover:bg-gray-800"
            >
              {showPreview ? "Hide Preview" : "Show Preview"}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-700 text-white rounded-xl text-lg hover:bg-blue-800 disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create Blog"}
            </button>
          </div>
        </form>
      </div>
      {showPreview && (
        <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl p-10 border-2 border-blue-900 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Blog Preview</h2>
          {coverImage && <img src={coverImage} alt="cover" className="w-full max-h-60 object-cover rounded-lg mb-4" />}
          <h1 className="text-3xl font-bold mb-2 text-gray-900">{title}</h1>
          <div className="text-gray-600 mb-4">{description}</div>
          <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
          {link && (
            <div className="mt-4">
              <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">External Link</a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
