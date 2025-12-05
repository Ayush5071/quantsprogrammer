"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import ReactConfetti from "react-confetti";
import Certificate from "@/components/component/Certificate";
import axios from "axios";

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
  
  // Test eligibility state
  const [testEligibility, setTestEligibility] = useState<{
    canTakeTest: boolean;
    hasAttempted: boolean;
    attempt: any;
    hasFullDetails: boolean;
    missingDetails: string | null;
    canRetry: boolean;
  } | null>(null);

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
    if (id) {
      // Use axios which automatically sends cookies
      axios.get(`/api/roadmap/progress?roadmapId=${id}`)
        .then((res) => {
          if (res.data.progress) setProgress(res.data.progress);
          setProgressLoading(false);
        })
        .catch(() => setProgressLoading(false));
    } else {
      setProgressLoading(false);
    }
  }, [id]);

  // Check test eligibility when progress changes or is 100%
  useEffect(() => {
    async function checkTestEligibility() {
      if (!id || !isLoggedIn) return;
      try {
        const res = await fetch(`/api/roadmap-test?roadmapId=${id}`);
        const data = await res.json();
        setTestEligibility(data);
      } catch (err) {
        console.error("Error checking test eligibility:", err);
      }
    }
    checkTestEligibility();
  }, [id, isLoggedIn, progress]);

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
      console.log("Saving progress to server...", { roadmapId: id, completedTasks: updated.completedTasks.length, completedAssignments: updated.completedAssignments.length });
      try {
        // Use axios which automatically sends cookies
        const res = await axios.post("/api/roadmap/progress", { 
          roadmapId: id, 
          completedTasks: updated.completedTasks,
          completedAssignments: updated.completedAssignments
        });
        console.log("Progress save response:", res.data);
      } catch (err: any) {
        console.error("Error saving progress:", err.response?.data || err.message);
      }
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
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading roadmap...</p>
        </div>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-500/10 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Roadmap Not Found</h2>
          <p className="text-gray-500 mb-4">This roadmap doesn't exist or has been removed.</p>
          <button 
            onClick={() => router.push("/explore")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
          >
            Back to Explore
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[128px]" />
      </div>

      {showConfetti && <ReactConfetti width={typeof window !== 'undefined' ? window.innerWidth : 1920} height={typeof window !== 'undefined' ? window.innerHeight : 1080} recycle={false} numberOfPieces={400} />}

      {/* Congratulations Modal */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 bg-[#111118] border border-white/10 rounded-2xl max-w-md w-full text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">🎉 Congratulations!</h2>
            <p className="text-gray-300 mb-2">You've completed the <span className="text-blue-400 font-semibold">{roadmap?.title}</span> roadmap!</p>
            <p className="text-gray-400 text-sm mb-6">
              Now you can attempt a skill test to earn your certificate.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setShowCertModal(false);
                  router.push(`/profile?tab=tests`);
                }}
                className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-semibold rounded-xl hover:from-yellow-500 hover:to-orange-500 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
                Attempt Skill Test
              </button>
              <button
                onClick={() => setShowCertModal(false)}
                className="px-6 py-3 text-gray-400 font-medium rounded-xl hover:text-white hover:bg-white/5 transition-all"
              >
                Maybe Later
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push("/explore")}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Back</span>
          </button>

          {/* Progress Bar */}
          <div className="flex items-center gap-3 flex-1 max-w-xs mx-4">
            <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
              />
            </div>
            <span className="text-sm text-gray-400">{percent}%</span>
          </div>

          <div className="w-16" />
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        {/* Roadmap Header */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 rounded-full mb-4"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-blue-400">Learning Roadmap</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4"
          >
            {roadmap.title}
          </motion.h1>

          {roadmap.description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 text-lg max-w-3xl mb-6"
            >
              {roadmap.description}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center gap-4"
          >
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>By {roadmap.createdBy}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{completedTasks + completedAssignments}/{totalTasks + totalAssignments} completed</span>
            </div>
          </motion.div>
        </div>

        {/* Phases Section */}
        <div className="space-y-4">
          {roadmap.phases && roadmap.phases.length > 0 ? (
            roadmap.phases.map((phase: any, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                {/* Phase Header */}
                <button
                  onClick={() => setOpenPhase(openPhase === idx ? null : idx)}
                  className={`w-full flex items-center justify-between p-5 bg-[#111118] border rounded-xl transition-all ${
                    openPhase === idx ? "border-blue-500/30 bg-[#111118]" : "border-white/5 hover:border-white/10"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-semibold ${
                      openPhase === idx ? "bg-blue-500/20 text-blue-400" : "bg-white/5 text-gray-400"
                    }`}>
                      {idx + 1}
                    </div>
                    <span className="text-lg font-semibold text-white">
                      {isAdmin ? (
                        <EditableField value={phase.title} onChange={v => handleEditPhaseTitle(idx, v)} placeholder="Phase Title" />
                      ) : (
                        phase.title
                      )}
                    </span>
                    {isAdmin && (
                      <button 
                        onClick={e => { e.stopPropagation(); handleDeletePhase(idx); }} 
                        className="ml-2 text-red-400 hover:text-red-300 text-sm"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${openPhase === idx ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Phase Content */}
                {openPhase === idx && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 p-5 bg-[#111118]/50 border border-white/5 rounded-xl"
                  >
                    {/* Tasks */}
                    {phase.tasks && phase.tasks.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-blue-400 mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Tasks ({phase.tasks.length})
                        </h4>
                        <div className="space-y-2">
                          {phase.tasks.map((task: any, tIdx: number) => (
                            <div
                              key={tIdx}
                              className="flex items-center gap-3 p-3 bg-white/5 border border-white/5 rounded-lg hover:border-blue-500/20 transition-all"
                            >
                              <input
                                type="checkbox"
                                checked={progress.completedTasks.includes(task.title)}
                                onChange={(e) => handleCheck("task", task.title, e.target.checked)}
                                disabled={progressLoading}
                                className="w-5 h-5 rounded border-2 border-gray-600 bg-transparent checked:bg-blue-500 checked:border-blue-500 cursor-pointer"
                              />
                              <span className={`flex-1 text-sm ${
                                progress.completedTasks.includes(task.title) ? "text-gray-500 line-through" : "text-white"
                              }`}>
                                {isAdmin ? (
                                  <EditableField value={task.title} onChange={v => handleEditTask(idx, tIdx, "title", v)} placeholder="Task Title" />
                                ) : task.title}
                              </span>
                              {task.link && !isAdmin && (
                                <a
                                  href={task.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors"
                                >
                                  Open
                                </a>
                              )}
                              {isAdmin && (
                                <>
                                  <EditableField 
                                    value={task.link || ""} 
                                    onChange={v => handleEditTask(idx, tIdx, "link", v)} 
                                    placeholder="Link" 
                                    className="text-blue-400 text-xs"
                                  />
                                  <button 
                                    onClick={() => handleDeleteTask(idx, tIdx)} 
                                    className="text-red-400 hover:text-red-300"
                                  >
                                    ✕
                                  </button>
                                </>
                              )}
                            </div>
                          ))}
                          {isAdmin && (
                            <button
                              onClick={() => handleAddTask(idx)}
                              className="w-full py-2 text-sm text-blue-400 border border-dashed border-blue-500/30 rounded-lg hover:bg-blue-500/5 transition-all"
                            >
                              + Add Task
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Assignments */}
                    {phase.assignments && phase.assignments.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-purple-400 mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          Assignments ({phase.assignments.length})
                        </h4>
                        <div className="space-y-2">
                          {phase.assignments.map((assignment: any, aIdx: number) => (
                            <div
                              key={aIdx}
                              className="flex items-center gap-3 p-3 bg-white/5 border border-white/5 rounded-lg hover:border-purple-500/20 transition-all"
                            >
                              <input
                                type="checkbox"
                                checked={progress.completedAssignments.includes(assignment.title)}
                                onChange={(e) => handleCheck("assignment", assignment.title, e.target.checked)}
                                disabled={progressLoading}
                                className="w-5 h-5 rounded border-2 border-gray-600 bg-transparent checked:bg-purple-500 checked:border-purple-500 cursor-pointer"
                              />
                              <span className={`flex-1 text-sm ${
                                progress.completedAssignments.includes(assignment.title) ? "text-gray-500 line-through" : "text-white"
                              }`}>
                                {isAdmin ? (
                                  <EditableField value={assignment.title} onChange={v => handleEditAssignment(idx, aIdx, "title", v)} placeholder="Assignment Title" />
                                ) : assignment.title}
                              </span>
                              {assignment.link && !isAdmin && (
                                <a
                                  href={assignment.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1 text-xs bg-purple-600 text-white rounded-md hover:bg-purple-500 transition-colors"
                                >
                                  Open
                                </a>
                              )}
                              {isAdmin && (
                                <>
                                  <EditableField 
                                    value={assignment.link || ""} 
                                    onChange={v => handleEditAssignment(idx, aIdx, "link", v)} 
                                    placeholder="Link" 
                                    className="text-purple-400 text-xs"
                                  />
                                  <button 
                                    onClick={() => handleDeleteAssignment(idx, aIdx)} 
                                    className="text-red-400 hover:text-red-300"
                                  >
                                    ✕
                                  </button>
                                </>
                              )}
                            </div>
                          ))}
                          {isAdmin && (
                            <button
                              onClick={() => handleAddAssignment(idx)}
                              className="w-full py-2 text-sm text-purple-400 border border-dashed border-purple-500/30 rounded-lg hover:bg-purple-500/5 transition-all"
                            >
                              + Add Assignment
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Folder Link */}
                    {phase.folderLink && (
                      <div className="mt-4 pt-4 border-t border-white/5">
                        <a
                          href={phase.folderLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-blue-500 hover:to-indigo-500 transition-all"
                        >
                          Open Folder
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-white/5 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No Phases Yet</h3>
              <p className="text-gray-500">This roadmap is being developed.</p>
            </div>
          )}

          {/* Admin Add Phase */}
          {isAdmin && (
            <button
              onClick={handleAddPhase}
              className="w-full py-4 text-blue-400 border border-dashed border-blue-500/30 rounded-xl hover:bg-blue-500/5 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Phase
            </button>
          )}
        </div>

        {/* Certificate Section */}
        {percent === 100 && user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12"
          >
            {/* Test Section */}
            <div className="mb-8 p-6 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-yellow-500/20 rounded-xl">
                    <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Certification Test</h3>
                    {testEligibility?.hasAttempted && !testEligibility?.canRetry ? (
                      <p className="text-gray-400 text-sm">
                        You scored <span className="text-yellow-400 font-semibold">{testEligibility.attempt?.percentage}%</span> 
                        {testEligibility.attempt?.passed ? " - Certificate earned!" : " - Need 60% to pass"}
                      </p>
                    ) : testEligibility?.canRetry ? (
                      <p className="text-gray-400 text-sm">Admin has allowed you to retry the test</p>
                    ) : !testEligibility?.hasFullDetails ? (
                      <p className="text-amber-400 text-sm flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Complete your profile (Full Name, Age, Gender) to take the test
                      </p>
                    ) : (
                      <p className="text-gray-400 text-sm">30 min • 40 questions • 100 marks • Pass at 60%</p>
                    )}
                  </div>
                </div>
                
                {testEligibility?.canTakeTest || testEligibility?.canRetry ? (
                  <button
                    onClick={() => router.push(`/roadmap-test?roadmapId=${id}`)}
                    className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-medium rounded-xl hover:from-yellow-500 hover:to-orange-500 transition-all whitespace-nowrap flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                    {testEligibility?.canRetry ? "Retry Test" : "Take Test"}
                  </button>
                ) : testEligibility?.hasAttempted && testEligibility?.attempt?.passed ? (
                  <button
                    onClick={() => router.push("/profile?tab=certificates")}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all whitespace-nowrap flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    View Certificate
                  </button>
                ) : testEligibility?.hasAttempted ? (
                  <span className="px-6 py-3 bg-red-500/20 text-red-400 font-medium rounded-xl flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Test Failed
                  </span>
                ) : !testEligibility?.hasFullDetails ? (
                  <button
                    onClick={() => router.push("/profile")}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all whitespace-nowrap flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Update Profile
                  </button>
                ) : null}
              </div>
            </div>
            
            {/* Only show certificate if test was passed */}
            {testEligibility?.hasAttempted && testEligibility?.attempt?.passed && (
              <Certificate user={user} roadmap={roadmap} percent={100} />
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default RoadmapDetailPage;
