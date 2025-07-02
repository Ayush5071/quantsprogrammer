"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import useCurrentUser from "@/lib/useCurrentUser";

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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (user === null) return <div className="text-blue-400 min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user || (!user.isAdmin && user.role !== 'admin')) return <div className="text-red-400 min-h-screen flex items-center justify-center">Access denied. Admin privileges required.</div>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      // Call Gemini API to generate questions
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
      // Now create the interview
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
      setSuccess("Top Interview created!");
      setTimeout(() => router.push("/top-interviews"), 1200);
    } catch (err: any) {
      setError(err.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-blue-950 flex flex-col items-center py-12 px-2 md:px-8">
      {/* Back Button - top left, only on md+ screens */}
      <button
        onClick={() => router.back()}
        className="hidden md:flex fixed top-6 left-4 items-center gap-2 text-blue-400 hover:text-blue-300 hover:underline text-xl md:text-2xl px-6 py-3 rounded-2xl bg-zinc-900 shadow-lg border-2 border-blue-700 transition-all z-50"
        style={{ position: 'fixed', top: '1.5rem', left: '1rem', zIndex: 50 }}
      >
        <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        <span className="hidden sm:inline">Back</span>
      </button>

      <div className="w-full max-w-2xl bg-zinc-900 border-2 border-blue-900 rounded-3xl shadow-2xl p-8 md:p-12 mt-8">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-400 mb-6">Create Top Interview</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <input
            className="rounded-lg bg-zinc-800 text-zinc-100 border border-blue-800 p-3"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <input
            className="rounded-lg bg-zinc-800 text-zinc-100 border border-blue-800 p-3"
            placeholder="Company Name"
            value={company}
            onChange={e => setCompany(e.target.value)}
            required
          />
          <input
            className="rounded-lg bg-zinc-800 text-zinc-100 border border-blue-800 p-3"
            placeholder="Field (e.g. Frontend, Backend, Data Science)"
            value={field}
            onChange={e => setField(e.target.value)}
            required
          />
          <input
            className="rounded-lg bg-zinc-800 text-zinc-100 border border-blue-800 p-3"
            placeholder="Topics (comma separated)"
            value={topics}
            onChange={e => setTopics(e.target.value)}
            required
          />
          <input
            className="rounded-lg bg-zinc-800 text-zinc-100 border border-blue-800 p-3"
            placeholder="Skills (comma separated)"
            value={skills}
            onChange={e => setSkills(e.target.value)}
            required
          />
          <div className="flex gap-4 items-center">
            <label className="text-blue-300 font-semibold">Level</label>
            <select className="rounded-lg bg-zinc-800 text-zinc-100 border border-blue-800 p-3" value={level} onChange={e => setLevel(e.target.value)}>
              {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div className="flex gap-4 items-center">
            <label className="text-blue-300 font-semibold">Number of Questions</label>
            <input
              type="number"
              min={1}
              max={15}
              className="rounded-lg bg-zinc-800 text-zinc-100 border border-blue-800 p-3 w-24"
              value={numQuestions}
              onChange={e => setNumQuestions(Math.max(1, Math.min(15, Number(e.target.value))))}
              required
            />
          </div>
          <textarea
            className="rounded-lg bg-zinc-800 text-zinc-100 border border-blue-800 p-3"
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            rows={2}
          />
          <button type="submit" className="mt-4 px-8 py-3 bg-green-700 hover:bg-green-800 text-white rounded-xl text-lg font-bold shadow transition-all" disabled={loading}>{loading ? "Creating..." : "Create Interview"}</button>
          {error && <div className="text-red-400 font-semibold mt-2">{error}</div>}
          {success && <div className="text-green-400 font-semibold mt-2">{success}</div>}
        </form>
      </div>
    </main>
  );
}
