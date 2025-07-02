import React, { useEffect, useState, useCallback } from "react";
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

// Cache for interview history
const historyCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const InterviewHistory: React.FC<{ userId?: string }> = ({ userId }) => {
  const [history, setHistory] = useState<InterviewResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalItem, setModalItem] = useState<InterviewResult | null>(null);

  const fetchHistory = useCallback(async () => {
    if (!userId) return;
    
    const cacheKey = `interview_history_${userId}`;
    const cached = historyCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setHistory(cached.data);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`/api/interview/history?userId=${userId}`);
      const data = res.data.results || [];
      setHistory(data);
      
      historyCache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
    } catch (error) {
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  if (!userId) return null;

  return (
    <div className="w-full">
      {/* Header Section - Matching InterviewPreparation style */}
      <div className="text-center mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full text-sm text-zinc-300 mb-4 hover:bg-white/15 transition-all duration-300">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span>Track Your Progress</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-blue-300 mb-4 leading-tight tracking-tight">
            Past Interview 
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600">
              {" "}Sessions
            </span>
          </h2>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-base md:text-lg text-zinc-300 max-w-3xl mx-auto font-medium leading-relaxed text-center"
        >
          Review your AI interview practice sessions and track your
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-500 font-semibold">
            {" "}growth over time
          </span>.
        </motion.p>
      </div>

      {/* Content Area */}
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-xl hover:border-white/20 transition-all duration-300">
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
          >
            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-400/30 rounded-xl p-5">
              <div className="text-3xl font-bold text-blue-300">{history.length}</div>
              <div className="text-sm text-blue-200">Total Attempts</div>
            </div>
            <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-400/30 rounded-xl p-5">
              <div className="text-3xl font-bold text-green-300">
                {history.length > 0 ? (history.reduce((sum, item) => sum + item.score, 0) / history.length).toFixed(1) : '0'}
              </div>
              <div className="text-sm text-green-200">Avg Score</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-400/30 rounded-xl p-5">
              <div className="text-3xl font-bold text-purple-300">
                {history.filter(item => item.score >= 8).length}
              </div>
              <div className="text-sm text-purple-200">High Scores</div>
            </div>
          </motion.div>
        )}
      
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <div className="absolute inset-0 rounded-full border-2 border-blue-200/20"></div>
            </div>
          </div>
        ) : history.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-white mb-2">No Interview Attempts Yet</h4>
            <p className="text-zinc-400 mb-6">Start practicing with our AI interview system to track your progress!</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/interview'}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold rounded-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300"
            >
              Start Your First Interview
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer group"
                onClick={() => setModalItem(item)}
                whileHover={{ y: -5 }}
              >
                {/* Background Gradient Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-xl" />
                
                {/* Header */}
                <div className="flex items-center justify-between mb-4 relative">
                  <h4 className="font-bold text-lg text-white truncate max-w-[180px] group-hover:text-blue-400 transition-colors" title={item.topic}>
                    {item.topic}
                  </h4>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    item.score >= 8 ? 'bg-green-500/20 text-green-300 border-green-400/40' :
                    item.score >= 6 ? 'bg-yellow-500/20 text-yellow-300 border-yellow-400/40' :
                    'bg-red-500/20 text-red-300 border-red-400/40'
                  }`}>
                    {item.score}/10
                  </div>
                </div>

                {/* Date */}
                <div className="text-xs text-zinc-400 mb-4 flex items-center gap-2">
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
                  <p className="text-sm text-blue-300 font-semibold mb-2">AI Feedback:</p>
                  <p className="text-zinc-300 text-sm line-clamp-3 leading-relaxed">
                    {item.feedback.length > 120 ? item.feedback.slice(0, 120) + '...' : item.feedback}
                  </p>
                </div>

                {/* View Details Button */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-500 group-hover:from-blue-300 group-hover:to-blue-400 flex items-center gap-2">
                    View Details
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
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
      </div>
      
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
