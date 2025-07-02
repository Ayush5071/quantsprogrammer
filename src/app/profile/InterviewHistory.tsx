import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
    <div className="w-full bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-xl">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        Interview History
      </h3>
      
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      ) : history.length === 0 ? (
        <div className="text-center text-zinc-400 py-12">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg mb-2">No interview attempts found</p>
          <p className="text-sm">Start practicing with our AI interview system!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300 cursor-pointer group"
              onClick={() => setModalItem(item)}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-lg text-white truncate max-w-[180px] group-hover:text-green-400 transition-colors" title={item.topic}>
                  {item.topic}
                </h4>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    item.score >= 8 ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                    item.score >= 6 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                    'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {item.score}/10
                  </span>
                </div>
              </div>

              {/* Date */}
              <div className="text-xs text-zinc-400 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(item.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>

              {/* Feedback Preview */}
              <div className="mb-4">
                <p className="text-sm text-zinc-300 font-medium mb-2">Feedback:</p>
                <p className="text-zinc-400 text-sm line-clamp-3 leading-relaxed">
                  {item.feedback.length > 120 ? item.feedback.slice(0, 120) + '...' : item.feedback}
                </p>
              </div>

              {/* View Details Button */}
              <div className="flex items-center justify-between">
                <span className="text-green-400 text-sm font-medium group-hover:text-green-300 transition-colors flex items-center gap-2">
                  View Details
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
                <div className="text-xs text-zinc-500">
                  {item.questions.length} questions
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      {/* Modal for full feedback details */}
      {modalItem && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setModalItem(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-2xl font-bold text-white mb-2">{modalItem.topic}</h4>
                  <div className="flex items-center gap-4">
                    <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                      modalItem.score >= 8 ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                      modalItem.score >= 6 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                      'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      Score: {modalItem.score}/10
                    </span>
                    <span className="text-sm text-zinc-400 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(modalItem.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
                <button
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-white"
                  onClick={() => setModalItem(null)}
                  aria-label="Close"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] custom-scrollbar">
              {/* Feedback Section */}
              <div className="mb-8">
                <h5 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  AI Feedback
                </h5>
                <div className="bg-white/10 border border-white/20 rounded-lg p-4">
                  <p className="text-zinc-300 leading-relaxed whitespace-pre-line">
                    {modalItem.feedback}
                  </p>
                </div>
              </div>

              {/* Q&A Section */}
              <div>
                <h5 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Questions & Answers ({modalItem.questions.length})
                </h5>
                <div className="space-y-4">
                  {modalItem.questions.map((q, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-6 h-6 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-sm font-bold">
                            Q{i + 1}
                          </span>
                          <span className="text-sm font-medium text-blue-400">Question</span>
                        </div>
                        <p className="text-zinc-300 ml-8">{q}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-6 h-6 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-sm font-bold">
                            A{i + 1}
                          </span>
                          <span className="text-sm font-medium text-green-400">Your Answer</span>
                        </div>
                        <p className="text-zinc-300 ml-8">
                          {modalItem.answers[i] || (
                            <span className="italic text-zinc-500">No answer provided</span>
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default InterviewHistory;
