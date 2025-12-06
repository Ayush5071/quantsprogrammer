"use client";
import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Award,
  ChevronLeft,
  ChevronRight,
  Send,
  Loader2,
  HelpCircle,
  FileText,
  User,
  BookOpen,
  Target,
  Shield,
  Sparkles,
  X,
} from "lucide-react";

interface MCQQuestion {
  question: string;
  options: string[];
  marks: number;
}

interface ShortAnswerQuestion {
  question: string;
  marks: number;
}

interface Test {
  _id: string;
  roadmapId: string;
  roadmapTitle: string;
  duration: number;
  totalMarks: number;
  passingPercentage: number;
  mcqQuestions: MCQQuestion[];
  shortAnswerQuestions: ShortAnswerQuestion[];
}

interface Result {
  mcqScore: number;
  shortAnswerScore: number;
  totalScore: number;
  percentage: number;
  passed: boolean;
  mcqResults: any[];
  shortAnswerScores: any[];
}

// Loading component for Suspense fallback
function TestLoading() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Loading test...</p>
      </div>
    </div>
  );
}

// Main test content component
function RoadmapTestContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roadmapId = searchParams.get("roadmapId");

  const [loading, setLoading] = useState(true);
  const [test, setTest] = useState<Test | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [certification, setCertification] = useState<any>(null);

  // Test state
  const [currentSection, setCurrentSection] = useState<"mcq" | "short">("mcq");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [mcqAnswers, setMcqAnswers] = useState<(number | null)[]>([]);
  const [shortAnswers, setShortAnswers] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds

  // Eligibility check
  const [eligibility, setEligibility] = useState<any>(null);
  
  // Profile popup state
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [profileMissing, setProfileMissing] = useState<string[]>([]);

  // Check eligibility
  useEffect(() => {
    if (!roadmapId) {
      setError("No roadmap specified");
      setLoading(false);
      return;
    }

    const checkEligibility = async () => {
      try {
        const res = await fetch(`/api/roadmap-test?roadmapId=${roadmapId}`);
        const data = await res.json();
        setEligibility(data);

        if (data.hasAttempted && !data.canRetry) {
          setError("You have already taken this test");
          setResult({
            mcqScore: data.attempt?.mcqScore || 0,
            shortAnswerScore: data.attempt?.shortAnswerScore || 0,
            totalScore: data.attempt?.totalScore || 0,
            percentage: data.attempt?.percentage || 0,
            passed: data.attempt?.passed || false,
            mcqResults: [],
            shortAnswerScores: data.attempt?.shortAnswerScores || [],
          });
        } else if (!data.canTakeTest && !data.hasAttempted) {
          if (!data.hasFullDetails) {
            // Show popup instead of error
            const missing: string[] = [];
            if (!data.userDetails?.fullName) missing.push("Full Name");
            if (!data.userDetails?.age) missing.push("Age");
            if (!data.userDetails?.gender) missing.push("Gender");
            setProfileMissing(missing);
            setShowProfilePopup(true);
          } else if (data.progressPercent < 100) {
            setError(`You must complete the roadmap 100% before taking the test. Current progress: ${data.progressPercent}%`);
          }
        }
      } catch (err) {
        setError("Failed to check test eligibility");
      }
      setLoading(false);
    };

    checkEligibility();
  }, [roadmapId]);

  // Fetch test
  const fetchTest = async () => {
    if (!roadmapId) return;

    setLoading(true);
    try {
      const res = await fetch("/api/roadmap-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roadmapId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch test");
      }

      setTest(data.test);
      setMcqAnswers(new Array(data.test.mcqQuestions.length).fill(null));
      setShortAnswers(new Array(data.test.shortAnswerQuestions.length).fill(""));
      setTimeLeft(data.test.duration * 60);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  // Timer
  useEffect(() => {
    if (!started || result) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [started, result]);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle MCQ answer
  const handleMcqAnswer = (optionIndex: number) => {
    const newAnswers = [...mcqAnswers];
    newAnswers[currentQuestion] = optionIndex;
    setMcqAnswers(newAnswers);
  };

  // Handle short answer
  const handleShortAnswer = (answer: string) => {
    const newAnswers = [...shortAnswers];
    newAnswers[currentQuestion] = answer;
    setShortAnswers(newAnswers);
  };

  // Navigation
  const goToQuestion = (index: number) => {
    setCurrentQuestion(index);
  };

  const nextQuestion = () => {
    if (currentSection === "mcq") {
      if (currentQuestion < (test?.mcqQuestions.length || 0) - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setCurrentSection("short");
        setCurrentQuestion(0);
      }
    } else {
      if (currentQuestion < (test?.shortAnswerQuestions.length || 0) - 1) {
        setCurrentQuestion(currentQuestion + 1);
      }
    }
  };

  const prevQuestion = () => {
    if (currentSection === "short" && currentQuestion === 0) {
      setCurrentSection("mcq");
      setCurrentQuestion((test?.mcqQuestions.length || 1) - 1);
    } else if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Submit test
  const handleSubmit = async () => {
    if (!test || submitting) return;

    const unansweredMcq = mcqAnswers.filter((a) => a === null).length;
    const unansweredShort = shortAnswers.filter((a) => !a.trim()).length;

    if (unansweredMcq > 0 || unansweredShort > 0) {
      const confirm = window.confirm(
        `You have ${unansweredMcq} unanswered MCQs and ${unansweredShort} unanswered short questions. Submit anyway?`
      );
      if (!confirm) return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/roadmap-test/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testId: test._id,
          roadmapId: test.roadmapId,
          mcqAnswers,
          shortAnswers,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit test");
      }

      setResult(data.result);
      setCertification(data.certification);
      toast.success(data.message);
    } catch (err: any) {
      toast.error(err.message);
    }
    setSubmitting(false);
  };

  // Start test
  const handleStart = async () => {
    await fetchTest();
    setStarted(true);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !result) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 bg-[#111118] border border-white/5 rounded-2xl text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-red-500/10 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">{error}</h2>
          <p className="text-gray-400 mb-6">
            {eligibility?.progressPercent < 100
              ? "Complete all topics in the roadmap to unlock the test."
              : eligibility?.hasAttempted
              ? "Contact admin if you need to retake the test."
              : "Please ensure all requirements are met."}
          </p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-500 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Result state
  if (result) {
    return (
      <div className="min-h-screen bg-[#0a0a0f]">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px]" />
        </div>

        <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => router.push("/profile")}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Profile</span>
            </button>
            <h1 className="text-white font-semibold">Test Results</h1>
            <div className="w-20" />
          </div>
        </header>

        <main className="relative z-10 max-w-4xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 bg-[#111118] border border-white/5 rounded-2xl text-center"
          >
            <div
              className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
                result.passed ? "bg-green-500/10" : "bg-red-500/10"
              }`}
            >
              {result.passed ? (
                <CheckCircle className="w-10 h-10 text-green-400" />
              ) : (
                <XCircle className="w-10 h-10 text-red-400" />
              )}
            </div>

            <h2 className="text-3xl font-bold text-white mb-2">
              {result.passed ? "Congratulations!" : "Keep Trying!"}
            </h2>
            <p className="text-gray-400 mb-8">
              {result.passed
                ? "You have successfully passed the certification test!"
                : "You need at least 60% to pass. Contact admin if you need to retry."}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="p-4 bg-white/5 rounded-xl">
                <div className="text-3xl font-bold text-white">{result.percentage}%</div>
                <div className="text-sm text-gray-500">Total Score</div>
              </div>
              <div className="p-4 bg-white/5 rounded-xl">
                <div className="text-3xl font-bold text-white">{result.totalScore}</div>
                <div className="text-sm text-gray-500">Out of 100</div>
              </div>
              <div className="p-4 bg-white/5 rounded-xl">
                <div className="text-3xl font-bold text-blue-400">{result.mcqScore}</div>
                <div className="text-sm text-gray-500">MCQ (60)</div>
              </div>
              <div className="p-4 bg-white/5 rounded-xl">
                <div className="text-3xl font-bold text-purple-400">{result.shortAnswerScore}</div>
                <div className="text-sm text-gray-500">Short (40)</div>
              </div>
            </div>

            {certification && (
              <div className="p-6 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl mb-8">
                <Award className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Certificate Earned!</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Certificate ID: <span className="text-yellow-400 font-mono">{certification.certificateId}</span>
                </p>
                <button
                  onClick={() => router.push("/profile")}
                  className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-medium rounded-xl hover:from-yellow-500 hover:to-orange-500 transition-all"
                >
                  View in Profile
                </button>
              </div>
            )}

            <button
              onClick={() => router.push(`/explore/roadmap/${roadmapId}`)}
              className="px-6 py-3 bg-white/5 text-white font-medium rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
            >
              Back to Roadmap
            </button>
          </motion.div>
        </main>
      </div>
    );
  }

  // Pre-test instructions
  if (!started) {
    return (
      <div className="min-h-screen bg-[#0a0a0f]">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px]" />
        </div>

        {/* Profile Update Popup */}
        <AnimatePresence>
          {showProfilePopup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative max-w-md w-full p-8 bg-[#111118] border border-white/10 rounded-2xl"
              >
                <button
                  onClick={() => setShowProfilePopup(false)}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-amber-500/10 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-amber-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Complete Your Profile</h3>
                  <p className="text-gray-400 text-sm">
                    Please update the following details in your profile to take the certification test:
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  {profileMissing.map((field, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl"
                    >
                      <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                      <span className="text-amber-200">{field} is required</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowProfilePopup(false)}
                    className="flex-1 py-3 bg-white/5 text-gray-300 font-medium rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => router.push("/profile")}
                    className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all"
                  >
                    Update Profile
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <h1 className="text-white font-semibold">Certification Test</h1>
            <div className="w-16" />
          </div>
        </header>

        <main className="relative z-10 max-w-3xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Header Card */}
            <div className="p-8 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border border-blue-500/20 rounded-2xl text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Award className="w-10 h-10 text-blue-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {eligibility?.roadmapTitle || "Certification Test"}
              </h2>
              <p className="text-gray-400 max-w-lg mx-auto">
                Complete this test to earn your certificate. Read all instructions carefully before starting.
              </p>
            </div>

            {/* Test Overview */}
            <div className="p-6 bg-[#111118] border border-white/5 rounded-2xl">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-400" />
                Test Overview
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-white/5 rounded-xl text-center">
                  <Clock className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">30</div>
                  <div className="text-xs text-gray-500">Minutes</div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl text-center">
                  <FileText className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">40</div>
                  <div className="text-xs text-gray-500">Questions</div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl text-center">
                  <Target className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">100</div>
                  <div className="text-xs text-gray-500">Total Marks</div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl text-center">
                  <Award className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">60%</div>
                  <div className="text-xs text-gray-500">To Pass</div>
                </div>
              </div>
            </div>

            {/* Question Breakdown */}
            <div className="p-6 bg-[#111118] border border-white/5 rounded-2xl">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-purple-400" />
                Question Breakdown
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white font-medium">Multiple Choice (MCQ)</span>
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-lg">Section 1</span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-400">
                    <div className="flex justify-between">
                      <span>Number of Questions</span>
                      <span className="text-white font-medium">30</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Marks per Question</span>
                      <span className="text-white font-medium">2 marks</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Marks</span>
                      <span className="text-blue-400 font-medium">60 marks</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-purple-500/5 border border-purple-500/20 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white font-medium">Short Answer</span>
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-lg">Section 2</span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-400">
                    <div className="flex justify-between">
                      <span>Number of Questions</span>
                      <span className="text-white font-medium">10</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Marks per Question</span>
                      <span className="text-white font-medium">4 marks</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Marks</span>
                      <span className="text-purple-400 font-medium">40 marks</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Rules */}
            <div className="p-6 bg-[#111118] border border-white/5 rounded-2xl">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-400" />
                Important Rules
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl">
                  <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-400 text-sm font-bold">1</span>
                  </div>
                  <div>
                    <div className="text-white font-medium">Time Limit</div>
                    <div className="text-gray-400 text-sm">
                      You have exactly 30 minutes. Timer starts immediately when you click "Start Test". Test auto-submits when time runs out.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl">
                  <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-purple-400 text-sm font-bold">2</span>
                  </div>
                  <div>
                    <div className="text-white font-medium">Navigation</div>
                    <div className="text-gray-400 text-sm">
                      You can navigate between questions freely. Use the question navigator on the sidebar to jump to any question.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl">
                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-400 text-sm font-bold">3</span>
                  </div>
                  <div>
                    <div className="text-white font-medium">Short Answer Evaluation</div>
                    <div className="text-gray-400 text-sm">
                      Short answers are evaluated by AI. Be clear and concise. Partial marks are awarded based on your answer quality.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <div className="text-white font-medium">One Attempt Only</div>
                    <div className="text-gray-400 text-sm">
                      You can take this test <span className="text-red-400 font-semibold">only once</span>. Make sure you're prepared and have stable internet. Contact admin if you need a retry.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Certification Info */}
            <div className="p-6 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 border border-yellow-500/20 rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-yellow-500/20 rounded-xl">
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Earn Your Certificate</h3>
                  <p className="text-gray-400 text-sm mb-3">
                    Score 60% or above to receive an official certificate with a unique ID. The certificate will be available in your profile and can be downloaded as a PNG image.
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1.5 text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      Digital Certificate
                    </span>
                    <span className="flex items-center gap-1.5 text-blue-400">
                      <Award className="w-4 h-4" />
                      Unique ID
                    </span>
                    <span className="flex items-center gap-1.5 text-purple-400">
                      <FileText className="w-4 h-4" />
                      Downloadable
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Start Button */}
            <div className="p-6 bg-[#111118] border border-white/5 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold mb-1">Ready to begin?</h3>
                  <p className="text-gray-400 text-sm">Make sure you won't be interrupted for 30 minutes</p>
                </div>
                <button
                  onClick={handleStart}
                  disabled={loading || showProfilePopup}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      Start Test
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  // Test taking UI
  if (!test) return null;

  const currentQuestions = currentSection === "mcq" ? test.mcqQuestions : test.shortAnswerQuestions;
  const totalQuestions = test.mcqQuestions.length + test.shortAnswerQuestions.length;
  const answeredMcq = mcqAnswers.filter((a) => a !== null).length;
  const answeredShort = shortAnswers.filter((a) => a.trim()).length;
  const overallProgress = ((answeredMcq + answeredShort) / totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Fixed Header with Timer */}
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">
                {currentSection === "mcq" ? "MCQ" : "Short Answer"} - Q{currentQuestion + 1}/
                {currentQuestions.length}
              </span>
            </div>

            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                timeLeft < 300 ? "bg-red-500/20 text-red-400" : "bg-white/5 text-white"
              }`}
            >
              <Clock className="w-4 h-4" />
              <span className="font-mono font-semibold">{formatTime(timeLeft)}</span>
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-500 transition-colors disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Submit
            </button>
          </div>

          {/* Progress bar */}
          <div className="mt-3 h-1 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8 flex gap-6">
        {/* Question Navigator - Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-28 p-4 bg-[#111118] border border-white/5 rounded-xl">
            <h3 className="text-white font-semibold mb-4">Questions</h3>

            {/* MCQ Section */}
            <div className="mb-4">
              <div className="text-xs text-gray-500 mb-2">MCQ ({answeredMcq}/30)</div>
              <div className="grid grid-cols-6 gap-1">
                {test.mcqQuestions.map((_, idx) => (
                  <button
                    key={`mcq-${idx}`}
                    onClick={() => {
                      setCurrentSection("mcq");
                      setCurrentQuestion(idx);
                    }}
                    className={`w-8 h-8 text-xs rounded flex items-center justify-center transition-colors ${
                      currentSection === "mcq" && currentQuestion === idx
                        ? "bg-blue-600 text-white"
                        : mcqAnswers[idx] !== null
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-white/5 text-gray-400 hover:bg-white/10"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Short Answer Section */}
            <div>
              <div className="text-xs text-gray-500 mb-2">Short Answer ({answeredShort}/10)</div>
              <div className="grid grid-cols-6 gap-1">
                {test.shortAnswerQuestions.map((_, idx) => (
                  <button
                    key={`short-${idx}`}
                    onClick={() => {
                      setCurrentSection("short");
                      setCurrentQuestion(idx);
                    }}
                    className={`w-8 h-8 text-xs rounded flex items-center justify-center transition-colors ${
                      currentSection === "short" && currentQuestion === idx
                        ? "bg-purple-600 text-white"
                        : shortAnswers[idx]?.trim()
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-white/5 text-gray-400 hover:bg-white/10"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Question Area */}
        <main className="flex-1 min-w-0">
          <motion.div
            key={`${currentSection}-${currentQuestion}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 sm:p-8 bg-[#111118] border border-white/5 rounded-2xl"
          >
            {/* Question Type Badge */}
            <div className="flex items-center gap-2 mb-4">
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  currentSection === "mcq"
                    ? "bg-blue-500/10 text-blue-400"
                    : "bg-purple-500/10 text-purple-400"
                }`}
              >
                {currentSection === "mcq" ? "Multiple Choice" : "Short Answer"}
              </span>
              <span className="text-xs text-gray-500">
                {currentSection === "mcq" ? "2 marks" : "4 marks"}
              </span>
            </div>

            {/* Question */}
            <h2 className="text-xl font-semibold text-white mb-6">
              {currentQuestions[currentQuestion].question}
            </h2>

            {/* Answer Options */}
            {currentSection === "mcq" ? (
              <div className="space-y-3">
                {(currentQuestions[currentQuestion] as MCQQuestion).options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleMcqAnswer(idx)}
                    className={`w-full p-4 text-left rounded-xl border transition-all ${
                      mcqAnswers[currentQuestion] === idx
                        ? "bg-blue-500/10 border-blue-500/50 text-white"
                        : "bg-white/5 border-white/5 text-gray-300 hover:bg-white/10 hover:border-white/10"
                    }`}
                  >
                    <span className="font-medium mr-3">
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    {option}
                  </button>
                ))}
              </div>
            ) : (
              <textarea
                value={shortAnswers[currentQuestion]}
                onChange={(e) => handleShortAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full h-48 p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 resize-none focus:outline-none focus:border-purple-500/50 transition-colors"
              />
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
              <button
                onClick={prevQuestion}
                disabled={currentSection === "mcq" && currentQuestion === 0}
                className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
                Previous
              </button>

              {currentSection === "short" &&
              currentQuestion === test.shortAnswerQuestions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-500 transition-colors"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Submit Test
                </button>
              ) : (
                <button
                  onClick={nextQuestion}
                  className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </motion.div>

          {/* Mobile Question Navigator */}
          <div className="lg:hidden mt-6 p-4 bg-[#111118] border border-white/5 rounded-xl">
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => setCurrentSection("mcq")}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                  currentSection === "mcq"
                    ? "bg-blue-600 text-white"
                    : "bg-white/5 text-gray-400"
                }`}
              >
                MCQ ({answeredMcq}/30)
              </button>
              <button
                onClick={() => setCurrentSection("short")}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                  currentSection === "short"
                    ? "bg-purple-600 text-white"
                    : "bg-white/5 text-gray-400"
                }`}
              >
                Short ({answeredShort}/10)
              </button>
            </div>
            <div className="flex flex-wrap gap-1">
              {currentQuestions.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentQuestion(idx)}
                  className={`w-8 h-8 text-xs rounded flex items-center justify-center ${
                    currentQuestion === idx
                      ? currentSection === "mcq"
                        ? "bg-blue-600 text-white"
                        : "bg-purple-600 text-white"
                      : currentSection === "mcq"
                      ? mcqAnswers[idx] !== null
                        ? "bg-green-500/20 text-green-400"
                        : "bg-white/5 text-gray-400"
                      : shortAnswers[idx]?.trim()
                      ? "bg-green-500/20 text-green-400"
                      : "bg-white/5 text-gray-400"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Default export with Suspense wrapper
export default function RoadmapTestPage() {
  return (
    <Suspense fallback={<TestLoading />}>
      <RoadmapTestContent />
    </Suspense>
  );
}
