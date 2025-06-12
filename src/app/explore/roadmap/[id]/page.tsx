"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

const RoadmapDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };
  const [roadmap, setRoadmap] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!id) return;
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
    fetch(`/api/roadmap/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setRoadmap(data.roadmap);
        setLoading(false);
      });
  }, [id]);

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

  if (isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-green-400 text-2xl">
        Admin: You can edit this roadmap (admin UI placeholder)
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white px-4 py-8">
      <button
        className="mb-6 text-blue-400 hover:underline"
        onClick={() => router.back()}
      >
        ← Back
      </button>
      <h1 className="text-4xl font-bold mb-2">{roadmap.title}</h1>
      {roadmap.description && <p className="mb-4 text-lg text-gray-300">{roadmap.description}</p>}
      <div className="mb-8 text-sm text-gray-400">Created by: {roadmap.createdBy}</div>
      {roadmap.phases && roadmap.phases.length > 0 ? (
        <div className="space-y-8">
          {roadmap.phases.map((phase: any, idx: number) => (
            <div key={idx} className="bg-white bg-opacity-10 rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-semibold mb-2">{phase.title}</h2>
              {phase.tasks && phase.tasks.length > 0 ? (
                <ul className="list-disc ml-6 space-y-2">
                  {phase.tasks.map((task: any, tIdx: number) => (
                    <li key={tIdx}>
                      <span className="font-medium">{task.title}</span>
                      {task.link && (
                        <>
                          {" "}
                          <a href={task.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline ml-2">Resource</a>
                        </>
                      )}
                      {task.assignment && (
                        <span className="ml-2 text-yellow-300">[Assignment: {task.assignment}]</span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-400">No tasks in this phase.</div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-400">No phases added to this roadmap yet.</div>
      )}
    </div>
  );
};

export default RoadmapDetailPage;
