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
  const [showBackModal, setShowBackModal] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);

  // SpeechRecognition hook
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // Text-to-Speech: Speak the question when it appears
  const speakQuestion = (text: string) => {
    if (ttsEnabled && typeof window !== "undefined" && 'speechSynthesis' in window) {
      // Stop any previous speech
      window.speechSynthesis.cancel();
      setIsSpeaking(true);
      const utter = new window.SpeechSynthesisUtterance(text);
      utter.lang = 'en-US';
      utter.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utter);
    }
  };

  // Helper to stop TTS
  const stopTTS = () => {
    if (typeof window !== "undefined" && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
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
      stopTTS();
      speakQuestion(interview.questions[currentQuestion]);
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
    }
    // eslint-disable-next-line
  }, [currentQuestion, step, interview, ttsEnabled]);

  // Helper to ensure answer is always saved before navigation
  const syncAnswer = (value: string) => {
    const updated = [...answers];
    updated[currentQuestion] = value;
    setAnswers(updated);
  };

  const handleSaveAnswer = () => {
    stopTTS();
    // Save either transcript or textarea value
    const value = answers[currentQuestion] || transcript;
    if (!value) return;
    syncAnswer(value);
    resetTranscript();
    if (currentQuestion < interview.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      SpeechRecognition.stopListening();
    }
  };

  const handleNext = () => {
    stopTTS();
    syncAnswer(answers[currentQuestion] || transcript);
    setCurrentQuestion(currentQuestion + 1);
    resetTranscript();
  };

  const handleClear = () => {
    stopTTS();
    const updated = [...answers];
    updated[currentQuestion] = "";
    setAnswers(updated);
    resetTranscript();
  };

  const handleSubmit = async () => {
    // Save last answer before submit
    syncAnswer(answers[currentQuestion] || transcript);
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
    // --- NEW: Save attempt to DB for leaderboard ---
    if (user && user._id) {
      await fetch("/api/top-interviews/attempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topInterviewId: interview._id,
          user: user._id,
          answers,
          feedback: feedbackText,
          score
        })
      });
    }
    setStep(2);
    setSubmitting(false);
  };

  // Helper to terminate interview and mark remaining as unattempted
  const terminateInterview = async () => {
    stopTTS();
    // Mark all unanswered as ""
    const filledAnswers = [...answers];
    for (let i = 0; i < (interview?.questions?.length || 0); i++) {
      if (!filledAnswers[i]) filledAnswers[i] = "";
    }
    setAnswers(filledAnswers);
    setStep(2);
    setFeedback("Interview terminated early. Unanswered questions are marked as unattempted.");
    setScore(0);
    setShowBackModal(false);
    SpeechRecognition.stopListening();
  };

  // --- New: Show details first, then start interview ---
  if (loading) return <div className="text-blue-400">Loading...</div>;
  if (!interview) return <div className="text-zinc-400">Interview not found.</div>;

  // Details/landing view
  if (step === 0) {
    return (
      <>
        {/* Back Button - top left, only on md+ screens */}
        <button
          onClick={() => router.back()}
          className="hidden md:flex fixed top-6 left-4 items-center gap-2 text-blue-400 hover:text-blue-300 hover:underline text-xl md:text-2xl px-6 py-3 rounded-2xl bg-zinc-900 shadow-lg border-2 border-blue-700 transition-all z-50"
          style={{ position: 'fixed', top: '1.5rem', left: '1rem', zIndex: 50 }}
        >
          <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          <span className="hidden sm:inline">Back</span>
        </button>
        <div className="flex justify-center items-center min-h-[70vh]">
          <div className="max-w-2xl w-full mx-auto p-8 mt-8 bg-gradient-to-br from-blue-950 via-zinc-900 to-purple-950 rounded-3xl shadow-2xl border-2 border-blue-900 flex flex-col items-center">
            <h1 className="text-3xl md:text-4xl font-extrabold text-center bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 italic drop-shadow-lg">{interview.title}</h1>
            <div className="mb-4 text-zinc-100 text-lg text-center font-semibold italic max-w-xl">{interview.description}</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-4">
              <div className="bg-zinc-800/80 rounded-xl p-4 border border-blue-800 text-blue-200 font-bold text-center italic">Field: <span className="not-italic font-extrabold text-pink-400">{interview.field}</span></div>
              <div className="bg-zinc-800/80 rounded-xl p-4 border border-blue-800 text-blue-200 font-bold text-center italic">Level: <span className="not-italic font-extrabold text-pink-400">{interview.level}</span></div>
              <div className="bg-zinc-800/80 rounded-xl p-4 border border-blue-800 text-blue-200 font-bold text-center italic">Company: <span className="not-italic font-extrabold text-pink-400">{interview.company}</span></div>
              <div className="bg-zinc-800/80 rounded-xl p-4 border border-blue-800 text-blue-200 font-bold text-center italic">Topics: <span className="not-italic font-extrabold text-pink-400">{Array.isArray(interview.topics) ? interview.topics.join(", ") : interview.topics}</span></div>
              <div className="bg-zinc-800/80 rounded-xl p-4 border border-blue-800 text-blue-200 font-bold text-center italic col-span-1 sm:col-span-2">Skills: <span className="not-italic font-extrabold text-pink-400">{Array.isArray(interview.skills) ? interview.skills.join(", ") : interview.skills}</span></div>
            </div>
            <button className="mt-6 px-10 py-4 bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 text-white rounded-xl text-2xl font-bold shadow transition-all w-full max-w-xs tracking-wider italic hover:scale-105" onClick={() => setStep(1)}>Start Interview</button>
          </div>
        </div>
      </>
    );
  }

  // --- Existing interview flow, but update navigation/buttons ---
  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-zinc-950">
      {/* Back Button - top left, only on md+ screens */}
      <button
        onClick={() => router.back()}
        className="hidden md:flex fixed top-6 left-4 items-center gap-2 text-blue-400 hover:text-blue-300 hover:underline text-xl md:text-2xl px-6 py-3 rounded-2xl bg-zinc-900 shadow-lg border-2 border-blue-700 transition-all z-50"
        style={{ position: 'fixed', top: '1.5rem', left: '1rem', zIndex: 50 }}
      >
        <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        <span className="hidden sm:inline">Back</span>
      </button>
      {/* Modal for back warning */}
      {showBackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-zinc-950 rounded-2xl shadow-2xl border-2 border-blue-900 max-w-md w-full p-8 relative flex flex-col">
            <button
              className="absolute top-4 right-4 text-blue-400 hover:text-blue-200 text-2xl font-bold"
              onClick={() => setShowBackModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold text-red-400 mb-4 text-center">End Interview?</h3>
            <p className="text-zinc-200 mb-6 text-center">If you go back now, your interview will be terminated and all unanswered questions will be marked as unattempted. Are you sure you want to exit?</p>
            <div className="flex gap-4 justify-center">
              <button className="px-6 py-3 bg-red-700 hover:bg-red-800 text-white rounded-xl font-semibold" onClick={terminateInterview}>End Interview</button>
              <button className="px-6 py-3 bg-zinc-700 hover:bg-zinc-800 text-white rounded-xl font-semibold" onClick={() => setShowBackModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
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
            <div className="flex items-center justify-between mb-2">
              <span className="text-base md:text-lg text-zinc-100 font-semibold">Q{currentQuestion + 1}: {interview.questions[currentQuestion]}</span>
              <div className="flex items-center gap-2">
                <button
                  className={`p-1 rounded-full border transition-all ${ttsEnabled ? 'bg-blue-700 border-blue-400 text-white' : 'bg-zinc-800 border-zinc-500 text-zinc-300'}`}
                  onClick={() => setTtsEnabled(v => !v)}
                  title={ttsEnabled ? 'Disable Text-to-Speech' : 'Enable Text-to-Speech'}
                  type="button"
                  aria-label={ttsEnabled ? 'Disable Text-to-Speech' : 'Enable Text-to-Speech'}
                >
                  {/* Speaker icon SVG */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5L6 9H2v6h4l5 4V5z" />
                    {ttsEnabled && <path strokeLinecap="round" strokeLinejoin="round" d="M19 12c0-1.657-1.343-3-3-3m0 6c1.657 0 3-1.343 3-3" />}
                  </svg>
                </button>
              </div>
            </div>
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
              <button className="w-full md:w-auto px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-base md:text-lg font-semibold shadow transition-all" onClick={handleSaveAnswer} disabled={submitting || !(answers[currentQuestion] || transcript)}>Save</button>
              <button className="w-full md:w-auto px-6 py-3 bg-zinc-700 hover:bg-zinc-800 text-white rounded-xl text-base md:text-lg font-semibold shadow transition-all" onClick={handleClear} disabled={submitting || !(answers[currentQuestion] || transcript)}>Clear</button>
              {currentQuestion < interview.questions.length - 1 ? (
                <button className="w-full md:w-auto px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-base md:text-lg font-semibold shadow transition-all" onClick={handleNext} disabled={submitting}>Skip & Next</button>
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
