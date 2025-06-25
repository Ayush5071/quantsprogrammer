'use client';

import React, { useRef, useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import Link from "next/link";
import useCurrentUser from "@/lib/useCurrentUser";
import { useState as useReactState } from "react";
import { useRouter } from "next/navigation";

// Responsive Navbar (replace Navbar import and usage)
function ResponsiveNavbar() {
  const [open, setOpen] = useReactState(false);
  return (
    <nav className="w-full bg-zinc-950 border-b-2 border-blue-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-blue-400">
          <img src="/official_logo.png" alt="Dev Roadmap" className="h-10 w-10 rounded-full" />
          Dev Roadmap
        </Link>
        <button
          className="md:hidden text-zinc-200 focus:outline-none"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen(!open)}
        >
          {open ? (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
          )}
        </button>
        {/* Desktop nav */}
        <div className="hidden md:flex gap-8 items-center">
          <Link href="/" className="text-zinc-200 hover:text-blue-400 font-medium text-lg transition-colors px-2 py-1 rounded-lg hover:bg-zinc-900">Home</Link>
          <Link href="/explore" className="text-zinc-200 hover:text-blue-400 font-medium text-lg transition-colors px-2 py-1 rounded-lg hover:bg-zinc-900">Explore</Link>
          <Link href="/blogs" className="text-zinc-200 hover:text-blue-400 font-medium text-lg transition-colors px-2 py-1 rounded-lg hover:bg-zinc-900">Blogs</Link>
          <Link href="/profile" className="text-zinc-200 hover:text-blue-400 font-medium text-lg transition-colors px-2 py-1 rounded-lg hover:bg-zinc-900">Profile</Link>
          <Link href="/interview" className="text-zinc-200 hover:text-blue-400 font-medium text-lg transition-colors px-2 py-1 rounded-lg hover:bg-zinc-900">Mock Interview</Link>
          <Link href="/top-interviews" className="text-zinc-200 hover:text-pink-400 font-bold text-lg transition-colors px-2 py-1 rounded-lg hover:bg-zinc-900">Top Interviews</Link>
          <Link href="/profile#interview-history" className="ml-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold shadow transition-all">Past Interviews</Link>
        </div>
      </div>
      {/* Mobile nav overlay */}
      {open && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setOpen(false)}
            aria-label="Close menu backdrop"
          />
          <div className="fixed top-0 left-0 w-full bg-zinc-950 border-b-2 border-blue-900 shadow-lg z-50 animate-slideDown flex flex-col gap-6 px-8 py-8">
            <button
              className="self-end text-zinc-200 mb-4 focus:outline-none"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <Link href="/" className="text-zinc-200 hover:text-blue-400 font-medium text-xl transition-colors px-2 py-2 rounded-lg hover:bg-zinc-900" onClick={() => setOpen(false)}>Home</Link>
            <Link href="/explore" className="text-zinc-200 hover:text-blue-400 font-medium text-xl transition-colors px-2 py-2 rounded-lg hover:bg-zinc-900" onClick={() => setOpen(false)}>Explore</Link>
            <Link href="/blogs" className="text-zinc-200 hover:text-blue-400 font-medium text-xl transition-colors px-2 py-2 rounded-lg hover:bg-zinc-900" onClick={() => setOpen(false)}>Blogs</Link>
            <Link href="/profile" className="text-zinc-200 hover:text-blue-400 font-medium text-xl transition-colors px-2 py-2 rounded-lg hover:bg-zinc-900" onClick={() => setOpen(false)}>Profile</Link>
            <Link href="/interview" className="text-zinc-200 hover:text-blue-400 font-medium text-xl transition-colors px-2 py-2 rounded-lg hover:bg-zinc-900" onClick={() => setOpen(false)}>Mock Interview</Link>
            <Link href="/top-interviews" className="text-zinc-200 hover:text-pink-400 font-bold text-xl transition-colors px-2 py-2 rounded-lg hover:bg-zinc-900" onClick={() => setOpen(false)}>Top Interviews</Link>
            <Link href="/profile#interview-history" className="px-4 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold shadow transition-all text-center" onClick={() => setOpen(false)}>Past Interviews</Link>
          </div>
        </>
      )}
    </nav>
  );
}

const topics = [
  "Data Structures",
  "Algorithms",
  "System Design",
  "JavaScript",
  "React",
  "General HR"
];

