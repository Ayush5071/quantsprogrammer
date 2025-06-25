"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function FeedbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState<number|null>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get feedbackId from query params
    const feedbackId = searchParams.get("id");
    if (!feedbackId) return;
    setLoading(true);
    fetch(`/api/interview/feedback/detail?id=${feedbackId}`)
      .then(res => res.json())
      .then(data => {
        setFeedback(data.feedback || "");
        setScore(data.score ?? null);
        setQuestions(data.questions || []);
        setAnswers(data.answers || []);
        setTopic(data.topic || "");
      })
      .finally(() => setLoading(false));
  }, [searchParams]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-blue-400 text-xl">Loading feedback...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-blue-950 flex flex-col items-center py-12 px-2 md:px-8">
      <div className="w-full max-w-3xl bg-zinc-900 rounded-3xl shadow-2xl border-2 border-blue-900 p-8 md:p-12 mt-8">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-400 mb-4">Interview Feedback</h1>
        <div className="mb-4 text-lg text-zinc-200"><span className="font-semibold">Topic:</span> {topic}</div>
        <div className="mb-4 text-lg text-blue-400 font-bold">Score: {score}/10</div>
        <div className="mb-6">
          <div className="font-semibold text-blue-300 mb-1">Detailed Feedback:</div>
          <div className="text-zinc-100 whitespace-pre-line text-base md:text-lg">{feedback}</div>
        </div>
        <details className="mb-4">
          <summary className="cursor-pointer text-blue-300 underline">Show All Questions & Answers</summary>
          <ul className="mt-2 space-y-2">
            {questions.map((q, i) => (
              <li key={i} className="bg-zinc-900 rounded p-2 border border-zinc-700">
                <span className="font-semibold text-zinc-100">Q{i + 1}:</span> {q}
                <br />
                <span className="font-semibold text-zinc-100">A{i + 1}:</span> {answers[i] || <span className="italic text-zinc-400">(skipped)</span>}
              </li>
            ))}
          </ul>
        </details>
        <button className="mt-6 px-8 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-lg font-bold shadow transition-all" onClick={() => router.push("/interview")}>Back to Interview</button>
      </div>
    </div>
  );
}

export default function InterviewFeedbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-blue-400 text-xl">Loading feedback...</div>}>
      <FeedbackContent />
    </Suspense>
  );
}
