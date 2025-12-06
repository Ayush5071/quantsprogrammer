"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import ReactConfetti from "react-confetti";

export default function SampleTestPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [eligibility, setEligibility] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [testStarted, setTestStarted] = useState(false);
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 minutes
  const [showConfetti, setShowConfetti] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch eligibility and questions
  const fetchTest = useCallback(async () => {
    try {
      const res = await axios.get("/api/sample-test");
      setEligibility(res.data);
      if (res.data.questions) {
        setQuestions(res.data.questions);
      }
      if (res.data.hasAttempted && res.data.attempt) {
        setResults(res.data.attempt);
        setTestSubmitted(true);
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        toast.error("Please login to take the test");
        router.push("/auth/login");
      } else {
        toast.error("Failed to load test");
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchTest();
  }, [fetchTest]);

  // Timer countdown
  useEffect(() => {
    if (!testStarted || testSubmitted || timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [testStarted, testSubmitted, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartTest = () => {
    if (!eligibility?.hasFullDetails) {
      setShowProfileModal(true);
      return;
    }
    setTestStarted(true);
  };

  const handleAnswerSelect = (optionIndex: number) => {
    const questionId = questions[currentQuestion].id;
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    
    try {
      console.log("Submitting sample test with answers:", answers);
      const res = await axios.post("/api/sample-test", { answers });
      console.log("Sample test response:", res.data);
      setResults(res.data);
      setTestSubmitted(true);
      
      if (res.data.passed) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 8000);
      }
      
      toast.success(res.data.message);
    } catch (err: any) {
      console.error("Sample test submission error:", err.response?.data || err.message);
      toast.error(err.response?.data?.error || "Failed to submit test");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Already attempted - show results
  if (testSubmitted && results) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] py-10 px-4">
        {showConfetti && <ReactConfetti recycle={false} numberOfPieces={500} />}
        
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#111118] border border-white/10 rounded-2xl p-8"
          >
            <div className="text-center mb-8">
              <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
                results.passed ? "bg-green-500/20" : "bg-red-500/20"
              }`}>
                {results.passed ? (
                  <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-white mb-2">
                {results.passed ? "Congratulations! 🎉" : "Test Completed"}
              </h1>
              <p className="text-gray-400">
                {results.passed 
                  ? "You have successfully passed the sample test!" 
                  : "Unfortunately, you didn't pass this time."}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-white">{results.score}/{results.totalMarks}</p>
                <p className="text-sm text-gray-400">Score</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-white">{results.percentage}%</p>
                <p className="text-sm text-gray-400">Percentage</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <p className={`text-2xl font-bold ${results.passed ? "text-green-400" : "text-red-400"}`}>
                  {results.passed ? "PASS" : "FAIL"}
                </p>
                <p className="text-sm text-gray-400">Result</p>
              </div>
            </div>

            {results.passed && results.certificateId && (
              <div className="mb-8 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl">
                <p className="text-center text-yellow-400 font-medium mb-2">🏆 Certificate Earned!</p>
                <p className="text-center text-gray-300 text-sm">Certificate ID: {results.certificateId}</p>
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={() => router.push("/profile?tab=certificates")}
                    className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-medium hover:opacity-90 transition"
                  >
                    View Certificate
                  </button>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => router.push("/")}
                className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition"
              >
                Go Home
              </button>
              <button
                onClick={() => router.push("/profile")}
                className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-medium hover:opacity-90 transition"
              >
                View Profile
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Test in progress
  if (testStarted && questions.length > 0) {
    const question = questions[currentQuestion];
    const isLastQuestion = currentQuestion === questions.length - 1;
    const answeredCount = Object.keys(answers).length;

    return (
      <div className="min-h-screen bg-[#0a0a0f] py-10 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header with timer */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">Sample Test</h1>
              <p className="text-gray-400">5 MCQ Questions • 10 Marks Total</p>
            </div>
            <div className={`px-4 py-2 rounded-xl font-mono text-lg ${
              timeLeft < 60 ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400"
            }`}>
              ⏱️ {formatTime(timeLeft)}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>{answeredCount}/{questions.length} answered</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question card */}
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#111118] border border-white/10 rounded-2xl p-8 mb-6"
          >
            <div className="flex items-start gap-4 mb-6">
              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium">
                {question.marks} marks
              </span>
            </div>
            
            <h2 className="text-xl text-white font-medium mb-6">{question.question}</h2>

            <div className="space-y-3">
              {question.options.map((option: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(idx)}
                  className={`w-full p-4 rounded-xl text-left transition-all ${
                    answers[question.id] === idx
                      ? "bg-blue-500/20 border-2 border-blue-500 text-white"
                      : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10"
                  }`}
                >
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 mr-3 text-sm font-medium">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {option}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            
            {isLastQuestion ? (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white font-medium hover:opacity-90 transition disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Test"}
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestion((prev) => Math.min(questions.length - 1, prev + 1))}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-medium hover:opacity-90 transition"
              >
                Next →
              </button>
            )}
          </div>

          {/* Question navigation dots */}
          <div className="flex justify-center gap-2 mt-8">
            {questions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentQuestion(idx)}
                className={`w-10 h-10 rounded-full text-sm font-medium transition ${
                  currentQuestion === idx
                    ? "bg-blue-500 text-white"
                    : answers[q.id] !== undefined
                    ? "bg-green-500/20 text-green-400 border border-green-500/50"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Instructions page
  return (
    <div className="min-h-screen bg-[#0a0a0f] py-10 px-4">
      {/* Profile completion modal */}
      <AnimatePresence>
        {showProfileModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#111118] border border-white/10 rounded-2xl p-6 max-w-md w-full"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Complete Your Profile</h3>
                <p className="text-gray-400 text-sm">
                  Please complete your profile before taking the test. This information is required for your certificate.
                </p>
                {eligibility?.missingDetails && (
                  <p className="text-yellow-400 text-sm mt-2">{eligibility.missingDetails}</p>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => router.push("/profile")}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-medium hover:opacity-90 transition"
                >
                  Go to Profile
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#111118] border border-white/10 rounded-2xl p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Sample Skill Test</h1>
            <p className="text-gray-400">Test your basic web development knowledge</p>
          </div>

          {/* Test info */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-white">5</p>
              <p className="text-sm text-gray-400">MCQ Questions</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-white">10</p>
              <p className="text-sm text-gray-400">Total Marks</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-white">5 min</p>
              <p className="text-sm text-gray-400">Duration</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-white">60%</p>
              <p className="text-sm text-gray-400">Passing Score</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">📋 Instructions</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm flex-shrink-0">1</span>
                <span>This is a <strong className="text-white">one-time test</strong>. You cannot retake it.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm flex-shrink-0">2</span>
                <span>All questions are <strong className="text-white">Multiple Choice (MCQ)</strong>. Each question carries 2 marks.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm flex-shrink-0">3</span>
                <span>You need <strong className="text-white">60% (6 marks)</strong> to pass and earn a certificate.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm flex-shrink-0">4</span>
                <span>The test will <strong className="text-white">auto-submit</strong> when time runs out.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm flex-shrink-0">5</span>
                <span>Your profile must be complete to receive a certificate.</span>
              </li>
            </ul>
          </div>

          {/* Warning */}
          <div className="mb-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
            <p className="text-yellow-400 text-sm flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span><strong>Warning:</strong> Once you start, you cannot pause or restart the test.</span>
            </p>
          </div>

          {/* Start button */}
          <button
            onClick={handleStartTest}
            disabled={eligibility?.hasAttempted}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-semibold text-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {eligibility?.hasAttempted ? "Already Attempted" : "Start Test"}
          </button>

          <button
            onClick={() => router.back()}
            className="w-full mt-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition"
          >
            ← Go Back
          </button>
        </motion.div>
      </div>
    </div>
  );
}
