"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import useCurrentUser from "@/lib/useCurrentUser";
import AdminLayout from "../admin-panel/AdminLayout";
import { toast } from "react-hot-toast";

const LEVELS = ["Easy", "Medium", "Hard"];

export default function CreateTopInterviewPage() {
  const user = useCurrentUser();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [field, setField] = useState("");
  const [topics, setTopics] = useState("");
  const [skills, setSkills] = useState("");
  const [level, setLevel] = useState(LEVELS[0]);
  const [numQuestions, setNumQuestions] = useState(5);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // undefined = still loading
  if (user === undefined) {
    return (
      <AdminLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-400 text-sm">Loading...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // null = not logged in, or user without admin access
  if (!user || !user.isAdmin) {
    return (
      <AdminLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-red-400 font-medium">Access denied. Admin privileges required.</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const geminiRes = await fetch("/api/top-interviews/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          numQuestions,
          field,
          company,
          topics,
          level,
          skills,
        }),
      });
      if (!geminiRes.ok) throw new Error("Failed to generate questions");
      const { questions } = await geminiRes.json();

      const res = await fetch("/api/top-interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          company,
          field,
          topics,
          level,
          skills,
          questions,
        }),
      });
      if (!res.ok) throw new Error("Failed to create interview");
      toast.success("Top Interview created successfully!");
      setTimeout(() => router.push("/top-interviews"), 1200);
    } catch (err: any) {
      toast.error(err.message || "Error creating interview");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Create Top Interview</h1>
        <p className="text-gray-400 text-sm">Generate AI-powered interview questions for top companies.</p>
      </div>

      {/* Form Card */}
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title & Company Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-[#111118] border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                placeholder="Interview title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Company</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-[#111118] border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                placeholder="e.g. Google, Amazon"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Field</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-[#111118] border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
              placeholder="e.g. Frontend, Backend, Data Science"
              value={field}
              onChange={(e) => setField(e.target.value)}
              required
            />
          </div>

          {/* Topics & Skills Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Topics</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-[#111118] border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                placeholder="React, Node.js, SQL (comma separated)"
                value={topics}
                onChange={(e) => setTopics(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Skills</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-[#111118] border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                placeholder="Problem solving, System design"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Level & Questions Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty Level</label>
              <select
                className="w-full px-4 py-3 bg-[#111118] border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                {LEVELS.map((l) => (
                  <option key={l} value={l} className="bg-[#111118]">
                    {l}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Number of Questions</label>
              <input
                type="number"
                min={1}
                max={15}
                className="w-full px-4 py-3 bg-[#111118] border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                value={numQuestions}
                onChange={(e) => setNumQuestions(Math.max(1, Math.min(15, Number(e.target.value))))}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              className="w-full px-4 py-3 bg-[#111118] border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none"
              placeholder="Brief description of the interview..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating Questions...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Interview
              </>
            )}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
