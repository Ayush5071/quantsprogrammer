"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";

function FeedbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(true);
  const [showQA, setShowQA] = useState(false);

  useEffect(() => {
    const feedbackId = searchParams.get("id");
    if (!feedbackId) return;
    setLoading(true);
    fetch(`/api/interview/feedback/detail?id=${feedbackId}`)
      .then((res) => res.json())
      .then((data) => {
        setFeedback(data.feedback || "");
        setScore(data.score ?? null);
        setQuestions(data.questions || []);
        setAnswers(data.answers || []);
        setTopic(data.topic || "");
      })
      .finally(() => setLoading(false));
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-400 text-sm">Loading feedback...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Subtle background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(34,197,94,0.06),transparent_50%)]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/interview")}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2 text-gray-400 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline text-sm">Back</span>
            </button>
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-white">Interview Feedback</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Score Card */}
        <div className="bg-[#111118] border border-white/5 rounded-xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Topic</p>
              <h2 className="text-lg font-semibold text-white">{topic || "General Interview"}</h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-center">
                <p className="text-gray-400 text-xs mb-1">Score</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-green-400">{score}</span>
                  <span className="text-gray-500 text-sm">/10</span>
                </div>
              </div>
            </div>
          </div>

          {/* Score bar */}
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${((score || 0) / 10) * 100}%` }}
            />
          </div>
        </div>

        {/* Feedback Card */}
        <div className="bg-[#111118] border border-white/5 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Detailed Feedback
          </h3>
          <div className="text-gray-300 whitespace-pre-line text-sm leading-relaxed">
            {feedback || "No feedback available."}
          </div>
        </div>

        {/* Questions & Answers */}
        <div className="bg-[#111118] border border-white/5 rounded-xl overflow-hidden">
          <button
            onClick={() => setShowQA(!showQA)}
            className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
          >
            <span className="text-white font-medium flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Questions & Answers ({questions.length})
            </span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${showQA ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showQA && (
            <div className="border-t border-white/5 p-4 space-y-4">
              {questions.map((q, i) => (
                <div key={i} className="bg-[#0a0a0f] border border-white/5 rounded-lg p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold flex items-center justify-center">
                      Q{i + 1}
                    </span>
                    <p className="text-gray-200 text-sm">{q}</p>
                  </div>
                  <div className="flex items-start gap-3 pl-9">
                    <span className="text-gray-500 text-xs font-medium">A:</span>
                    <p className="text-gray-400 text-sm">
                      {answers[i] || <span className="italic text-gray-600">(skipped)</span>}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => router.push("/interview")}
            className="flex-1 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Practice Again
          </button>
          <Link
            href="/profile#interview-history"
            className="flex-1 px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            View History
          </Link>
        </div>
      </main>
    </div>
  );
}

export default function InterviewFeedbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-400 text-sm">Loading feedback...</span>
          </div>
        </div>
      }
    >
      <FeedbackContent />
    </Suspense>
  );
}
