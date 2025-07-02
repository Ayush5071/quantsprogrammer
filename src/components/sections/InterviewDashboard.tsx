'use client';

import React, { useRef, useState, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import Link from "next/link";
import useCurrentUser from "@/lib/useCurrentUser";
import { useState as useReactState } from "react";
import { useRouter } from "next/navigation";

// Responsive Navbar (replace Navbar import and usage)
function ResponsiveNavbar({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [open, setOpen] = useReactState(false);
  const handleLinkClick = (path: string) => {
    setOpen(false);
    onNavigate(path);
  };

  return (
    <div className="navbar-outer fixed top-0 left-0 z-50 w-full flex justify-center">
      <div className="flex items-center justify-between w-full max-w-4xl px-4 py-3">
        {/* No logo for interview navbar */}
        <div className="flex-1" />
        {/* Hamburger for mobile */}
        <button
          className="md:hidden text-white focus:outline-none bg-white/10 border border-white/20 rounded-xl p-2 shadow-lg hover:bg-white/20 transition-all"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen(!open)}
        >
          <span className="sr-only">Menu</span>
          <div className="relative w-8 h-8 flex flex-col justify-center items-center">
            <span className={`block h-1 w-7 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block h-1 w-7 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 my-1 transition-all duration-300 ${open ? 'opacity-0' : ''}`}></span>
            <span className={`block h-1 w-7 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 ${open ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </div>
        </button>
        {/* Desktop nav */}
        <div className="hidden md:flex gap-6 items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-6 py-2 shadow-lg">
          <button onClick={() => handleLinkClick('/')} className="text-white hover:text-blue-400 font-medium text-lg transition-colors px-2 py-1 rounded-lg hover:bg-white/10">Home</button>
          <button onClick={() => handleLinkClick('/explore')} className="text-white hover:text-blue-400 font-medium text-lg transition-colors px-2 py-1 rounded-lg hover:bg-white/10">Explore</button>
          <button onClick={() => handleLinkClick('/blogs')} className="text-white hover:text-blue-400 font-medium text-lg transition-colors px-2 py-1 rounded-lg hover:bg-white/10">Blogs</button>
          <button onClick={() => handleLinkClick('/profile')} className="text-white hover:text-blue-400 font-medium text-lg transition-colors px-2 py-1 rounded-lg hover:bg-white/10">Profile</button>
          <button onClick={() => handleLinkClick('/top-interviews')} className="text-white hover:text-pink-400 font-bold text-lg transition-colors px-2 py-1 rounded-lg hover:bg-white/10">Top Interviews</button>
          <button onClick={() => handleLinkClick('/profile#interview-history')} className="ml-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg font-semibold shadow transition-all">Past Interviews</button>
          <button onClick={() => handleLinkClick('/top-interview-history')} className="ml-2 px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-700 text-white rounded-lg font-semibold shadow transition-all">Top Interview History</button>
        </div>
      </div>
      {/* Mobile nav overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm opacity-100 transition-opacity duration-300"
            onClick={() => setOpen(false)}
            aria-label="Close menu backdrop"
          />
          <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl mx-4 mt-4 p-8 flex flex-col gap-6 makeopaque opacity-100 transition-opacity duration-300">
            <button
              className="self-end text-white mb-4 focus:outline-none bg-white/10 border border-white/20 rounded-xl p-2 shadow-lg hover:bg-white/20 transition-all"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <button onClick={() => handleLinkClick('/')} className="text-white hover:text-blue-400 font-medium text-xl transition-colors px-2 py-2 rounded-lg hover:bg-white/10 text-left">Home</button>
            <button onClick={() => handleLinkClick('/explore')} className="text-white hover:text-blue-400 font-medium text-xl transition-colors px-2 py-2 rounded-lg hover:bg-white/10 text-left">Explore</button>
            <button onClick={() => handleLinkClick('/blogs')} className="text-white hover:text-blue-400 font-medium text-xl transition-colors px-2 py-2 rounded-lg hover:bg-white/10 text-left">Blogs</button>
            <button onClick={() => handleLinkClick('/profile')} className="text-white hover:text-blue-400 font-medium text-xl transition-colors px-2 py-2 rounded-lg hover:bg-white/10 text-left">Profile</button>
            <button onClick={() => handleLinkClick('/top-interviews')} className="text-white hover:text-pink-400 font-bold text-xl transition-colors px-2 py-2 rounded-lg hover:bg-white/10 text-left">Top Interviews</button>
            <button onClick={() => handleLinkClick('/profile#interview-history')} className="px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg font-semibold shadow transition-all text-center">Past Interviews</button>
            <button onClick={() => handleLinkClick('/top-interview-history')} className="px-4 py-3 bg-gradient-to-r from-pink-600 to-purple-700 text-white rounded-lg font-semibold shadow transition-all text-center">Top Interview History</button>
          </div>
        </div>
      )}

      </div>

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
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [textAnswer, setTextAnswer] = useState(''); // Manual typing answer
  const [inputMode, setInputMode] = useState<'speech' | 'text' | 'both'>('both'); // Allow both by default
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);

  // SpeechRecognition hook
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // Mobile/iOS STT support check
  const isIOS = typeof window !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = typeof window !== 'undefined' && /Android/.test(navigator.userAgent);

  // Text-to-Speech: Speak the question when it appears
  const speakQuestion = (text: string) => {
    if (ttsEnabled && typeof window !== "undefined" && 'speechSynthesis' in window) {
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
    setTextAnswer(''); // Clear both inputs initially
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
    setTextAnswer(''); // Clear both inputs
    // Start speech recognition automatically if supported
    if (browserSupportsSpeechRecognition && !isIOS) {
      SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
    }
  };

  // When question changes, speak it
  React.useEffect(() => {
    if (question) speakQuestion(question);
  }, [question]);

  // Submit answer (combines speech-to-text and typed text)
  const submitAnswer = async () => {
    // Combine transcript and typed text - both can be used simultaneously
    const combinedAnswer = [transcript, textAnswer].filter(Boolean).join(' ').trim();
    if (!combinedAnswer) return;
    
    setLoading(true);
    // Save answer
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestion - 1] = combinedAnswer;
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
      setTextAnswer(''); // Clear both speech and text for next question
      if (browserSupportsSpeechRecognition && !isIOS) {
        SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
      }
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
      setTextAnswer(''); // Clear both speech and text for next question
      if (browserSupportsSpeechRecognition && !isIOS) {
        SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
      }
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
    setTextAnswer(''); // Clear both speech and text
    SpeechRecognition.stopListening();
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
  };

  // Top Interviews Section banner state
  const [showTopBanner, setShowTopBanner] = useState(true);

  // Show warning for unsupported devices but still allow text input
  const speechNotSupported = !browserSupportsSpeechRecognition || isIOS;

  // Navigation protection logic
  useEffect(() => {
    // Prevent browser refresh/close during interview
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (step !== 0 && step !== 4) { // If interview is in progress
        e.preventDefault();
        e.returnValue = 'You have an interview in progress. Are you sure you want to leave? Your progress will be lost.';
        return 'You have an interview in progress. Are you sure you want to leave? Your progress will be lost.';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [step]);

  // Browser back button protection
  useEffect(() => {
    if (step !== 0 && step !== 4) {
      // Add a dummy history entry to catch back button
      const currentUrl = window.location.href;
      window.history.pushState(null, '', currentUrl);
      
      const handlePopState = (e: PopStateEvent) => {
        e.preventDefault();
        // Push state again to prevent actual navigation
        window.history.pushState(null, '', currentUrl);
        setShowWarningModal(true);
        setPendingNavigation(() => () => window.history.back());
      };

      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, [step]);

  // Custom navigation warning function
  const handleNavigation = (navigationFn: () => void) => {
    if (step !== 0 && step !== 4) { // If interview is in progress
      setShowWarningModal(true);
      setPendingNavigation(() => navigationFn);
    } else {
      navigationFn(); // Allow navigation if not in interview
    }
  };

  // Confirm navigation
  const confirmNavigation = () => {
    if (pendingNavigation) {
      // Stop speech recognition and clean up
      SpeechRecognition.stopListening();
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
      // Remove the history protection temporarily
      window.removeEventListener('popstate', () => {});
      pendingNavigation();
    }
    setShowWarningModal(false);
    setPendingNavigation(null);
  };

  // Cancel navigation
  const cancelNavigation = () => {
    setShowWarningModal(false);
    setPendingNavigation(null);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 md:pt-16 relative overflow-hidden bg-gradient-to-b from-black via-blue-900 to-black">
      {/* Enhanced Background Effects - matching ProfilePage */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_50%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(37,99,235,0.12),transparent_50%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(29,78,216,0.08),transparent_70%)] pointer-events-none"></div>
      {/* Animated Grid Pattern - matching ProfilePage */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)]"></div>
      </div>
      <div className="relative z-10 w-full max-w-7xl mx-auto py-8 md:py-16">
        <ResponsiveNavbar onNavigate={(path) => handleNavigation(() => router.push(path))} />
        {/* Trust Badge/Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full text-sm text-zinc-300 mb-4 hover:bg-white/15 transition-all duration-300">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span>AI Interview Practice</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-blue-300 mb-4 sm:mb-6 leading-[0.85] tracking-tight text-center">
            Master Technical
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600">
              Interviews
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-zinc-300 font-medium max-w-2xl md:max-w-4xl mx-auto mb-6 sm:mb-8 leading-relaxed px-4 text-center">
            Practice real interview questions, get instant feedback, and track your progress with our AI-powered system.
          </p>
        </div>
        {/* Main Dashboard Card */}
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl shadow-2xl p-6 md:p-12">
          {/* AI Side */}
          <div className="flex flex-col items-center md:items-start gap-6">
            <div className="w-full flex flex-col gap-2">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">AI Interviewer</h2>
              <div className={`bg-white/10 rounded-2xl p-4 border border-blue-800 text-zinc-200 min-h-[80px] shadow-inner flex items-center gap-3 ${isSpeaking ? 'ring-2 ring-blue-400 animate-pulse' : ''}`}> 
                {isSpeaking && <span className="w-3 h-3 rounded-full bg-blue-400 animate-pulse mr-2" />}
                {question ? (
                  <>
                    <span className="text-lg">{question}</span>
                    <button
                      className={`ml-2 p-1 rounded-full border transition-all ${ttsEnabled ? 'bg-blue-700 border-blue-400 text-white' : 'bg-white/10 border-zinc-500 text-zinc-300'}`}
                      onClick={() => setTtsEnabled(v => !v)}
                      title={ttsEnabled ? 'Disable Text-to-Speech' : 'Enable Text-to-Speech'}
                      type="button"
                      aria-label={ttsEnabled ? 'Disable Text-to-Speech' : 'Enable Text-to-Speech'}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5L6 9H2v6h4l5 4V5z" />
                        {ttsEnabled && <path strokeLinecap="round" strokeLinejoin="round" d="M19 12c0-1.657-1.343-3-3-3m0 6c1.657 0 3-1.343 3-3" />}
                      </svg>
                    </button>
                  </>
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
          <div className="flex flex-col items-center md:items-start gap-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Your Side</h2>
            <div className="w-full flex flex-col gap-2">
              <video ref={videoRef} autoPlay playsInline muted className="rounded-2xl w-full max-w-xs mb-2 border-2 border-blue-800 shadow-lg" />
              {/* Speech Recognition Info */}
              {step !== 0 && speechNotSupported && (
                <div className="mb-4 p-3 bg-blue-900/50 border border-blue-600 rounded-lg text-blue-200 text-sm">
                  ℹ️ Speech recognition is not supported on your device. You can still type your answers below.
                </div>
              )}
              {/* Both Input Methods Available Simultaneously */}
              {step !== 0 && (
                <div className="space-y-4">
                  {/* Speech-to-Text Display (always show if supported) */}
                  {!speechNotSupported && (
                    <div className="w-full">
                      <label className="block text-sm font-medium text-blue-300 mb-2">
                        🎤 Speech Recognition {listening ? '(Listening...)' : '(Ready)'}
                      </label>
                      <div className={`w-full p-3 bg-white/10 rounded border border-zinc-700 text-zinc-200 text-base min-h-[60px] ${listening ? 'ring-2 ring-blue-400' : ''}`}>
                        {transcript ? `Speech: ${transcript}` : "Say something and it will appear here..."}
                      </div>
                    </div>
                  )}
                  {/* Manual Text Input (always available) */}
                  <div className="w-full">
                    <label className="block text-sm font-medium text-blue-300 mb-2">
                      ⌨️ Type Your Answer
                    </label>
                    <textarea
                      value={textAnswer}
                      onChange={(e) => setTextAnswer(e.target.value)}
                      placeholder="Type your answer here..."
                      className="w-full p-3 bg-white/10 rounded border border-zinc-700 text-zinc-200 text-base min-h-[120px] resize-none"
                      rows={5}
                    />
                  </div>
                  {/* Combined Answer Preview */}
                  {(transcript || textAnswer) && (
                    <div className="w-full">
                      <label className="block text-sm font-medium text-green-300 mb-2">
                        📝 Final Answer Preview
                      </label>
                      <div className="w-full p-3 bg-green-900/20 border border-green-700 rounded text-green-200 text-base min-h-[60px]">
                        {[transcript, textAnswer].filter(Boolean).join(' ').trim() || "Your combined answer will appear here..."}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {/* Answer Controls */}
              {step !== 0 && (
                <div className="flex flex-wrap gap-3 mt-4">
                  <button 
                    className="py-2 px-4 rounded-lg bg-white/10 text-white font-bold hover:bg-blue-700 transition border border-blue-700" 
                    onClick={() => {
                      resetTranscript();
                      setTextAnswer('');
                    }}
                  >
                    Clear All
                  </button>
                  {!speechNotSupported && (
                    <button 
                      className="py-2 px-4 rounded-lg bg-white/10 text-white font-bold hover:bg-blue-700 transition border border-blue-700" 
                      onClick={resetTranscript}
                    >
                      Clear Speech
                    </button>
                  )}
                  <button 
                    className="py-2 px-4 rounded bg-zinc-700 text-white font-bold hover:bg-zinc-800 transition" 
                    onClick={() => setTextAnswer('')}
                  >
                    Clear Text
                  </button>
                  {currentQuestion < numQuestions ? (
                    <>
                      <button 
                        className="py-2 px-4 rounded bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 text-white font-bold hover:scale-105 transition" 
                        onClick={submitAnswer} 
                        disabled={(!transcript && !textAnswer) || loading}
                      >
                        Save & Next
                      </button>
                      <button className="py-2 px-4 rounded bg-yellow-700 text-white font-bold hover:bg-yellow-800 transition" onClick={skipQuestion}>Skip</button>
                    </>
                  ) : (
                    <button 
                      className="py-2 px-4 rounded bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 text-white font-bold hover:scale-105 transition" 
                      onClick={submitAnswer} 
                      disabled={(!transcript && !textAnswer) || loading}
                    >
                      Save Answer
                    </button>
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

      {/* Navigation Warning Modal */}
      {showWarningModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-xl shadow-2xl border-2 border-red-600 max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-red-400">Warning: Interview in Progress</h3>
            </div>
            
            <p className="text-zinc-200 mb-6 leading-relaxed">
              You have an active interview session. If you leave now, <strong className="text-red-300">your progress will be lost</strong> and you'll need to start over.
            </p>
            
            <div className="text-sm text-zinc-400 mb-6 bg-zinc-800 p-3 rounded-lg">
              <div className="flex justify-between">
                <span>Topic:</span>
                <span className="text-blue-300">{topic || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span>Progress:</span>
                <span className="text-blue-300">{currentQuestion} of {numQuestions} questions</span>
              </div>
              <div className="flex justify-between">
                <span>Answers saved:</span>
                <span className="text-blue-300">{answers.filter(a => a && a !== '(skipped)').length}</span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={cancelNavigation}
                className="flex-1 px-4 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold transition-all"
              >
                Stay & Continue
              </button>
              <button
                onClick={confirmNavigation}
                className="flex-1 px-4 py-3 bg-red-700 hover:bg-red-800 text-white rounded-lg font-semibold transition-all"
              >
                Leave Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
