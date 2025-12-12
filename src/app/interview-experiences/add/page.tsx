"use client";

import React, { useState, useEffect } from "react";
import useCurrentUser from "@/lib/useCurrentUser";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import dynamic from 'next/dynamic';
const RichTextEditor = dynamic(() => import('@/components/ui/RichTextEditor'), { ssr: false });
import AdminLayout from "@/app/admin/admin-panel/AdminLayout"; // not necessary, use public layout

export default function AddInterviewExperience() {
  const user = useCurrentUser();
  const router = useRouter();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [company, setCompany] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user === undefined) return;
    if (user === null) {
      router.push("/auth/login-required");
      return;
    }
    setIsAuthChecked(true);
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      const payload = { title, subtitle, content, company, tags: tags?.split(',').map(t => t.trim()).filter(Boolean) };
      const res = await axios.post('/api/interview-experience', payload);
      if (res.data.experience) {
        // redirect to the public page and show thanks
        toast.success('Submitted for admin review');
        router.push('/interview-experiences');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to submit');
    }
    setSaving(false);
  };

  if (!isAuthChecked) return <div className="min-h-[40vh] flex items-center justify-center">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold text-white mb-3">Share your interview experience</h1>
      <p className="text-gray-400 mb-6">Share interview details, tips, and what you learned. Submission will be visible once approved by an admin.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-300 mb-2">Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} className="w-full p-3 rounded-lg bg-[#0b0b12] border border-white/10 text-white" />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-2">Subtitle (optional)</label>
          <input value={subtitle} onChange={e => setSubtitle(e.target.value)} className="w-full p-3 rounded-lg bg-[#0b0b12] border border-white/10 text-white" />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-2">Company (optional)</label>
          <input value={company} onChange={e => setCompany(e.target.value)} className="w-full p-3 rounded-lg bg-[#0b0b12] border border-white/10 text-white" placeholder="e.g., Google" />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-2">Tags (comma separated)</label>
          <input value={tags} onChange={e => setTags(e.target.value)} className="w-full p-3 rounded-lg bg-[#0b0b12] border border-white/10 text-white" />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-2">Content</label>
          <RichTextEditor value={content} onChange={setContent} />
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-pink-500 text-white">{saving ? 'Submitting...' : 'Submit for Approval'}</button>
          <button type="button" onClick={() => router.back()} className="px-4 py-2 rounded-lg border border-white/10 text-white">Cancel</button>
        </div>
      </form>
    </div>
  );
}
