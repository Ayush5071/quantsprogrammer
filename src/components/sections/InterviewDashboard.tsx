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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Back to Home */}
          <button 
            onClick={() => handleLinkClick('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline text-sm font-medium">Home</span>
          </button>

          {/* Logo/Title */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <span className="text-white font-semibold hidden sm:inline">AI Interview</span>
          </div>
          
          {/* Hamburger for mobile */}
          <button
            className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen(!open)}
          >
            <div className="relative w-6 h-5 flex flex-col justify-center items-center gap-1.5">
              <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ${open ? 'opacity-0' : ''}`}></span>
              <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ${open ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </div>
          </button>
          
          {/* Desktop nav */}
          <div className="hidden md:flex gap-1 items-center">
            <button onClick={() => handleLinkClick('/explore')} className="text-gray-400 hover:text-white text-sm font-medium transition-colors px-3 py-1.5 rounded-md hover:bg-white/5">Explore</button>
            <button onClick={() => handleLinkClick('/blogs')} className="text-gray-400 hover:text-white text-sm font-medium transition-colors px-3 py-1.5 rounded-md hover:bg-white/5">Blogs</button>
            <button onClick={() => handleLinkClick('/top-interviews')} className="text-gray-400 hover:text-white text-sm font-medium transition-colors px-3 py-1.5 rounded-md hover:bg-white/5">Coding Arena</button>
            <button onClick={() => handleLinkClick('/profile')} className="ml-1 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-sm font-medium transition-all">Profile</button>
          </div>
        </div>
      </div>
      
      {/* Mobile nav overlay */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden" style={{ top: '60px' }}>
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative bg-[#111118] border-b border-white/5 mx-4 mt-2 p-4 rounded-xl flex flex-col gap-1">
            <button onClick={() => handleLinkClick('/')} className="text-gray-300 hover:text-white text-left text-sm font-medium transition-colors px-3 py-2.5 rounded-lg hover:bg-white/5">Home</button>
            <button onClick={() => handleLinkClick('/explore')} className="text-gray-300 hover:text-white text-left text-sm font-medium transition-colors px-3 py-2.5 rounded-lg hover:bg-white/5">Explore</button>
            <button onClick={() => handleLinkClick('/blogs')} className="text-gray-300 hover:text-white text-left text-sm font-medium transition-colors px-3 py-2.5 rounded-lg hover:bg-white/5">Blogs</button>
            <button onClick={() => handleLinkClick('/top-interviews')} className="text-gray-300 hover:text-white text-left text-sm font-medium transition-colors px-3 py-2.5 rounded-lg hover:bg-white/5">Coding Arena</button>
            <button onClick={() => handleLinkClick('/profile')} className="text-gray-300 hover:text-white text-left text-sm font-medium transition-colors px-3 py-2.5 rounded-lg hover:bg-white/5">Profile</button>
            <div className="flex flex-col gap-2 mt-2 pt-3 border-t border-white/5">
              <button onClick={() => handleLinkClick('/top-interview-history')} className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-medium text-center transition-all">Interview History</button>
            </div>
          </div>
        </div>
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
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [textAnswer, setTextAnswer] = useState(''); // Manual typing answer
  const [inputMode, setInputMode] = useState<'speech' | 'text' | 'both'>('both'); // Allow both by default
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);
  
  // Subscription state
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [canInterview, setCanInterview] = useState(true);
  const [remainingFreeInterviews, setRemainingFreeInterviews] = useState<number | string>(1);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [subscriptionPrice, setSubscriptionPrice] = useState(10);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [checkingSubscription, setCheckingSubscription] = useState(true);

  // Check subscription status on mount
  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const [statusRes, pricingRes] = await Promise.all([
          fetch("/api/payment/mock-interviews"),
          fetch("/api/admin/pricing")
        ]);
        
        if (statusRes.ok) {
          const data = await statusRes.json();
          setIsSubscribed(data.subscribed || false);
          setCanInterview(data.canInterview !== false);
          setRemainingFreeInterviews(data.remainingFreeInterviews ?? 1);
        }
        
        if (pricingRes.ok) {
          const pricingData = await pricingRes.json();
          if (pricingData.pricing?.mockInterviews) {
            setSubscriptionPrice(pricingData.pricing.mockInterviews);
          }
        }
      } catch (error) {
        console.error("Error checking subscription:", error);
      } finally {
        setCheckingSubscription(false);
      }
    };
    
    checkSubscription();
  }, []);

  // Handle subscription purchase
  const handlePurchaseSubscription = async () => {
    setPurchaseLoading(true);
    try {
      const response = await fetch("/api/payment/mock-interviews/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        alert(data.error || "Failed to create payment request. Please try again.");
        setPurchaseLoading(false);
        return;
      }
      
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        alert("Payment URL not received. Please try again.");
        setPurchaseLoading(false);
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Failed to initiate payment. Please try again.");
      setPurchaseLoading(false);
    }
  };

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
  const isMobile = typeof window !== 'undefined' && /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Manual mic control for mobile
  const [micEnabled, setMicEnabled] = useState(false);
  
  // Start speech recognition with mobile-friendly settings
  const startSpeechRecognition = () => {
    if (!browserSupportsSpeechRecognition || isIOS) return;
    
    // On mobile, use non-continuous mode and restart manually
    if (isMobile) {
      SpeechRecognition.startListening({ 
        continuous: false, 
        language: 'en-US' 
      });
    } else {
      SpeechRecognition.startListening({ 
        continuous: true, 
        language: 'en-US' 
      });
    }
  };
  
  // Handle mobile mic button toggle
  const toggleMic = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      setMicEnabled(false);
    } else {
      startSpeechRecognition();
      setMicEnabled(true);
    }
  };
  
  // Auto-restart listening on mobile when speech ends (for continuous experience)
  useEffect(() => {
    if (isMobile && micEnabled && !listening && !isIOS && step !== 0 && step !== 3 && step !== 4) {
      // Small delay before restarting to prevent rapid restarts
      const timer = setTimeout(() => {
        if (micEnabled) {
          startSpeechRecognition();
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [listening, micEnabled, isMobile, isIOS, step]);

  // Text-to-Speech: Speak the question when it appears
  const speakQuestion = (text: string) => {
    if (ttsEnabled && typeof window !== "undefined" && 'speechSynthesis' in window) {
      // Cancel any ongoing speech first
      window.speechSynthesis.cancel();
      setIsSpeaking(true);
      const utter = new window.SpeechSynthesisUtterance(text);
      utter.lang = 'en-US';
      utter.onend = () => setIsSpeaking(false);
      utter.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utter);
    }
  };

  // Stop speech when TTS is disabled
  const stopSpeaking = () => {
    if (typeof window !== "undefined" && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Toggle TTS and stop current speech if disabling
  const toggleTTS = () => {
    if (ttsEnabled) {
      // Turning off - stop any current speech
      stopSpeaking();
    }
    setTtsEnabled(v => !v);
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
    
    // Check if user can start interview (subscription or daily limit)
    if (!canInterview && !isSubscribed) {
      setShowSubscriptionModal(true);
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
    
    // Handle limit reached error
    if (res.status === 403 && data.limitReached) {
      setLoading(false);
      setCanInterview(false);
      setShowSubscriptionModal(true);
      return;
    }
    
    if (!res.ok) {
      setLoading(false);
      alert(data.error || "Failed to start interview. Please try again.");
      return;
    }
    
    // Update remaining free interviews for UI
    if (!isSubscribed) {
      setRemainingFreeInterviews(0);
      setCanInterview(false);
    }
    
    setQuestions(data.questions || [data.question]);
    setQuestion((data.questions && data.questions[0]) || data.question);
    setStep(1);
    setLoading(false);
    resetTranscript();
    setTextAnswer(''); // Clear both inputs
    // Start speech recognition automatically if supported (desktop only - not mobile)
    if (browserSupportsSpeechRecognition && !isMobile) {
      startSpeechRecognition();
    }
  };

  // When question changes, speak it
  React.useEffect(() => {
    if (question) speakQuestion(question);
  }, [question]);

  // Submit answer (combines speech-to-text and typed text)
  const submitAnswer = async () => {
    // On mobile, only use typed text; on desktop, combine transcript and typed text
    const combinedAnswer = isMobile 
      ? textAnswer.trim() 
      : [transcript, textAnswer].filter(Boolean).join(' ').trim();
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
      // Only start speech recognition on desktop
      if (browserSupportsSpeechRecognition && !isMobile) {
        startSpeechRecognition();
      }
    } else {
      // On last question, after saving answer, show submit button
      setStep(3); // Interview finished, show submit button
      SpeechRecognition.stopListening();
      setMicEnabled(false);
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
        if (isMobile) {
          if (micEnabled) startSpeechRecognition();
        } else {
          startSpeechRecognition();
        }
      }
    } else {
      setStep(3); // Interview finished
      SpeechRecognition.stopListening();
      setMicEnabled(false);
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
    setMicEnabled(false); // Reset mic state
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
    <div className="min-h-screen w-full flex flex-col items-center px-4 sm:px-6 md:px-8 pt-6 md:pt-12 relative bg-[#0a0a0f]">
      {/* Subtle background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(99,102,241,0.06),transparent_50%)]" />
      </div>
      
      {/* Subscription Modal */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-[#111118] to-[#1a1a2e] border border-white/10 rounded-2xl p-6 md:p-8 max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">
                Daily Limit Reached
              </h2>
              <p className="text-gray-400 text-sm mb-6">
                Free users can do 1 mock interview per day. Upgrade to premium for unlimited interviews!
              </p>
              
              <div className="bg-white/5 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-400">Unlimited Interviews</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 line-through text-sm">₹99</span>
                    <span className="text-2xl font-bold text-white">₹{subscriptionPrice}</span>
                  </div>
                </div>
                <div className="space-y-2 text-left">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Unlimited mock interviews daily</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Detailed AI feedback</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Lifetime access - one-time payment</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <button
                  onClick={handlePurchaseSubscription}
                  disabled={purchaseLoading}
                  className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-xl hover:from-yellow-400 hover:to-orange-400 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {purchaseLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                      Get Premium - ₹{subscriptionPrice}
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowSubscriptionModal(false)}
                  className="text-gray-400 hover:text-white text-sm transition"
                >
                  Maybe later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="relative z-10 w-full max-w-6xl mx-auto py-6 md:py-12">
        <ResponsiveNavbar onNavigate={(path) => handleNavigation(() => router.push(path))} />
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-sm text-blue-400 mb-4">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span>AI Interview Practice</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3">
            Master Technical
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
              Interviews
            </span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            Practice real interview questions, get instant feedback, and track your progress with our AI-powered system.
          </p>
          
          {/* Subscription Status Banner */}
          {!checkingSubscription && step === 0 && (
            <div className="mt-4">
              {isSubscribed ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-sm text-green-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Premium Active - Unlimited Interviews
                </div>
              ) : (
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-sm">
                  <span className="text-yellow-400">
                    {canInterview 
                      ? `Free: ${remainingFreeInterviews} interview${remainingFreeInterviews === 1 ? '' : 's'} left today`
                      : "Daily limit reached"
                    }
                  </span>
                  <button
                    onClick={() => setShowSubscriptionModal(true)}
                    className="text-xs px-3 py-1 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-full transition"
                  >
                    Upgrade ₹{subscriptionPrice}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        {/* Main Dashboard Card */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-10 bg-[#111118] border border-white/5 rounded-xl p-5 md:p-8">
          {/* AI Side */}
          <div className="flex flex-col gap-4">
            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              AI Interviewer
            </h2>
            <div className={`bg-[#0a0a0f] rounded-lg p-4 border border-white/5 text-gray-300 min-h-[80px] flex items-center gap-3 ${isSpeaking ? 'ring-2 ring-blue-500/50' : ''}`}> 
              {isSpeaking && <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse flex-shrink-0" />}
              {question ? (
                <div className="flex items-center gap-3 w-full">
                  <span className="text-sm sm:text-base flex-1">{question}</span>
                  <button
                    className={`p-2 rounded-lg border transition-all flex-shrink-0 ${ttsEnabled ? 'bg-blue-500/20 border-blue-500/30 text-blue-400' : 'bg-white/5 border-white/10 text-gray-500'}`}
                    onClick={toggleTTS}
                    title={ttsEnabled ? 'Disable Text-to-Speech' : 'Enable Text-to-Speech'}
                    type="button"
                    aria-label={ttsEnabled ? 'Disable Text-to-Speech' : 'Enable Text-to-Speech'}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5L6 9H2v6h4l5 4V5z" />
                      {ttsEnabled && <path strokeLinecap="round" strokeLinejoin="round" d="M19 12c0-1.657-1.343-3-3-3m0 6c1.657 0 3-1.343 3-3" />}
                    </svg>
                  </button>
                </div>
              ) : (
                <span className="text-gray-500 text-sm">AI will ask you questions here...</span>
              )}
            </div>
            {aiThinking && (
              <div className="flex items-center gap-2 text-blue-400 text-sm">
                <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                AI is thinking...
              </div>
            )}
          </div>
          
          {/* User Side */}
          <div className="flex flex-col gap-4">
            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              Your Side
            </h2>
            
            <video ref={videoRef} autoPlay playsInline muted className="rounded-lg w-full max-w-[280px] border border-white/10" />
            
            {/* Speech Recognition Info */}
            {step !== 0 && speechNotSupported && (
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 text-xs">
                ℹ️ Speech recognition is not supported on your device. You can still type your answers below.
              </div>
            )}
            
            {/* Mobile Voice Input Warning */}
            {step !== 0 && isMobile && (
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-400 text-xs">
                ⚠️ Voice input is not supported on mobile devices. Please use a PC/laptop for voice features. You can type your answer below.
              </div>
            )}
            
            {/* Both Input Methods Available Simultaneously */}
            {step !== 0 && (
              <div className="space-y-3">
                {/* Speech-to-Text Display - Only show on desktop */}
                {!speechNotSupported && !isMobile && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-medium text-gray-400">
                        🎤 Speech Recognition {listening ? '(Listening...)' : '(Ready)'}
                      </label>
                    </div>
                    <div className={`w-full p-3 bg-[#0a0a0f] rounded-lg border text-gray-300 text-sm min-h-[50px] ${listening ? 'border-blue-500/50 ring-1 ring-blue-500/30' : 'border-white/5'}`}>
                      {transcript ? transcript : <span className="text-gray-600">Say something and it will appear here...</span>}
                    </div>
                  </div>
                )}
                
                {/* Manual Text Input */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">
                    ⌨️ Type Your Answer {isMobile && "(Recommended on mobile)"}
                  </label>
                  <textarea
                    value={textAnswer}
                    onChange={(e) => setTextAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full p-3 bg-[#0a0a0f] rounded-lg border border-white/5 text-gray-200 text-sm min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder-gray-600"
                    rows={4}
                  />
                </div>
                
                {/* Combined Answer Preview - only on desktop when using both */}
                {!isMobile && (transcript || textAnswer) && (
                  <div>
                    <label className="block text-xs font-medium text-green-400 mb-1.5">
                      📝 Final Answer Preview
                    </label>
                    <div className="w-full p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-300 text-sm min-h-[50px]">
                      {[transcript, textAnswer].filter(Boolean).join(' ').trim() || "Your combined answer will appear here..."}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Answer Controls */}
            {step !== 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                <button 
                  className="py-2 px-3 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-sm font-medium hover:bg-white/10 transition-all" 
                  onClick={() => {
                    resetTranscript();
                    setTextAnswer('');
                  }}
                >
                  Clear All
                </button>
                {!speechNotSupported && (
                  <button 
                    className="py-2 px-3 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-sm font-medium hover:bg-white/10 transition-all" 
                    onClick={resetTranscript}
                  >
                    Clear Speech
                  </button>
                )}
                <button 
                  className="py-2 px-3 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-sm font-medium hover:bg-white/10 transition-all" 
                  onClick={() => setTextAnswer('')}
                >
                  Clear Text
                </button>
                {currentQuestion < numQuestions ? (
                  <>
                    <button 
                      className="py-2 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed" 
                      onClick={submitAnswer} 
                      disabled={(!transcript && !textAnswer) || loading}
                    >
                      Save & Next
                    </button>
                    <button 
                      className="py-2 px-3 rounded-lg bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-sm font-medium hover:bg-yellow-500/30 transition-all" 
                      onClick={skipQuestion}
                    >
                      Skip
                    </button>
                  </>
                ) : (
                  <button 
                    className="py-2 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed" 
                    onClick={submitAnswer} 
                    disabled={(!transcript && !textAnswer) || loading}
                  >
                    Save Answer
                  </button>
                )}
              </div>
            )}
            
            {/* Controls for starting/ending interview */}
            {step === 0 && (
              <div className="w-full flex flex-col gap-3 mt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input 
                    value={topic} 
                    onChange={e => setTopic(e.target.value)} 
                    placeholder="Interview Topic (e.g. React, DSA)" 
                    className="w-full px-4 py-3 rounded-lg bg-[#0a0a0f] border border-white/5 text-gray-200 text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all" 
                  />
                  <input 
                    value={experience} 
                    onChange={e => setExperience(e.target.value)} 
                    placeholder="Experience (e.g. 2 years)" 
                    className="w-full px-4 py-3 rounded-lg bg-[#0a0a0f] border border-white/5 text-gray-200 text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all" 
                  />
                </div>
                <input 
                  value={skills} 
                  onChange={e => setSkills(e.target.value)} 
                  placeholder="Your Skills (comma separated)" 
                  className="w-full px-4 py-3 rounded-lg bg-[#0a0a0f] border border-white/5 text-gray-200 text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all" 
                />
                
                {/* Number of questions slider */}
                <div className="flex flex-col sm:flex-row gap-3 items-center bg-[#0a0a0f] border border-white/5 rounded-lg p-3">
                  <label htmlFor="numQuestionsSlider" className="text-gray-400 text-sm whitespace-nowrap">Questions:</label>
                  <input
                    id="numQuestionsSlider"
                    type="range"
                    min={1}
                    max={10}
                    value={numQuestions}
                    onChange={e => setNumQuestions(Number(e.target.value))}
                    className="flex-1 accent-blue-500"
                    aria-label="Number of Questions"
                    title="Number of Questions"
                  />
                  <span className="text-blue-400 font-bold text-lg min-w-[2rem] text-center">{numQuestions}</span>
                </div>
                
                <div className="flex gap-3 mt-1 flex-wrap">
                  <button 
                    className="flex-1 min-w-[140px] px-5 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed" 
                    onClick={startCamera} 
                    disabled={cameraReady}
                  >
                    {cameraReady ? '✓ Camera Ready' : 'Open Camera & Mic'}
                  </button>
                  <button 
                    className="flex-1 min-w-[140px] px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed" 
                    onClick={startInterview} 
                    disabled={!cameraReady || !topic || !experience || !skills || loading}
                  >
                    Start Interview
                  </button>
                </div>
              </div>
            )}
            
            {/* Final feedback and submit all answers */}
            {(step === 3) && (
              <button 
                className="mt-4 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed" 
                onClick={submitAllAnswers} 
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Interview & View Feedback'}
              </button>
            )}
            {step === 4 && (
              <button 
                className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-sm font-medium transition-all" 
                onClick={reset}
              >
                Restart Interview
              </button>
            )}
          </div>
        </div>

      {/* Navigation Warning Modal */}
      {showWarningModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111118] border border-white/10 rounded-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">Interview in Progress</h3>
            </div>
            
            <p className="text-gray-400 text-sm mb-5">
              You have an active interview session. If you leave now, <span className="text-red-400 font-medium">your progress will be lost</span> and you'll need to start over.
            </p>
            
            <div className="text-xs text-gray-500 mb-5 bg-[#0a0a0f] border border-white/5 p-3 rounded-lg space-y-1">
              <div className="flex justify-between">
                <span>Topic:</span>
                <span className="text-blue-400">{topic || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span>Progress:</span>
                <span className="text-blue-400">{currentQuestion} of {numQuestions} questions</span>
              </div>
              <div className="flex justify-between">
                <span>Answers saved:</span>
                <span className="text-blue-400">{answers.filter(a => a && a !== '(skipped)').length}</span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={cancelNavigation}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-sm font-medium transition-all"
              >
                Stay & Continue
              </button>
              <button
                onClick={confirmNavigation}
                className="flex-1 px-4 py-2.5 bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-medium transition-all"
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
