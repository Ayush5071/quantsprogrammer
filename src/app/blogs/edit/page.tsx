"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

const Editor = dynamic(() => import("@/components/ui/RichTextEditor"), { ssr: false });

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export default function EditBlogPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [blog, setBlog] = useState<any>(null);
  const router = useRouter();
  const params = useSearchParams();
  const blogId = params.get("id");

  useEffect(() => {
    if (!blogId) return;
    axios.get(`/api/blogs?id=${blogId}`).then(res => {
      const b = res.data.blogs?.[0];
      setBlog(b);
      setTitle(b?.title || "");
      setContent(b?.content || "");
      setCoverImage(b?.coverImage || null);
    });
  }, [blogId]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset || "");
    try {
      const res = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData);
      setCoverImage(res.data.secure_url);
      toast.success("Image uploaded!");
    } catch {
      toast.error("Image upload failed");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userRes = await axios.get("/api/users/me");
      const user = userRes.data.user;
      await axios.patch("/api/blogs/edit", {
        blogId,
        authorId: user._id,
        title,
        content,
        coverImage,
      });
      toast.success("Blog updated!");
      router.push("/blogs");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to update blog");
    }
    setLoading(false);
  };

  if (!blogId) return <div className="text-white p-8">No blog selected.</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 py-12 px-4">
      <div className="w-full max-w-3xl bg-zinc-900 rounded-3xl shadow-2xl p-10 border-2 border-blue-900">
        <h1 className="text-3xl font-bold text-blue-400 mb-8 text-center">Edit Blog</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="px-4 py-3 rounded-lg bg-zinc-800 text-zinc-100 border border-zinc-700 text-lg"
            required
          />
          <div>
            <label className="block text-zinc-200 mb-2">Cover Image</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-2" />
            {coverImage && <img src={coverImage} alt="cover" className="w-full max-h-60 object-cover rounded-lg mt-2" />}
          </div>
          <Editor value={content} onChange={setContent} />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-700 text-white rounded-xl text-lg hover:bg-blue-800 disabled:opacity-60"
          >
            {loading ? "Updating..." : "Update Blog"}
          </button>
        </form>
      </div>
    </div>
  );
}
