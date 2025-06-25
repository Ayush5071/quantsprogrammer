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
  const [modalItem, setModalItem] = useState<InterviewResult | null>(null);

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
      <h3 className="text-2xl font-bold text-blue-300 mb-6">Interview Feedback</h3>
      {loading ? (
        <div className="text-zinc-400">Loading...</div>
      ) : history.length === 0 ? (
        <div className="text-zinc-400">No interview attempts found.</div>
      ) : (
        <div className="flex gap-6 overflow-x-auto pb-2 custom-scrollbar">
          {history.map((item) => (
            <div
              key={item._id}
              className="min-w-[320px] max-w-xs bg-zinc-800 rounded-xl p-6 border border-blue-800 shadow-md flex flex-col justify-between relative hover:scale-105 transition-transform duration-200 cursor-pointer"
              onClick={() => setModalItem(item)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-lg text-zinc-200 truncate max-w-[140px]" title={item.topic}>{item.topic}</span>
                <span className="text-blue-400 font-bold bg-blue-950 px-3 py-1 rounded-full text-sm">Score: {item.score}/10</span>
              </div>
              <span className="text-xs text-zinc-400 mb-2">{new Date(item.createdAt).toLocaleDateString()}</span>
              <div className="mb-2">
                <span className="font-semibold text-zinc-300">Feedback:</span>
                <div className="text-zinc-200 mt-1 line-clamp-3 min-h-[48px]">{item.feedback.length > 80 ? item.feedback.slice(0, 80) + '...' : item.feedback}</div>
              </div>
              <span className="mt-2 text-blue-300 underline text-sm hover:text-blue-400 cursor-pointer">View Details</span>
            </div>
          ))}
        </div>
      )}
      {/* Modal for full feedback details */}
      {modalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-zinc-950 rounded-2xl shadow-2xl border-2 border-blue-900 max-w-2xl w-full p-12 relative flex flex-col max-h-[80vh] sm:max-h-[95vh] overflow-y-auto hide-scrollbar">
            <button
              className="absolute top-4 right-4 text-blue-400 hover:text-blue-200 text-2xl font-bold"
              onClick={() => setModalItem(null)}
              aria-label="Close"
            >
              &times;
            </button>
            <h4 className="text-3xl font-bold text-blue-300 mb-2">{modalItem.topic}</h4>
            <div className="flex items-center gap-4 mb-2">
              <span className="text-blue-400 font-bold bg-blue-950 px-3 py-1 rounded-full text-lg">Score: {modalItem.score}/10</span>
              <span className="text-sm text-zinc-400">{new Date(modalItem.createdAt).toLocaleString()}</span>
            </div>
            <div className="mb-4">
              <span className="font-semibold text-zinc-300 text-lg">Feedback:</span>
              <div className="text-zinc-200 mt-1 whitespace-pre-line text-base font-medium">
                {modalItem.feedback}
              </div>
            </div>
            <div className="mb-2">
              <details open>
                <summary className="cursor-pointer text-blue-300 underline text-lg font-semibold mb-2">Show Q&A</summary>
                <ul className="mt-2 space-y-2">
                  {modalItem.questions.map((q, i) => (
                    <li key={i} className="bg-zinc-900 rounded p-2 border border-zinc-700 text-zinc-100 text-base">
                      <span className="font-semibold">Q{i + 1}:</span> {q}
                      <br />
                      <span className="font-semibold">A{i + 1}:</span> {modalItem.answers[i] || <span className="italic text-zinc-400">(skipped)</span>}
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewHistory;
