"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import ReactConfetti from "react-confetti";
import Certificate from "@/components/component/Certificate";

function EditableField({ value, onChange, placeholder, className = "" }: { value: string, onChange: (v: string) => void, placeholder?: string, className?: string }) {
  const [editing, setEditing] = useState(false);
  const [temp, setTemp] = useState(value);
  return editing ? (
    <input
      className={"bg-gray-900 border border-blue-400 rounded px-2 py-1 text-white text-base md:text-xl w-full max-w-xs md:max-w-2xl " + className}
      value={temp}
      onChange={e => setTemp(e.target.value)}
      onBlur={() => { setEditing(false); onChange(temp); }}
      onKeyDown={e => { if (e.key === "Enter") { setEditing(false); onChange(temp); } }}
      autoFocus
      placeholder={placeholder}
    />
  ) : (
    <span className={className + " cursor-pointer hover:underline"} onClick={() => setEditing(true)} title="Click to edit">{value || <span className="text-gray-400">{placeholder}</span>}</span>
  );
}

const RoadmapDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };
  const [roadmap, setRoadmap] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [progress, setProgress] = useState<{ completedTasks: string[]; completedAssignments: string[] }>(() => {
    if (typeof window !== "undefined") {
      const local = localStorage.getItem(`roadmap-progress-${id}`);
      if (local) return JSON.parse(local);
    }
    return { completedTasks: [], completedAssignments: [] };
  });
  const [progressLoading, setProgressLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openPhase, setOpenPhase] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiShown, setConfettiShown] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    // Fetch all roadmaps to verify existence and get full data
    fetch('/api/roadmap/fetchall')
      .then(res => res.json())
      .then(data => {
        const found = data.roadmaps.find((r: any) => r._id === id);
        if (!found) {
          setRoadmap(null);
          setLoading(false);
          return;
        }
        setRoadmap(found);
        setLoading(false);
      });
    // Check admin from token (if present)
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setIsAdmin(payload.isAdmin === true);
      } catch {
        setIsAdmin(false);
      }
    } else {
      setIsAdmin(false);
    }
  }, [id]);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setIsLoggedIn(!!token);
    if (token && id) {
      fetch(`/api/roadmap/progress?roadmapId=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.progress) setProgress(data.progress);
          setProgressLoading(false);
        })
        .catch(() => setProgressLoading(false));
    } else {
      setProgressLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // Fetch userId for download button
    async function fetchUserId() {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (token) {
        const res = await fetch("/api/users/me", { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (data.user && data.user._id) setUserId(data.user._id);
      }
    }
    fetchUserId();
  }, []);

  useEffect(() => {
    async function fetchUser() {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (token) {
        const res = await fetch("/api/users/me", { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (data.user) setUser(data.user);
      }
    }
    fetchUser();
  }, []);

  const handleCheck = async (type: "task" | "assignment", value: string, checked: boolean) => {
    const updated = { ...progress };
    if (type === "task") {
      updated.completedTasks = checked
        ? [...progress.completedTasks, value]
        : progress.completedTasks.filter((t) => t !== value);
    } else {
      updated.completedAssignments = checked
        ? [...progress.completedAssignments, value]
        : progress.completedAssignments.filter((a) => a !== value);
    }
    setProgress(updated);
    if (isLoggedIn) {
      const token = localStorage.getItem("token");
      await fetch("/api/roadmap/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ roadmapId: id, ...updated }),
      });
    } else {
      localStorage.setItem(`roadmap-progress-${id}` , JSON.stringify(updated));
    }
  };

  // Admin edit helpers
  const updateRoadmap = async (newRoadmap: any) => {
    setRoadmap(newRoadmap);
    await fetch(`/api/roadmap/${id}/edit`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRoadmap),
    });
  };
  const handleEditPhaseTitle = (phaseIdx: number, newTitle: string) => {
    const updated = { ...roadmap };
    updated.phases[phaseIdx].title = newTitle;
    updateRoadmap(updated);
  };
  const handleEditTask = (phaseIdx: number, taskIdx: number, field: string, value: string) => {
    const updated = { ...roadmap };
    updated.phases[phaseIdx].tasks[taskIdx][field] = value;
    updateRoadmap(updated);
  };
  const handleEditAssignment = (phaseIdx: number, assignIdx: number, field: string, value: string) => {
    const updated = { ...roadmap };
    updated.phases[phaseIdx].assignments[assignIdx][field] = value;
    updateRoadmap(updated);
  };
  const handleDeleteTask = (phaseIdx: number, taskIdx: number) => {
    const updated = { ...roadmap };
    updated.phases[phaseIdx].tasks.splice(taskIdx, 1);
    updateRoadmap(updated);
  };
  const handleDeleteAssignment = (phaseIdx: number, assignIdx: number) => {
    const updated = { ...roadmap };
    updated.phases[phaseIdx].assignments.splice(assignIdx, 1);
    updateRoadmap(updated);
  };
  const handleDeletePhase = (phaseIdx: number) => {
    const updated = { ...roadmap };
    updated.phases.splice(phaseIdx, 1);
    updateRoadmap(updated);
  };
  const handleAddTask = (phaseIdx: number) => {
    const updated = { ...roadmap };
    updated.phases[phaseIdx].tasks.push({ title: "New Task", link: "" });
    updateRoadmap(updated);
  };
  const handleAddAssignment = (phaseIdx: number) => {
    const updated = { ...roadmap };
    updated.phases[phaseIdx].assignments.push({ title: "New Assignment", link: "" });
    updateRoadmap(updated);
  };
  const handleAddPhase = () => {
    const updated = { ...roadmap };
    updated.phases.push({ title: "New Phase", tasks: [], assignments: [] });
    updateRoadmap(updated);
  };

  // Calculate progress percentage from DB data
  const totalTasks = roadmap?.phases?.reduce((acc: number, phase: any) => acc + (phase.tasks?.length || 0), 0) || 0;
  const totalAssignments = roadmap?.phases?.reduce((acc: number, phase: any) => acc + (phase.assignments?.length || 0), 0) || 0;
  const completedTasks = progress.completedTasks.length;
  const completedAssignments = progress.completedAssignments.length;
  const percent = totalTasks + totalAssignments === 0 ? 0 : Math.round(((completedTasks + completedAssignments) / (totalTasks + totalAssignments)) * 100);

  useEffect(() => {
    if (percent === 100 && !confettiShown) {
      setShowConfetti(true);
      setShowCertModal(true);
      setConfettiShown(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [percent, confettiShown]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white text-2xl">
        Loading roadmap...
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-red-400 text-2xl">
        Roadmap not found.
      </div>
    );
  }

  return (
    <section className="w-full min-h-screen flex flex-col items-center justify-start px-4 sm:px-6 md:px-8 relative overflow-hidden">
      {/* Enhanced Background Effects - matching hero section */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-900 to-black"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(37,99,235,0.12),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(29,78,216,0.08),transparent_70%)]"></div>
      
      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)]"></div>
      </div>

      {showConfetti && <ReactConfetti width={typeof window !== 'undefined' ? window.innerWidth : 1920} height={typeof window !== 'undefined' ? window.innerHeight : 1080} recycle={false} numberOfPieces={400} />}
      
      {/* Congratulations Modal */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="p-8 bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl max-w-md mx-4"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Congratulations!</h2>
              <p className="text-zinc-300 mb-6">You've completed this roadmap!<br/>Download your certificate from your profile.</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg transition-all duration-300"
                onClick={() => setShowCertModal(false)}
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        onClick={() => router.back()}
        className="fixed top-6 left-6 z-30 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg text-sm font-semibold text-white hover:bg-white/15 transition-all duration-300 shadow-lg"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        <span className="hidden sm:inline">Back</span>
      </motion.button>
      <div className="relative z-10 max-w-5xl mx-auto w-full flex flex-col justify-start py-8 pt-24 sm:pt-32">
        {/* Hero-style Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full text-sm text-zinc-300 mb-6 hover:bg-white/15 transition-all duration-300">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Learning Roadmap</span>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-blue-300 mb-6 leading-tight tracking-tight text-center">
              {roadmap.title}
            </h1>
            
            {/* Description */}
            {roadmap.description && (
              <p className="text-base sm:text-lg md:text-xl text-zinc-300 font-medium max-w-3xl mx-auto mb-8 leading-relaxed px-4 text-center">
                {roadmap.description}
              </p>
            )}

            {/* Progress Section */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8">
              <div className="flex items-center gap-3 p-3 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"></div>
                <span className="text-sm text-zinc-300">Created by {roadmap.createdBy}</span>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl min-w-[200px]">
                <div className="flex-1">
                  <div className="h-2 bg-gradient-to-r from-zinc-700 to-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 shadow-lg"
                    />
                  </div>
                  <div className="text-xs text-zinc-400 mt-1 text-right">{percent}% complete</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Phases Section */}
        <div className="w-full">
          {roadmap.phases && roadmap.phases.length > 0 ? (
            <div className="space-y-6">
              {roadmap.phases.map((phase: any, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="group"
                >
                  <button
                    className={`w-full flex items-center justify-between p-6 bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-lg border border-white/10 hover:border-white/20 rounded-2xl transition-all duration-500 shadow-xl ${openPhase === idx ? "ring-2 ring-blue-400/50" : ""}`}
                    onClick={() => setOpenPhase(openPhase === idx ? null : idx)}
                    aria-expanded={openPhase === idx ? "true" : "false"}
                  >
                    <span className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                      {isAdmin ? (
                        <EditableField value={phase.title} onChange={v => handleEditPhaseTitle(idx, v)} placeholder="Phase Title" />
                      ) : (
                        phase.title
                      )}
                      {isAdmin && (
                        <button onClick={e => { e.stopPropagation(); handleDeletePhase(idx); }} className="ml-2 text-red-400 hover:text-red-600 text-lg" title="Delete Phase">✕</button>
                      )}
                    </span>
                    <motion.svg
                      animate={{ rotate: openPhase === idx ? 90 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-6 h-6 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </motion.svg>
                  </button>
                  
                  <motion.div
                    initial={false}
                    animate={{
                      height: openPhase === idx ? "auto" : 0,
                      opacity: openPhase === idx ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    {openPhase === idx && (
                      <div className="p-6 mt-4 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl">
                        {/* Tasks Section */}
                        {phase.tasks && phase.tasks.length > 0 ? (
                          <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-blue-300 mb-4 flex items-center gap-2">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Tasks
                            </h4>
                            <div className="space-y-3">
                              {phase.tasks.map((task: any, tIdx: number) => (
                                <motion.div
                                  key={tIdx}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: tIdx * 0.1 }}
                                  className="p-4 bg-gradient-to-r from-blue-900/30 to-blue-800/30 backdrop-blur-lg border border-blue-500/30 rounded-xl hover:border-blue-400/50 transition-all duration-300"
                                >
                                  <label className="flex items-center gap-4 w-full cursor-pointer">
                                    <div className="relative">
                                      <input
                                        type="checkbox"
                                        checked={progress.completedTasks.includes(task.title)}
                                        onChange={(e) => handleCheck("task", task.title, e.target.checked)}
                                        className="w-5 h-5 rounded border-2 border-blue-400 bg-transparent checked:bg-blue-500 checked:border-blue-500 focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                                        disabled={progressLoading}
                                      />
                                      {progress.completedTasks.includes(task.title) && (
                                        <svg className="absolute inset-0 w-5 h-5 text-white pointer-events-none" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                      )}
                                    </div>
                                    <div className="flex-1 flex items-center justify-between gap-4">
                                      <span className="font-medium text-white text-sm md:text-base">
                                        {isAdmin ? (
                                          <EditableField value={task.title} onChange={v => handleEditTask(idx, tIdx, "title", v)} placeholder="Task Title" />
                                        ) : task.title}
                                      </span>
                                      <div className="flex items-center gap-2">
                                        {isAdmin ? (
                                          <EditableField value={task.link} onChange={v => handleEditTask(idx, tIdx, "link", v)} placeholder="Task Link" className="text-blue-400 underline text-sm break-all bg-transparent border-0 border-b border-blue-400" />
                                        ) : (
                                          task.link && (
                                            <a
                                              href={task.link}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-all duration-200 flex items-center gap-1"
                                              onClick={(e) => e.stopPropagation()}
                                            >
                                              Open
                                              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                              </svg>
                                            </a>
                                          )
                                        )}
                                        {isAdmin && (
                                          <button onClick={e => { e.preventDefault(); handleDeleteTask(idx, tIdx); }} className="text-red-400 hover:text-red-600 text-sm" title="Delete Task">✕</button>
                                        )}
                                      </div>
                                    </div>
                                  </label>
                                </motion.div>
                              ))}
                              {isAdmin && (
                                <div>
                                  <button onClick={() => handleAddTask(idx)} className="w-full py-3 bg-blue-900/30 border border-blue-500/30 text-blue-400 rounded-lg font-medium hover:bg-blue-800/30 hover:border-blue-400/50 transition-all duration-300 flex items-center justify-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                    </svg>
                                    Add Task
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="text-zinc-400 text-sm">No tasks in this phase.</div>
                        )}
                        
                        {/* Assignments Section */}
                        {phase.assignments && phase.assignments.length > 0 && (
                          <div className="space-y-4 mt-8">
                            <h4 className="text-lg font-semibold text-purple-300 mb-4 flex items-center gap-2">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                              </svg>
                              Assignments
                            </h4>
                            <div className="space-y-3">
                              {phase.assignments.map((assignment: any, aIdx: number) => (
                                <motion.div
                                  key={aIdx}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: aIdx * 0.1 }}
                                  className="p-4 bg-gradient-to-r from-purple-900/30 to-purple-800/30 backdrop-blur-lg border border-purple-500/30 rounded-xl hover:border-purple-400/50 transition-all duration-300"
                                >
                                  <label className="flex items-center gap-4 w-full cursor-pointer">
                                    <div className="relative">
                                      <input
                                        type="checkbox"
                                        checked={progress.completedAssignments.includes(assignment.title)}
                                        onChange={(e) => handleCheck("assignment", assignment.title, e.target.checked)}
                                        className="w-5 h-5 rounded border-2 border-purple-400 bg-transparent checked:bg-purple-500 checked:border-purple-500 focus:ring-2 focus:ring-purple-400 transition-all duration-200"
                                        disabled={progressLoading}
                                      />
                                      {progress.completedAssignments.includes(assignment.title) && (
                                        <svg className="absolute inset-0 w-5 h-5 text-white pointer-events-none" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                      )}
                                    </div>
                                    <div className="flex-1 flex items-center justify-between gap-4">
                                      <span className="font-medium text-white text-sm md:text-base">
                                        {isAdmin ? (
                                          <EditableField value={assignment.title} onChange={v => handleEditAssignment(idx, aIdx, "title", v)} placeholder="Assignment Title" />
                                        ) : assignment.title}
                                      </span>
                                      <div className="flex items-center gap-2">
                                        {isAdmin ? (
                                          <EditableField value={assignment.link} onChange={v => handleEditAssignment(idx, aIdx, "link", v)} placeholder="Assignment Link" className="text-purple-400 underline text-sm break-all bg-transparent border-0 border-b border-purple-400" />
                                        ) : (
                                          assignment.link && (
                                            <a
                                              href={assignment.link}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded-lg transition-all duration-200 flex items-center gap-1"
                                              onClick={(e) => e.stopPropagation()}
                                            >
                                              Open
                                              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                              </svg>
                                            </a>
                                          )
                                        )}
                                        {isAdmin && (
                                          <button onClick={e => { e.preventDefault(); handleDeleteAssignment(idx, aIdx); }} className="text-red-400 hover:text-red-600 text-sm" title="Delete Assignment">✕</button>
                                        )}
                                      </div>
                                    </div>
                                  </label>
                                </motion.div>
                              ))}
                              {isAdmin && (
                                <div>
                                  <button onClick={() => handleAddAssignment(idx)} className="w-full py-3 bg-purple-900/30 border border-purple-500/30 text-purple-400 rounded-lg font-medium hover:bg-purple-800/30 hover:border-purple-400/50 transition-all duration-300 flex items-center justify-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                    </svg>
                                    Add Assignment
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* Folder Link */}
                        {phase.folderLink && (
                          <div className="mt-6 flex justify-end">
                            <a
                              href={phase.folderLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-base flex items-center gap-2"
                            >
                              Open Roadmap Folder
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14 3h7m0 0v7m0-7L10 14m-7 7h7a2 2 0 002-2v-7" />
                              </svg>
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center py-20"
            >
              <div className="p-12 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Phases Yet</h3>
                <p className="text-zinc-300">This roadmap is being developed. Check back soon!</p>
              </div>
            </motion.div>
          )}
          
          {/* Admin Controls */}
          {isAdmin && (
            <div className="mt-8 flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddPhase}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add Phase
              </motion.button>
            </div>
          )}
          
          {/* Certificate Section */}
          {percent === 100 && user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center justify-center mt-12"
            >
              <Certificate user={user} roadmap={roadmap} percent={100} />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default RoadmapDetailPage;
