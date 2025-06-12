"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const RoadmapCreate = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [phases, setPhases] = useState<any[]>([]);
  const [phaseTitle, setPhaseTitle] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Admin check (JWT in localStorage)
  let isAdmin = false;
  if (typeof window !== "undefined") {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        isAdmin = payload.isAdmin === true;
      }
    } catch {}
  }

  if (!isAdmin) {
    return <div className="text-red-400 text-2xl p-8">Only admin can create roadmaps.</div>;
  }

  const addPhase = () => {
    if (!phaseTitle.trim()) return;
    setPhases([...phases, { title: phaseTitle, tasks: [] }]);
    setPhaseTitle("");
  };

  const addTask = (phaseIdx: number, type: "task" | "assignment") => {
    const taskTitle = prompt(`Enter ${type === "task" ? "Task" : "Assignment"} Title:`);
    if (!taskTitle) return;
    setPhases((prev) =>
      prev.map((phase, idx) =>
        idx === phaseIdx
          ? {
              ...phase,
              tasks: [
                ...phase.tasks,
                type === "task"
                  ? { title: taskTitle }
                  : { title: taskTitle, assignment: taskTitle },
              ],
            }
          : phase
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const token = localStorage.getItem("token");
    const payload = token ? JSON.parse(atob(token.split(".")[1])) : {};
    const createdBy = payload.email || "admin";
    try {
      const res = await fetch("/api/roadmap/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, createdBy, phases }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create roadmap");
      setSuccess("Roadmap created successfully!");
      setTitle("");
      setDescription("");
      setPhases([]);
      setTimeout(() => router.push("/explore"), 1200);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-gray-900 text-white rounded-xl mt-8 shadow-2xl">
      <h1 className="text-3xl font-bold mb-6">Create New Roadmap</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">Roadmap Title</label>
          <input
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Description</label>
          <textarea
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Phases</label>
          <div className="flex gap-2 mb-2">
            <input
              className="flex-1 p-2 rounded bg-gray-800 border border-gray-700"
              value={phaseTitle}
              onChange={(e) => setPhaseTitle(e.target.value)}
              placeholder="Phase Title"
            />
            <button type="button" className="bg-blue-600 px-4 py-2 rounded" onClick={addPhase}>
              Add Phase
            </button>
          </div>
          {phases.map((phase, idx) => (
            <div key={idx} className="bg-gray-800 rounded p-3 mb-2">
              <div className="font-semibold mb-1">{phase.title}</div>
              <div className="flex gap-2 mb-2">
                <button
                  type="button"
                  className="bg-green-600 px-2 py-1 rounded text-xs"
                  onClick={() => addTask(idx, "task")}
                >
                  Add Task
                </button>
                <button
                  type="button"
                  className="bg-yellow-600 px-2 py-1 rounded text-xs"
                  onClick={() => addTask(idx, "assignment")}
                >
                  Add Assignment
                </button>
              </div>
              <ul className="ml-4 list-disc text-sm">
                {phase.tasks.map((task: any, tIdx: number) => (
                  <li key={tIdx}>
                    {task.title} {task.assignment && <span className="text-yellow-300">[Assignment]</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {error && <div className="text-red-400 mb-2">{error}</div>}
        {success && <div className="text-green-400 mb-2">{success}</div>}
        <button type="submit" className="bg-blue-700 px-6 py-2 rounded font-bold mt-2">
          Create Roadmap
        </button>
      </form>
    </div>
  );
};

export default RoadmapCreate;
