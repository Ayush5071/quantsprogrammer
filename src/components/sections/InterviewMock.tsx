import React, { useState } from "react";

const topics = [
  "Data Structures",
  "Algorithms",
  "System Design",
  "JavaScript",
  "React",
  "General HR"
];

export default function InterviewMock() {
  const [step, setStep] = useState(0);
  const [topic, setTopic] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState<number|null>(null);
  const [loading, setLoading] = useState(false);

  const startInterview = async () => {
    setLoading(true);
    setFeedback("");
    setScore(null);
    // Fetch first question from API
    const res = await fetch("/api/interview/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic })
    });
    const data = await res.json();
    setQuestion(data.question);
    setStep(1);
    setLoading(false);
  };

  const submitAnswer = async () => {
    setLoading(true);
    // Send answer to API for feedback and score
    const res = await fetch("/api/interview/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, question, answer })
    });
    const data = await res.json();
    setFeedback(data.feedback);
    setScore(data.score);
    setStep(2);
    setLoading(false);
    // Store result in DB (API handles this)
  };

  const reset = () => {
    setStep(0);
    setTopic("");
    setQuestion("");
    setAnswer("");
    setFeedback("");
    setScore(null);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-700">
      <h2 className="text-2xl font-bold mb-4 text-center text-gradient bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">AI Mock Interview</h2>
      {step === 0 && (
        <>
          <label className="block mb-2 font-semibold">Choose a topic:</label>
          <select
            className="w-full p-2 rounded bg-zinc-800 border border-zinc-700 mb-4"
            value={topic}
            onChange={e => setTopic(e.target.value)}
          >
            <option value="">Select topic</option>
            {topics.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <button
            className="w-full py-2 px-4 rounded bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 text-white font-bold mt-2 disabled:opacity-50"
            onClick={startInterview}
            disabled={!topic || loading}
          >
            {loading ? "Starting..." : "Start Interview"}
          </button>
        </>
      )}
      {step === 1 && (
        <>
          <div className="mb-4">
            <span className="font-semibold">Question:</span>
            <div className="mt-2 p-3 bg-zinc-800 rounded border border-zinc-700">{question}</div>
          </div>
          <textarea
            className="w-full p-2 rounded bg-zinc-800 border border-zinc-700 mb-4"
            rows={4}
            placeholder="Type your answer..."
            value={answer}
            onChange={e => setAnswer(e.target.value)}
          />
          <button
            className="w-full py-2 px-4 rounded bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 text-white font-bold mt-2 disabled:opacity-50"
            onClick={submitAnswer}
            disabled={!answer || loading}
          >
            {loading ? "Submitting..." : "Submit Answer"}
          </button>
        </>
      )}
      {step === 2 && (
        <>
          <div className="mb-4">
            <span className="font-semibold">Feedback:</span>
            <div className="mt-2 p-3 bg-zinc-800 rounded border border-zinc-700 text-green-300">{feedback}</div>
          </div>
          <div className="mb-4 text-lg font-bold text-center text-gradient bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Your Score: <span className="text-2xl">{score} / 10</span>
          </div>
          <button
            className="w-full py-2 px-4 rounded bg-zinc-700 text-white font-bold mt-2"
            onClick={reset}
          >
            Try Another Interview
          </button>
        </>
      )}
    </div>
  );
}
