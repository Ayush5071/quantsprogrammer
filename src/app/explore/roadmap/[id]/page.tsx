"use client";
import React, { useEffect, useState } from "react";
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
    <div className="min-h-screen w-full bg-black text-white px-0 md:px-0 py-0 flex flex-col items-center justify-start relative overflow-x-hidden">
      {showConfetti && <ReactConfetti width={typeof window !== 'undefined' ? window.innerWidth : 1920} height={typeof window !== 'undefined' ? window.innerHeight : 1080} recycle={false} numberOfPieces={400} />}
      {showCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-zinc-900 rounded-2xl p-8 shadow-2xl border-2 border-blue-700 flex flex-col items-center">
            <h2 className="text-2xl font-bold text-blue-400 mb-4">Congratulations!</h2>
            <p className="text-lg text-zinc-200 mb-6">You've completed this roadmap!<br/>Download your certificate from your profile.</p>
            <button className="mt-2 px-6 py-3 bg-blue-700 text-white rounded-xl text-lg font-semibold shadow hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all" onClick={() => setShowCertModal(false)}>Close</button>
          </div>
        </div>
      )}
      <div className="w-full flex items-center justify-between px-4 md:px-8 pt-8 pb-2 z-10">
        <button
          className="fixed top-6 left-4 flex items-center gap-2 text-blue-400 hover:text-blue-300 hover:underline text-lg md:text-xl px-4 py-2 rounded-lg bg-zinc-900 shadow border-2 border-blue-700 transition-all z-50"
          style={{ position: 'fixed', top: '1.5rem', left: '1rem', zIndex: 50 }}
          onClick={() => router.back()}
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          <span className="hidden sm:inline">Back</span>
        </button>
        <div></div>
      </div>
      <div className="w-full max-w-5xl mx-auto mt-8 md:mt-20 px-2 md:px-8 z-10">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-8 text-center text-zinc-100 tracking-tight drop-shadow-lg uppercase">{roadmap.title}</h1>
        {roadmap.description && <p className="mb-10 text-lg md:text-2xl text-zinc-300 text-center max-w-3xl mx-auto font-light drop-shadow">{roadmap.description}</p>}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-base md:text-lg text-blue-200 text-center md:text-left">Created by: {roadmap.createdBy}</div>
          <div className="w-full md:w-1/3">
            <div className="h-3 w-full bg-gradient-to-r from-blue-900 via-purple-900 to-pink-900 rounded-full overflow-hidden border-2 border-blue-700">
              <div className="h-full bg-gradient-to-r from-blue-400 via-pink-400 to-purple-400 shadow-lg transition-all duration-500" style={{ width: `${percent}%` }}></div>
            </div>
            <div className="text-xs text-pink-200 mt-1 text-right">{percent}% complete</div>
          </div>
        </div>
        {roadmap.phases && roadmap.phases.length > 0 ? (
          <div className="w-full">
            {roadmap.phases.map((phase: any, idx: number) => (
              <div key={idx} className="mb-8 md:mb-10 w-full">
                <button
                  className={`w-full flex items-center justify-between px-4 md:px-10 py-4 md:py-7 rounded-2xl md:rounded-3xl shadow-2xl border-2 border-blue-700 hover:border-pink-400 bg-gradient-to-r from-blue-900 via-gray-900 to-purple-900 transition-all duration-300 focus:outline-none ${openPhase === idx ? "ring-2 ring-pink-400" : ""}`}
                  onClick={() => setOpenPhase(openPhase === idx ? null : idx)}
                  aria-expanded={openPhase === idx ? 'true' : 'false'}
                >
                  <span className="text-lg md:text-3xl font-bold text-zinc-200 tracking-wide flex items-center gap-2">
                    {isAdmin ? (
                      <EditableField value={phase.title} onChange={v => handleEditPhaseTitle(idx, v)} placeholder="Phase Title" />
                    ) : (
                      phase.title
                    )}
                    {isAdmin && (
                      <button onClick={e => { e.stopPropagation(); handleDeletePhase(idx); }} className="ml-2 text-red-400 hover:text-red-600 text-lg" title="Delete Phase">✕</button>
                    )}
                  </span>
                  <svg
                    className={`w-6 h-6 md:w-8 md:h-8 transform transition-transform duration-300 ${openPhase === idx ? "rotate-90" : "rotate-0"}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-500 ${openPhase === idx ? "max-h-[2000px] opacity-100 py-6 md:py-10" : "max-h-0 opacity-0 py-0"}`}
                  style={{ willChange: "max-height, opacity, padding" }}
                >
                  {openPhase === idx && (
                    <>
                      {phase.tasks && phase.tasks.length > 0 ? (
                        <ul className="list-none space-y-4 md:space-y-6">
                          {phase.tasks.map((task: any, tIdx: number) => (
                            <li key={tIdx} className="relative group rounded-2xl px-4 md:px-8 py-5 border-2 border-blue-700 hover:border-blue-400 transition-transform duration-300">
                              <label className="flex items-start md:items-center gap-3 w-full cursor-pointer z-10 relative">
                                <span className="inline-flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full border-2 border-blue-400 bg-zinc-900 shadow-md transition-all duration-200 mr-2">
                                  <input
                                    type="checkbox"
                                    checked={progress.completedTasks.includes(task.title)}
                                    onChange={(e) => handleCheck("task", task.title, e.target.checked)}
                                    className="appearance-none w-5 h-5 md:w-6 md:h-6 rounded-full checked:bg-blue-500 checked:border-blue-500 focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                                    disabled={progressLoading}
                                    title={`Mark task '${task.title}' as complete`}
                                  />
                                  {progress.completedTasks.includes(task.title) && (
                                    <svg className="absolute w-4 h-4 text-white pointer-events-none" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                  )}
                                </span>
                                <span className="font-semibold text-base md:text-2xl break-words max-w-xs md:max-w-2xl text-blue-100 select-none">
                                  {isAdmin ? (
                                    <EditableField value={task.title} onChange={v => handleEditTask(idx, tIdx, "title", v)} placeholder="Task Title" />
                                  ) : task.title}
                                </span>
                                {isAdmin ? (
                                  <EditableField value={task.link} onChange={v => handleEditTask(idx, tIdx, "link", v)} placeholder="Task Link" className="ml-2 text-blue-400 underline text-sm md:text-lg break-all bg-transparent border-0 border-b border-blue-400" />
                                ) : (
                                  task.link && (
                                    <a
                                      href={task.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="ml-auto px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg shadow border border-blue-700 transition-all text-sm md:text-base"
                                    >
                                      Open Resource
                                      <svg className="inline-block ml-2 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 3h7m0 0v7m0-7L10 14m-7 7h7a2 2 0 002-2v-7" /></svg>
                                    </a>
                                  )
                                )}
                                {isAdmin && (
                                  <button onClick={e => { e.preventDefault(); handleDeleteTask(idx, tIdx); }} className="ml-2 text-red-400 hover:text-red-600 text-lg" title="Delete Task">✕</button>
                                )}
                              </label>
                            </li>
                          ))}
                          {isAdmin && (
                            <li>
                              <button onClick={() => handleAddTask(idx)} className="w-full py-2 bg-zinc-900 text-blue-400 rounded-lg font-semibold hover:bg-zinc-800 transition shadow border-2 border-blue-700 hover:border-blue-400">+ Add Task</button>
                            </li>
                          )}
                        </ul>
                      ) : (
                        <div className="text-zinc-400 text-sm md:text-lg">No tasks in this phase.</div>
                      )}
                      {/* Assignments Section */}
                      {phase.assignments && phase.assignments.length > 0 && (
                        <ul className="list-none space-y-4 md:space-y-6 mt-6 md:mt-10">
                          {phase.assignments.map((assignment: any, aIdx: number) => (
                            <li key={aIdx} className="relative group rounded-2xl px-4 md:px-8 py-5 border-2 border-purple-700 hover:border-purple-400 transition-transform duration-300 bg-zinc-950">
                              <label className="flex items-start md:items-center gap-3 w-full cursor-pointer z-10 relative">
                                <span className="inline-flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full border-2 border-purple-400 bg-zinc-950 shadow-md transition-all duration-200 mr-2">
                                  <input
                                    type="checkbox"
                                    checked={progress.completedAssignments.includes(assignment.title)}
                                    onChange={(e) => handleCheck("assignment", assignment.title, e.target.checked)}
                                    className="appearance-none w-5 h-5 md:w-6 md:h-6 rounded-full checked:bg-purple-500 checked:border-purple-500 focus:ring-2 focus:ring-purple-400 transition-all duration-200"
                                    disabled={progressLoading}
                                    title={`Mark assignment '${assignment.title}' as complete`}
                                  />
                                  {progress.completedAssignments.includes(assignment.title) && (
                                    <svg className="absolute w-4 h-4 text-white pointer-events-none" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                  )}
                                </span>
                                <span className="font-semibold text-base md:text-2xl break-words max-w-xs md:max-w-2xl text-purple-100 select-none">
                                  {isAdmin ? (
                                    <EditableField value={assignment.title} onChange={v => handleEditAssignment(idx, aIdx, "title", v)} placeholder="Assignment Title" />
                                  ) : assignment.title}
                                </span>
                                {isAdmin ? (
                                  <EditableField value={assignment.link} onChange={v => handleEditAssignment(idx, aIdx, "link", v)} placeholder="Assignment Link" className="ml-2 text-purple-400 underline text-sm md:text-lg break-all bg-transparent border-0 border-b border-purple-400" />
                                ) : (
                                  assignment.link && (
                                    <a
                                      href={assignment.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="ml-auto px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-lg shadow border border-purple-700 transition-all text-sm md:text-base"
                                    >
                                      Open Assignment
                                      <svg className="inline-block ml-2 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 3h7m0 0v7m0-7L10 14m-7 7h7a2 2 0 002-2v-7" /></svg>
                                    </a>
                                  )
                                )}
                                {isAdmin && (
                                  <button onClick={e => { e.preventDefault(); handleDeleteAssignment(idx, aIdx); }} className="ml-2 text-red-400 hover:text-red-600 text-lg" title="Delete Assignment">✕</button>
                                )}
                              </label>
                            </li>
                          ))}
                          {isAdmin && (
                            <li>
                              <button onClick={() => handleAddAssignment(idx)} className="w-full py-2 bg-zinc-950 text-purple-400 rounded-lg font-semibold hover:bg-zinc-900 transition shadow border-2 border-purple-700 hover:border-purple-400">+ Add Assignment</button>
                            </li>
                          )}
                        </ul>
                      )}
                      {phase.folderLink && (
                        <div className="mt-4 flex justify-end">
                          <a
                            href={phase.folderLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg shadow border border-blue-800 transition-all text-base"
                          >
                            Open Roadmap Folder
                            <svg className="inline-block ml-2 w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 3h7m0 0v7m0-7L10 14m-7 7h7a2 2 0 002-2v-7" /></svg>
                          </a>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-zinc-400 text-center text-base md:text-xl">No phases added to this roadmap yet.</div>
        )}
        {isAdmin && (
          <div className="mt-8 flex justify-center">
            <button onClick={handleAddPhase} className="px-6 py-3 bg-gradient-to-r from-blue-900 via-gray-900 to-purple-900 text-pink-200 rounded-2xl font-bold shadow-lg hover:bg-pink-600 transition-transform border-2 border-blue-700 hover:border-pink-400">+ Add Phase</button>
          </div>
        )}
        {/* Add Download Certificate button if 100% complete */}
        {percent === 100 && user && (
          <div className="flex flex-col items-center justify-center mt-8">
            <Certificate user={user} roadmap={roadmap} percent={100} />
          </div>
        )}
      </div>
    </div>
  );
};

export default RoadmapDetailPage;
