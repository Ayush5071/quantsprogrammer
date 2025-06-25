import React, { useEffect, useState } from "react";
import axios from "axios";

interface InterviewResult {
  _id: string;
  topic: string;
  questions: string[];
  answers: string[];
  feedback: string;
  score: number;
  createdAt: string;
}

const InterviewHistory: React.FC<{ userId?: string }> = ({ userId }) => {
  const [history, setHistory] = useState<InterviewResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    axios
      .get(`/api/interview/history?userId=${userId}`)
      .then((res) => setHistory(res.data.results || []))
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  }, [userId]);

  if (!userId) return null;

  return (
    <div className="mt-12 w-full bg-zinc-900 rounded-2xl p-8 border-2 border-blue-900 shadow-xl">
      <h3 className="text-2xl font-bold text-blue-300 mb-6">Interview History</h3>
      {loading ? (
        <div className="text-zinc-400">Loading...</div>
      ) : history.length === 0 ? (
        <div className="text-zinc-400">No interview attempts found.</div>
      ) : (
        <div className="space-y-8">
          {history.map((item) => (
            <div key={item._id} className="bg-zinc-800 rounded-xl p-6 border border-blue-800">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 gap-2">
                <span className="font-semibold text-lg text-zinc-200">{item.topic}</span>
                <span className="text-blue-400 font-bold">Score: {item.score}/10</span>
                <span className="text-xs text-zinc-400">{new Date(item.createdAt).toLocaleString()}</span>
              </div>
              <div className="mb-2">
                <span className="font-semibold text-zinc-300">Feedback:</span>
                <div className="text-zinc-200 whitespace-pre-line mt-1">{item.feedback}</div>
              </div>
              <details className="mt-2">
                <summary className="cursor-pointer text-blue-300 underline">Show Q&A</summary>
                <ul className="mt-2 space-y-2">
                  {item.questions.map((q, i) => (
                    <li key={i} className="bg-zinc-900 rounded p-2 border border-zinc-700">
                      <span className="font-semibold text-zinc-100">Q{i + 1}:</span> {q}
                      <br />
                      <span className="font-semibold text-zinc-100">A{i + 1}:</span> {item.answers[i] || <span className="italic text-zinc-400">(skipped)</span>}
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InterviewHistory;
