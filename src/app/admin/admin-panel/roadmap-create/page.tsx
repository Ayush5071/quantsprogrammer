"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "../AdminLayout";
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
  const [submitting, setSubmitting] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState<{ open: boolean; phaseIdx: number | null; type: "task" | "assignment" | null }>({ open: false, phaseIdx: null, type: null });
  const [taskForm, setTaskForm] = useState({ title: "", link: "" });
  const user = useCurrentUser();

  useEffect(() => {
    if (user === null) return;
    if (user === false || (!user?.isAdmin && user?.role !== "admin")) {
      setError("Access denied. Admin privileges required.");
      setLoading(false);
      return;
    }
    setLoading(false);
  }, [user]);

  if (loading) {
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

  if (error && !success) {
    return (
      <AdminLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-red-400 font-medium">{error}</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const addPhase = () => {
    if (!phaseTitle.trim()) return;
    setPhases([...phases, { title: phaseTitle, tasks: [], assignments: [] }]);
    setPhaseTitle("");
  };

  const removePhase = (phaseIdx: number) => {
    setPhases((prev) => prev.filter((_, idx) => idx !== phaseIdx));
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
    setSubmitting(true);
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
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Create New Roadmap</h1>
        <p className="text-gray-400 text-sm">Build a structured learning path with phases, tasks, and assignments.</p>
      </div>

      {/* Form Card */}
      <div className="bg-[#111118] border border-white/10 rounded-xl p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Roadmap Title</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g., Full-Stack Developer Roadmap"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the roadmap..."
              rows={3}
            />
          </div>

          {/* Phases Section */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Phases</label>
            
            {/* Add Phase Input */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <input
                type="text"
                className="flex-1 px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                value={phaseTitle}
                onChange={(e) => setPhaseTitle(e.target.value)}
                placeholder="Enter phase title..."
              />
              <button
                type="button"
                onClick={addPhase}
                className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Phase
              </button>
            </div>

            {/* Phases List */}
            {phases.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm border border-dashed border-white/10 rounded-lg">
                No phases added yet. Add your first phase above.
              </div>
            ) : (
              <div className="space-y-4">
                {phases.map((phase, idx) => (
                  <div key={idx} className="bg-[#0a0a0f] border border-white/10 rounded-lg p-4 sm:p-5">
                    {/* Phase Header */}
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        {phase.title}
                      </h3>
                      <button
                        type="button"
                        onClick={() => removePhase(idx)}
                        className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-all"
                        title="Remove Phase"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    {/* Add Task/Assignment Buttons */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <button
                        type="button"
                        onClick={() => openTaskModal(idx, "task")}
                        className="px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Task
                      </button>
                      <button
                        type="button"
                        onClick={() => openTaskModal(idx, "assignment")}
                        className="px-3 py-1.5 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Assignment
                      </button>
                    </div>

                    {/* Tasks and Assignments Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Tasks */}
                      <div>
                        <h4 className="text-xs font-semibold text-green-400 uppercase tracking-wider mb-2">Tasks</h4>
                        {phase.tasks.length === 0 ? (
                          <p className="text-gray-500 text-xs">No tasks added</p>
                        ) : (
                          <ul className="space-y-2">
                            {phase.tasks.map((task, tIdx) => (
                              <li key={tIdx} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="text-sm text-white truncate">{task.title}</span>
                                  {task.link && (
                                    <a href={task.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 flex-shrink-0">
                                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                      </svg>
                                    </a>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeTask(idx, tIdx)}
                                  className="text-gray-500 hover:text-red-400 flex-shrink-0"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      {/* Assignments */}
                      <div>
                        <h4 className="text-xs font-semibold text-yellow-400 uppercase tracking-wider mb-2">Assignments</h4>
                        {phase.assignments.length === 0 ? (
                          <p className="text-gray-500 text-xs">No assignments added</p>
                        ) : (
                          <ul className="space-y-2">
                            {phase.assignments.map((assignment, aIdx) => (
                              <li key={aIdx} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="text-sm text-white truncate">{assignment.title}</span>
                                  {assignment.link && (
                                    <a href={assignment.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 flex-shrink-0">
                                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                      </svg>
                                    </a>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeAssignment(idx, aIdx)}
                                  className="text-gray-500 hover:text-red-400 flex-shrink-0"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Messages */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
              {error}
            </div>
          )}
          {success && (
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm text-center">
              {success}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || !title.trim()}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Roadmap
              </>
            )}
          </button>
        </form>
      </div>

      {/* Modal for adding task/assignment */}
      {showTaskModal.open && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111118] border border-white/10 rounded-xl w-full max-w-md p-6 shadow-2xl">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              {showTaskModal.type === "task" ? (
                <span className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </span>
              ) : (
                <span className="w-8 h-8 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </span>
              )}
              Add {showTaskModal.type === "task" ? "Task" : "Assignment"}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                <input
                  name="title"
                  type="text"
                  className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  value={taskForm.title}
                  onChange={handleTaskFormChange}
                  placeholder="Enter title..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Link</label>
                <input
                  name="link"
                  type="url"
                  className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  value={taskForm.link}
                  onChange={handleTaskFormChange}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={closeTaskModal}
                className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-sm font-medium rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={addTaskOrAssignment}
                disabled={!taskForm.title.trim() || !taskForm.link.trim()}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-all"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default RoadmapCreate;