export default function InterviewDashboard() {
  const [step, setStep] = useState(0);
  const [topic, setTopic] = useState("");
  const [question, setQuestion] = useState("");
  const [aiThinking, setAiThinking] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState<number|null>(null);
  const [loading, setLoading] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream|null>(null);
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const user = useCurrentUser();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const router = useRouter();

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

  // Add a flag to track if camera is open
  const [cameraReady, setCameraReady] = useState(false);

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
      // Speech recognition will start after interview starts
    } catch (err) {
      alert("Camera and microphone access is required for the interview. Please allow permissions and try again.");
    }
  };

  // Start interview
  const startInterview = async () => {
    if (!cameraReady) {
      alert("Please open your camera & mic before starting the interview.");
      return;
    }
    setLoading(true);
    setFeedback("");
    setScore(null);
    setAiThinking(false);
    setCurrentQuestion(1);
    setAnswers([]);
    // Fetch questions from Gemini API
    const res = await fetch("/api/interview/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, experience, skills, numQuestions })
    });
    const data = await res.json();
    setQuestions(data.questions || [data.question]);
    setQuestion((data.questions && data.questions[0]) || data.question);
    setStep(1);
    setLoading(false);
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
  };

  // When question changes, speak it
  React.useEffect(() => {
    if (question) speakQuestion(question);
  }, [question]);

  // Submit answer (speech-to-text)
  const submitAnswer = async () => {
    if (!transcript) return;
    setLoading(true);
    // Save answer
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestion - 1] = transcript;
    setAnswers(updatedAnswers);
    setLoading(false);
    if (currentQuestion < numQuestions) {
      setCurrentQuestion(currentQuestion + 1);
      setQuestion(questions[currentQuestion]);
      setStep(1);
      setFeedback("");
      setScore(null);
      setAiThinking(false);
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
    } else {
      // On last question, after saving answer, show submit button
      setStep(3); // Interview finished, show submit button
      SpeechRecognition.stopListening();
    }
  };

  // Move to next question
  const nextQuestion = () => {
    if (currentQuestion < numQuestions && questions[currentQuestion]) {
      setCurrentQuestion(currentQuestion + 1);
      setQuestion(questions[currentQuestion]);
      setStep(1);
      setFeedback("");
      setScore(null);
      setAiThinking(false);
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
    } else {
      setStep(3); // Interview finished
      SpeechRecognition.stopListening();
    }
  };

  // Skip question
  const skipQuestion = () => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestion - 1] = "(skipped)";
    setAnswers(updatedAnswers);
    nextQuestion();
  };

  // Submit all answers for overall feedback and redirect to feedback page
  const submitAllAnswers = async () => {
    setLoading(true);
    setAiThinking(true);
    try {
      const res = await fetch("/api/interview/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, questions, answers, user: user?._id })
      });
      const data = await res.json();
      // Save feedbackId if returned (assume API returns _id)
      if (data._id) {
        router.push(`/interview/feedback?id=${data._id}`);
      } else {
        setFeedback(data.feedback);
        setScore(data.score);
        setStep(4); // fallback
      }
    } finally {
      setLoading(false);
      setAiThinking(false);
    }
  };

  const reset = () => {
    setStep(0);
    setTopic("");
    setQuestion("");
    setFeedback("");
    setScore(null);
    setAiThinking(false);
    setAnswers([]);
    resetTranscript();
    SpeechRecognition.stopListening();
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
  };

  // Top Interviews Section banner state
  const [showTopBanner, setShowTopBanner] = useState(true);

  if (!browserSupportsSpeechRecognition) {
    return <div>Your browser does not support speech recognition. Please use Chrome or Edge.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-blue-950 flex flex-col">
      <ResponsiveNavbar />
      <main className="flex-1 flex flex-col items-center justify-center px-2 py-8 md:py-16">
        {/* Top Interviews Section Banner (removable) */}
        {showTopBanner && (
          <div className="w-full max-w-5xl mx-auto mb-12 relative">
            <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-purple-900 rounded-3xl shadow-2xl border-2 border-blue-400 p-6 md:p-10 flex flex-col gap-6">
              <button
                className="absolute top-4 right-4 text-blue-200 hover:text-white text-2xl font-bold focus:outline-none"
                aria-label="Close banner"
                onClick={() => setShowTopBanner(false)}
                type="button"
              >
                &times;
              </button>
              <h2 className="text-3xl md:text-4xl font-bold text-blue-300 mb-2">Top Interviews</h2>
              <p className="text-zinc-200 mb-4">Challenge yourself with the best interviews curated by our admins. Attempt for a score out of 100 and get detailed feedback!</p>
              <Link href="/top-interviews" className="self-start px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-lg font-semibold shadow transition-all">View & Attempt Top Interviews</Link>
              {user?.role === 'admin' && (
                <Link href="/admin/top-interview-create" className="self-start px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-lg font-semibold shadow transition-all">Create Top Interview</Link>
              )}
            </div>
          </div>
        )}
        <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-10 md:gap-16 bg-zinc-900/90 rounded-3xl shadow-2xl border-2 border-blue-900 p-6 md:p-12 mt-8">
          {/* AI Side */}
          <div className="flex-1 flex flex-col items-center md:items-start gap-6">
            <div className="w-full flex flex-col gap-2">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">AI Interviewer</h2>
              <div className={`bg-zinc-800 rounded-xl p-4 border border-blue-800 text-zinc-200 min-h-[80px] shadow-inner flex items-center gap-3 ${isSpeaking ? 'ring-2 ring-blue-400 animate-pulse' : ''}`}>
                {isSpeaking && <span className="w-3 h-3 rounded-full bg-blue-400 animate-pulse mr-2" />}
                {question ? (
                  <span className="text-lg">{question}</span>
                ) : (
                  <span className="text-zinc-400">AI will ask you questions here...</span>
                )}
              </div>
              {aiThinking && (
                <div className="text-blue-400 animate-pulse mt-2">AI is thinking...</div>
              )}
            </div>
          </div>
          {/* User Side */}
          <div className="flex-1 flex flex-col items-center md:items-start gap-6">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-200 mb-2">Your Side</h2>
            <div className="w-full flex flex-col gap-2">
              <video ref={videoRef} autoPlay playsInline muted className="rounded-xl w-full max-w-xs mb-2 border-2 border-blue-800 shadow-lg" />
              {/* Only show transcript after interview starts */}
              {step !== 0 && (
                <div className="w-full p-3 bg-zinc-800 rounded border border-zinc-700 text-zinc-200 text-base min-h-[48px]">
                  {transcript ? `You are saying: ${transcript}` : "Say something and it will appear here..."}
                </div>
              )}
              {/* Hide answer/submit controls when setting up interview */}
              {step !== 0 && (
                <div className="flex flex-wrap gap-3 mt-2">
                  <button className="py-2 px-4 rounded bg-zinc-700 text-white font-bold hover:bg-zinc-800 transition" onClick={resetTranscript}>Clear Answer</button>
                  {currentQuestion < numQuestions ? (
                    <>
                      <button className="py-2 px-4 rounded bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 text-white font-bold hover:scale-105 transition" onClick={submitAnswer} disabled={!transcript || loading}>Save & Next</button>
                      <button className="py-2 px-4 rounded bg-yellow-700 text-white font-bold hover:bg-yellow-800 transition" onClick={skipQuestion}>Skip</button>
                    </>
                  ) : (
                    <button className="py-2 px-4 rounded bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 text-white font-bold hover:scale-105 transition" onClick={submitAnswer} disabled={!transcript || loading}>Save Answer</button>
                  )}
                </div>
              )}
            </div>
            {/* Controls for starting/ending interview */}
            {step === 0 && (
              <div className="w-full flex flex-col gap-4 mt-4">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Topic as creatable input */}
                  <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="Enter Interview Topic (e.g. React, Data Structures)" className="w-full md:w-1/2 px-4 py-3 rounded-lg bg-zinc-800 text-zinc-100 border border-blue-800 text-lg" />
                  <input value={experience} onChange={e => setExperience(e.target.value)} placeholder="Your Experience (e.g. 2 years)" className="w-full md:w-1/2 px-4 py-3 rounded-lg bg-zinc-800 text-zinc-100 border border-blue-800 text-lg" />
                </div>
                <input value={skills} onChange={e => setSkills(e.target.value)} placeholder="Your Skills (comma separated)" className="w-full px-4 py-3 rounded-lg bg-zinc-800 text-zinc-100 border border-blue-800 text-lg" />
                {/* Number of questions as slider */}
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <label htmlFor="numQuestionsSlider" className="text-zinc-200">Number of Questions:</label>
                  <input
                    id="numQuestionsSlider"
                    type="range"
                    min={1}
                    max={10}
                    value={numQuestions}
                    onChange={e => setNumQuestions(Number(e.target.value))}
                    className="w-full md:w-1/2 accent-blue-700"
                    aria-label="Number of Questions"
                    title="Number of Questions"
                  />
                  <span className="ml-2 text-blue-400 font-bold text-lg">{numQuestions}</span>
                </div>
                <div className="flex gap-4 mt-2 flex-wrap">
                  <button className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-lg font-semibold shadow transition-all" onClick={startCamera} disabled={cameraReady}>Open Camera & Mic</button>
                  <button className="px-6 py-3 bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 text-white rounded-xl text-lg font-semibold shadow transition-all" onClick={startInterview} disabled={!cameraReady || !topic || !experience || !skills || loading}>Start Interview</button>
                </div>
              </div>
            )}
            {/* Final feedback and submit all answers */}
            {(step === 3) && (
              <button className="mt-6 px-8 py-3 bg-green-700 hover:bg-green-800 text-white rounded-xl text-lg font-bold shadow transition-all" onClick={submitAllAnswers} disabled={loading}>Submit Interview &amp; View Feedback</button>
            )}
            {step === 4 && (
              <button className="mt-6 px-8 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-lg font-bold shadow transition-all" onClick={reset}>Restart Interview</button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
