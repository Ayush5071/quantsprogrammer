"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import useCurrentUser from "@/lib/useCurrentUser";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

export default function AttemptTopInterviewPage() {
  const router = useRouter();
  const params = useParams();
  const user = useCurrentUser();
  const [interview, setInterview] = useState<any>(null);
  const [step, setStep] = useState(0); // 0: not started, 1: in progress, 2: feedback
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState<number|null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream|null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // SpeechRecognition hook
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // Text-to-Speech: Speak the question when it appears
  const speakQuestion = (text: string) => {
    if (typeof window !== "undefined" && 'speechSynthesis' in window) {
      setIsSpeaking(true);
      const utter = new window.SpeechSynthesisUtterance(text);
      utter.lang = 'en-US';
      utter.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utter);
    }
  };

  // Camera setup
  const startCamera = async () => {
    try {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: true });
      setMediaStream(stream);
      setCameraReady(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 100);
    } catch (err) {
      alert("Camera and microphone access is required for the interview. Please allow permissions and try again.");
    }
  };

  useEffect(() => {
    if (!params?.id) return;
    fetch(`/api/top-interviews`)
      .then(res => res.json())
      .then(data => {
        const found = data.find((i: any) => i._id === params.id);
        setInterview(found);
        setAnswers(found ? Array(found.questions.length).fill("") : []);
      })
      .finally(() => setLoading(false));
  }, [params]);

  useEffect(() => {
    if (interview && step === 1) {
      speakQuestion(interview.questions[currentQuestion]);
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
    }
    // eslint-disable-next-line
  }, [currentQuestion, step, interview]);

  const handleSaveAnswer = () => {
    if (!transcript) return;
    const updated = [...answers];
    updated[currentQuestion] = transcript;
    setAnswers(updated);
    resetTranscript();
    if (currentQuestion < interview.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      SpeechRecognition.stopListening();
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    SpeechRecognition.stopListening();
    // Call feedback API for real feedback and score
    const res = await fetch("/api/top-interviews/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questions: interview.questions,
        answers
      })
    });
    const data = await res.json();
    // Aggregate score (average or sum)
    let score = 0;
    let feedbackText = "";
    if (Array.isArray(data.feedback)) {
      score = Math.round(data.feedback.reduce((acc: number, f: any) => acc + (f.score || 0), 0) / data.feedback.length);
      feedbackText = data.feedback.map((f: any, i: number) => `Q${i+1}: ${f.feedback} (Score: ${f.score})`).join("\n");
    } else {
      feedbackText = data.feedback?.feedback || "No feedback";
      score = data.feedback?.score || 0;
    }
    setFeedback(feedbackText);
    setScore(score);
    setStep(2);
    setSubmitting(false);
  };

  // --- New: Show details first, then start interview ---
  if (loading) return <div className="text-blue-400">Loading...</div>;
  if (!interview) return <div className="text-zinc-400">Interview not found.</div>;

  // Details/landing view
  if (step === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6 mt-8 bg-zinc-900 rounded-3xl shadow-2xl border-2 border-blue-900">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-400 mb-2">{interview.title}</h1>
        <div className="mb-2 text-zinc-200">{interview.description}</div>
        <div className="mb-2 text-blue-300 text-sm">Field: {interview.field}</div>
        <div className="mb-2 text-blue-300 text-sm">Level: {interview.level}</div>
        <div className="mb-2 text-blue-300 text-sm">Company: {interview.company}</div>
        <div className="mb-2 text-blue-300 text-sm">Topics: {Array.isArray(interview.topics) ? interview.topics.join(", ") : interview.topics}</div>
        <div className="mb-2 text-blue-300 text-sm">Skills: {Array.isArray(interview.skills) ? interview.skills.join(", ") : interview.skills}</div>
        <button className="mt-6 px-8 py-4 bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 text-white rounded-xl text-xl font-bold shadow transition-all w-full" onClick={() => setStep(1)}>Start Interview</button>
      </div>
    );
  }

  // --- Existing interview flow, but update navigation/buttons ---
  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-zinc-950">
      {/* Left: Camera preview */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-4 md:p-6 bg-zinc-900 border-b-2 md:border-b-0 md:border-r-2 border-blue-900">
        <h2 className="text-lg md:text-xl font-bold text-blue-400 mb-4 text-center">Live Camera Preview</h2>
        <video ref={videoRef} className="rounded-2xl border-4 border-blue-700 shadow-lg w-full max-w-md aspect-video bg-black" autoPlay muted playsInline style={{ maxHeight: '40vh' }} />
        <button className="mt-4 md:mt-6 w-full md:w-auto px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-base md:text-lg font-semibold shadow transition-all" onClick={startCamera} disabled={cameraReady}>Open Camera & Mic</button>
        {!browserSupportsSpeechRecognition && <div className="mt-4 text-red-400 text-center">Speech recognition not supported in this browser.</div>}
      </div>
      {/* Right: Interview flow */}
      <div className="w-full md:w-1/2 flex flex-col justify-center p-4 md:p-8">
        <h1 className="text-xl md:text-2xl font-bold text-blue-400 mb-2 text-center md:text-left">{interview.title}</h1>
        <div className="mb-4 text-zinc-200 text-center md:text-left">{interview.description}</div>
        {step === 1 && (
          <div className="flex flex-col gap-4 md:gap-6">
            <div className="mb-2 text-base md:text-lg text-zinc-100 font-semibold">Q{currentQuestion + 1}: {interview.questions[currentQuestion]}</div>
            <textarea
              className="w-full rounded-lg bg-zinc-800 text-zinc-100 border border-blue-800 p-3 text-base md:text-lg"
              rows={2}
              value={answers[currentQuestion] || transcript}
              onChange={e => {
                const updated = [...answers];
                updated[currentQuestion] = e.target.value;
                setAnswers(updated);
              }}
              placeholder="Type or speak your answer..."
              title="Answer"
            />
            <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-center">
              <button className="w-full md:w-auto px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-base md:text-lg font-semibold shadow transition-all" onClick={handleSaveAnswer} disabled={submitting || !transcript}>Save</button>
              {currentQuestion < interview.questions.length - 1 ? (
                <button className="w-full md:w-auto px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-base md:text-lg font-semibold shadow transition-all" onClick={() => setCurrentQuestion(currentQuestion + 1)} disabled={submitting}>Skip & Next</button>
              ) : (
                <button className="w-full md:w-auto px-6 py-3 bg-green-700 hover:bg-green-800 text-white rounded-xl text-base md:text-lg font-semibold shadow transition-all" onClick={handleSubmit} disabled={submitting}>Submit Interview</button>
              )}
            </div>
            <div className="mt-2 text-blue-300 text-xs md:text-sm">Speech-to-text: <span className="font-mono bg-zinc-800 px-2 py-1 rounded">{transcript}</span></div>
          </div>
        )}
        {step === 2 && (
          <div className="mt-6">
            <div className="font-semibold text-blue-300 mb-2 text-center md:text-left">Feedback:</div>
            <div className="text-zinc-100 whitespace-pre-line mb-4 text-center md:text-left">{feedback}</div>
            <div className="text-blue-400 font-bold text-lg mb-4 text-center md:text-left">Score: {score}/100</div>
            <button className="w-full md:w-auto px-6 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold shadow transition-all" onClick={() => router.push("/top-interviews")}>Back to Top Interviews</button>
          </div>
        )}
      </div>
    </div>
  );
}
