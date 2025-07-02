"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "../AdminNavbar";
import useCurrentUser from "@/lib/useCurrentUser";

interface Task {
  title: string;
  link: string;
}
interface Assignment {
  title: string;
  link: string;
}
interface Phase {
  title: string;
  tasks: Task[];
  assignments: Assignment[];
}

const RoadmapCreate = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [phases, setPhases] = useState<Phase[]>([]);
  const [phaseTitle, setPhaseTitle] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState<{ open: boolean; phaseIdx: number | null; type: "task" | "assignment" | null }>({ open: false, phaseIdx: null, type: null });
  const [taskForm, setTaskForm] = useState({ title: "", link: "" });
  const user = useCurrentUser();

  // Check if user is admin
  useEffect(() => {
    if (user === null) {
      // Still loading user data
      return;
    }
    if (user === false || (!user?.isAdmin && user?.role !== 'admin')) {
      // Not logged in or not admin
      setError("Access denied. Admin privileges required.");
      setLoading(false);
      return;
    }
    setLoading(false);
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-black">
        <div className="text-xl font-semibold text-white animate-pulse">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-black">
        <div className="text-xl font-semibold text-red-400">{error}</div>
      </div>
    );
  }

  const addPhase = () => {
    if (!phaseTitle.trim()) return;
    setPhases([...phases, { title: phaseTitle, tasks: [], assignments: [] }]);
    setPhaseTitle("");
  };

  const openTaskModal = (phaseIdx: number, type: "task" | "assignment") => {
    setShowTaskModal({ open: true, phaseIdx, type });
    setTaskForm({ title: "", link: "" });
  };

  const closeTaskModal = () => {
    setShowTaskModal({ open: false, phaseIdx: null, type: null });
    setTaskForm({ title: "", link: "" });
  };

  const handleTaskFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskForm({ ...taskForm, [e.target.name]: e.target.value });
  };

  const addTaskOrAssignment = () => {
    if (!taskForm.title.trim() || !taskForm.link.trim() || showTaskModal.phaseIdx === null || !showTaskModal.type) return;
    setPhases((prev) =>
      prev.map((phase, idx) => {
        if (idx !== showTaskModal.phaseIdx) return phase;
        if (showTaskModal.type === "task") {
          return { ...phase, tasks: [...phase.tasks, { ...taskForm }] };
        } else {
          return { ...phase, assignments: [...phase.assignments, { ...taskForm }] };
        }
      })
    );
    closeTaskModal();
  };

  const removeTask = (phaseIdx: number, taskIdx: number) => {
    setPhases((prev) =>
      prev.map((phase, idx) =>
        idx === phaseIdx ? { ...phase, tasks: phase.tasks.filter((_, tIdx) => tIdx !== taskIdx) } : phase
      )
    );
  };
  const removeAssignment = (phaseIdx: number, assignIdx: number) => {
    setPhases((prev) =>
      prev.map((phase, idx) =>
        idx === phaseIdx ? { ...phase, assignments: phase.assignments.filter((_, aIdx) => aIdx !== assignIdx) } : phase
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
      const formattedPhases = phases.map((phase) => ({
        title: phase.title,
        tasks: phase.tasks,
        assignments: phase.assignments,
      }));
      const res = await fetch("/api/roadmap/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, createdBy, phases: formattedPhases }),
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
    <>
      <AdminNavbar />
      <div className="max-w-3xl mx-auto p-10 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white rounded-3xl mt-12 shadow-2xl border border-gray-700">
        <h1 className="text-4xl font-extrabold mb-8 text-center tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">Create New Roadmap</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block mb-2 text-lg font-semibold">Roadmap Title</label>
            <input
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter roadmap title"
              title="Roadmap Title"
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-lg font-semibold">Description</label>
            <textarea
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter roadmap description"
              title="Roadmap Description"
              rows={3}
            />
          </div>
          <div className="mb-8">
            <label className="block mb-2 text-lg font-semibold">Phases</label>
            <div className="flex gap-2 mb-4">
              <input
                className="flex-1 p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                value={phaseTitle}
                onChange={(e) => setPhaseTitle(e.target.value)}
                placeholder="Phase Title"
              />
              <button type="button" className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-2 rounded-lg font-bold text-white shadow hover:scale-105 transition-transform" onClick={addPhase}>
                Add Phase
              </button>
            </div>
            {phases.map((phase, idx) => (
              <div key={idx} className="bg-gray-900 rounded-2xl p-5 mb-6 shadow-lg border border-gray-700">
                <div className="font-bold text-xl flex justify-between items-center mb-2 text-blue-300">
                  <span>{phase.title}</span>
                </div>
                <div className="flex gap-3 mb-3">
                  <button
                    type="button"
                    className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded-lg text-xs font-semibold shadow"
                    onClick={() => openTaskModal(idx, "task")}
                  >
                    + Add Task
                  </button>
                  <button
                    type="button"
                    className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded-lg text-xs font-semibold shadow"
                    onClick={() => openTaskModal(idx, "assignment")}
                  >
                    + Add Assignment
                  </button>
                </div>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="font-bold text-base mb-2 text-green-400">Tasks</div>
                    <ul className="ml-4 list-disc text-base">
                      {phase.tasks.map((task, tIdx) => (
                        <li key={tIdx} className="flex items-center justify-between mb-2">
                          <span>
                            <span className="font-semibold text-white">{task.title}</span>
                            {task.link && (<a href={task.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline ml-3">[Link]</a>)}
                          </span>
                          <button type="button" className="text-red-400 ml-2 hover:text-red-600 text-lg" onClick={() => removeTask(idx, tIdx)} title="Remove Task">✕</button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-base mb-2 text-yellow-300">Assignments</div>
                    <ul className="ml-4 list-disc text-base">
                      {phase.assignments.map((assignment, aIdx) => (
                        <li key={aIdx} className="flex items-center justify-between mb-2">
                          <span>
                            <span className="font-semibold text-white">{assignment.title}</span>
                            {assignment.link && (<a href={assignment.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline ml-3">[Link]</a>)}
                          </span>
                          <button type="button" className="text-red-400 ml-2 hover:text-red-600 text-lg" onClick={() => removeAssignment(idx, aIdx)} title="Remove Assignment">✕</button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {error && <div className="text-red-400 mb-4 text-center font-semibold">{error}</div>}
          {success && <div className="text-green-400 mb-4 text-center font-semibold">{success}</div>}
          <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 rounded-2xl font-bold text-xl shadow-lg hover:scale-105 transition-transform mt-2">
            Create Roadmap
          </button>
        </form>
        {/* Modal for adding task/assignment */}
        {showTaskModal.open && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-700">
              <h2 className="text-2xl font-bold mb-6 text-center text-blue-300">Add {showTaskModal.type === "task" ? "Task" : "Assignment"}</h2>
              <div className="mb-5">
                <label className="block mb-2 text-lg font-semibold">Title</label>
                <input
                  name="title"
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  value={taskForm.title}
                  onChange={handleTaskFormChange}
                  placeholder="Enter title"
                />
              </div>
              <div className="mb-5">
                <label className="block mb-2 text-lg font-semibold">Link</label>
                <input
                  name="link"
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  value={taskForm.link}
                  onChange={handleTaskFormChange}
                  placeholder="Enter link (URL)"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button className="bg-gray-700 px-6 py-2 rounded-lg font-semibold text-white hover:bg-gray-600" onClick={closeTaskModal} type="button">Cancel</button>
                <button className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-2 rounded-lg text-white font-bold shadow hover:scale-105 transition-transform" onClick={addTaskOrAssignment} type="button">Add</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default RoadmapCreate;
