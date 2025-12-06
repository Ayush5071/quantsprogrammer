"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import useCurrentUser from "@/lib/useCurrentUser";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { ArrowLeft, Camera, Mic, MicOff, Volume2, VolumeX, AlertTriangle, CheckCircle, X, ChevronRight, SkipForward, Send, Trash2, Menu } from "lucide-react";

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
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // Navigation protection logic
  useEffect(() => {
    // Prevent browser refresh/close during interview
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (step === 1) { // If interview is in progress
        e.preventDefault();
        e.returnValue = 'You have a top interview in progress. Are you sure you want to leave? Your progress will be lost.';
        return 'You have a top interview in progress. Are you sure you want to leave? Your progress will be lost.';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [step]);

  // Browser back button protection
  useEffect(() => {
    if (step === 1) {
      // Add a dummy history entry to catch back button
      const currentUrl = window.location.href;
      window.history.pushState(null, '', currentUrl);
      
      const handlePopState = (e: PopStateEvent) => {
        e.preventDefault();
        // Push state again to prevent actual navigation
        window.history.pushState(null, '', currentUrl);
        setShowWarningModal(true);
        // Set pending navigation to go back to the top interviews page
        setPendingNavigation(() => () => router.push('/top-interviews'));
      };

      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, [step, router]);

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

  // Custom navigation warning function
  const handleNavigation = (navigationFn: () => void) => {
    if (step === 1) { // If interview is in progress
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
      stopTTS();
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
      
      // Clear the step to allow navigation without triggering protection
      setStep(0);
      
      // Execute the pending navigation
      setTimeout(() => {
        pendingNavigation();
      }, 100);
    }
    setShowWarningModal(false);
    setPendingNavigation(null);
  };

  // Cancel navigation
  const cancelNavigation = () => {
    setShowWarningModal(false);
    setPendingNavigation(null);
  };

  // --- New: Show details first, then start interview ---
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-400 text-sm">Loading interview...</span>
        </div>
      </div>
    );
  }
  
  if (!interview) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Interview Not Found</h2>
          <p className="text-gray-500 mb-4">The interview you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/top-interviews')}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium"
          >
            Back to Interviews
          </button>
        </div>
      </div>
    );
  }

  // Details/landing view
  if (step === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0f]">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => router.push('/top-interviews')}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Back to Interviews</span>
              </button>
              
              <h1 className="text-lg font-semibold text-white truncate max-w-[200px] sm:max-w-none">
                Interview Details
              </h1>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-400 hover:text-white"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              {/* Desktop nav */}
              <nav className="hidden md:flex items-center gap-4">
                <button
                  onClick={() => router.push('/top-interviews')}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  All Interviews
                </button>
                <button
                  onClick={() => router.push('/top-interview-history')}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  My History
                </button>
              </nav>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
              <nav className="md:hidden pt-4 pb-2 flex flex-col gap-2 border-t border-white/5 mt-4">
                <button
                  onClick={() => { router.push('/top-interviews'); setMobileMenuOpen(false); }}
                  className="text-left py-2 text-gray-400 hover:text-white transition-colors"
                >
                  All Interviews
                </button>
                <button
                  onClick={() => { router.push('/top-interview-history'); setMobileMenuOpen(false); }}
                  className="text-left py-2 text-gray-400 hover:text-white transition-colors"
                >
                  My History
                </button>
              </nav>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="max-w-3xl mx-auto px-4 py-8">
          <div className="bg-[#111118] border border-white/5 rounded-2xl p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">{interview.title}</h1>
            <p className="text-gray-400 mb-6">{interview.description}</p>

            {/* Interview metadata */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {interview.field && (
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <span className="text-xs text-gray-500 block mb-1">Field</span>
                  <span className="text-white font-medium">{interview.field}</span>
                </div>
              )}
              {interview.level && (
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <span className="text-xs text-gray-500 block mb-1">Level</span>
                  <span className="text-white font-medium">{interview.level}</span>
                </div>
              )}
              {interview.company && (
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <span className="text-xs text-gray-500 block mb-1">Company</span>
                  <span className="text-white font-medium">{interview.company}</span>
                </div>
              )}
              {interview.questions && (
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <span className="text-xs text-gray-500 block mb-1">Questions</span>
                  <span className="text-white font-medium">{interview.questions.length}</span>
                </div>
              )}
            </div>

            {/* Topics & Skills */}
            {interview.topics && (
              <div className="mb-4">
                <span className="text-xs text-gray-500 block mb-2">Topics</span>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(interview.topics) ? interview.topics : [interview.topics]).map((topic: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-blue-500/10 text-blue-400 text-sm rounded-full border border-blue-500/20">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {interview.skills && (
              <div className="mb-6">
                <span className="text-xs text-gray-500 block mb-2">Skills</span>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(interview.skills) ? interview.skills : [interview.skills]).map((skill: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-purple-500/10 text-purple-400 text-sm rounded-full border border-purple-500/20">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Requirements notice */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-amber-400 font-medium mb-1">Requirements</h4>
                  <p className="text-amber-300/80 text-sm">
                    This interview requires camera and microphone access. Please ensure you're in a quiet environment with good lighting.
                  </p>
                </div>
              </div>
            </div>

            {/* Start button */}
            <button
              onClick={() => setStep(1)}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-lg font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              Start Interview
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </main>
      </div>
    );
  }

  // --- Existing interview flow, but update navigation/buttons ---
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => handleNavigation(() => router.push('/top-interviews'))}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Exit</span>
            </button>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Question</span>
              <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-sm font-medium rounded">
                {currentQuestion + 1} / {interview.questions.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* TTS Toggle */}
              <button
                onClick={() => setTtsEnabled(v => !v)}
                className={`p-2 rounded-lg transition-all ${ttsEnabled ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-gray-500'}`}
                title={ttsEnabled ? 'Disable Text-to-Speech' : 'Enable Text-to-Speech'}
              >
                {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Modal for back warning */}
      {showBackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#111118] rounded-2xl border border-white/10 max-w-md w-full p-6">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              onClick={() => setShowBackModal(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">End Interview?</h3>
            </div>
            <p className="text-gray-400 mb-6">
              If you exit now, your interview will be terminated and all unanswered questions will be marked as unattempted.
            </p>
            <div className="flex gap-3">
              <button
                className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-medium transition-all"
                onClick={() => setShowBackModal(false)}
              >
                Continue Interview
              </button>
              <button
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all"
                onClick={terminateInterview}
              >
                End & Exit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Camera preview */}
          <div className="bg-[#111118] border border-white/5 rounded-2xl p-5 flex flex-col">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Camera className="w-5 h-5 text-blue-400" />
              Live Camera Preview
            </h2>
            
            <div className="relative flex-1 min-h-[200px] sm:min-h-[280px] bg-black/50 rounded-xl overflow-hidden mb-4">
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                muted
                playsInline
              />
              {!cameraReady && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                  <Camera className="w-12 h-12 mb-2 opacity-50" />
                  <span className="text-sm">Camera not started</span>
                </div>
              )}
              {cameraReady && (
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <span className="flex items-center gap-1.5 px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    Live
                  </span>
                </div>
              )}
            </div>
            
            <button
              onClick={startCamera}
              disabled={cameraReady}
              className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                cameraReady 
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white'
              }`}
            >
              {cameraReady ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Camera Active
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4" />
                  Enable Camera & Mic
                </>
              )}
            </button>
            
            {!browserSupportsSpeechRecognition && (
              <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm">Speech recognition is not supported in this browser. Please use Chrome or Edge.</p>
              </div>
            )}
          </div>

          {/* Right: Interview flow */}
          <div className="bg-[#111118] border border-white/5 rounded-2xl p-5 flex flex-col">
            <h2 className="text-sm text-gray-500 mb-1">{interview.title}</h2>
            
            {step === 1 && (
              <div className="flex flex-col flex-1">
                {/* Question */}
                <div className="bg-white/5 rounded-xl p-4 mb-4 border border-white/5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs font-medium rounded">
                      Question {currentQuestion + 1}
                    </span>
                    {isSpeaking && (
                      <span className="flex items-center gap-1 text-xs text-purple-400">
                        <Volume2 className="w-3 h-3 animate-pulse" />
                        Speaking...
                      </span>
                    )}
                  </div>
                  <p className="text-white text-lg">{interview.questions[currentQuestion]}</p>
                </div>

                {/* Answer textarea */}
                <div className="flex-1 mb-4">
                  <label className="text-sm text-gray-500 mb-2 block">Your Answer</label>
                  <textarea
                    className="w-full h-32 sm:h-40 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:border-blue-500/50 focus:outline-none resize-none"
                    value={answers[currentQuestion] || transcript}
                    onChange={e => {
                      const updated = [...answers];
                      updated[currentQuestion] = e.target.value;
                      setAnswers(updated);
                    }}
                    placeholder="Type or speak your answer..."
                  />
                </div>

                {/* Speech-to-text indicator */}
                <div className="flex items-center gap-2 mb-4 p-3 bg-white/5 rounded-lg border border-white/5">
                  <div className={`w-3 h-3 rounded-full ${listening ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
                  <span className="text-sm text-gray-400">
                    {listening ? 'Listening...' : 'Speech recognition paused'}
                  </span>
                  {transcript && (
                    <span className="ml-auto text-xs text-gray-500 truncate max-w-[150px]">
                      "{transcript.slice(-50)}..."
                    </span>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleSaveAnswer}
                    disabled={submitting || !(answers[currentQuestion] || transcript)}
                    className="flex-1 min-w-[100px] px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={handleClear}
                    disabled={submitting || !(answers[currentQuestion] || transcript)}
                    className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-gray-400 hover:text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear
                  </button>
                  {currentQuestion < interview.questions.length - 1 ? (
                    <button
                      onClick={handleNext}
                      disabled={submitting}
                      className="px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                    >
                      <SkipForward className="w-4 h-4" />
                      Skip
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="flex-1 min-w-[120px] px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:opacity-50 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Submit Interview
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col flex-1">
                <div className="text-center py-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Interview Complete!</h3>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full mb-6">
                    <span className="text-blue-400 text-lg font-semibold">Score: {score}/100</span>
                  </div>
                </div>

                <div className="flex-1 bg-white/5 rounded-xl p-4 border border-white/5 mb-4 overflow-auto max-h-[300px]">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Feedback</h4>
                  <p className="text-gray-300 whitespace-pre-line text-sm">{feedback}</p>
                </div>

                <button
                  onClick={() => router.push("/top-interviews")}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Top Interviews
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Navigation Warning Modal */}
      {showWarningModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111118] rounded-2xl border border-white/10 max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Interview in Progress</h3>
            </div>
            
            <p className="text-gray-400 mb-4">
              If you leave now, <span className="text-red-400">your progress will be lost</span> and you'll need to start over.
            </p>
            
            <div className="bg-white/5 rounded-lg p-3 mb-6 text-sm">
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Interview:</span>
                <span className="text-white">{interview?.title || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Progress:</span>
                <span className="text-white">{currentQuestion + 1} of {interview?.questions?.length || 0} questions</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Answers saved:</span>
                <span className="text-white">{answers.filter(a => a && a.trim() !== '').length}</span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={cancelNavigation}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-medium transition-all"
              >
                Stay & Continue
              </button>
              <button
                onClick={confirmNavigation}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all"
              >
                Leave Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
