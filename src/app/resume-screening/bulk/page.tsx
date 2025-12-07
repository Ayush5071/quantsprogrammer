"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  ArrowLeft, Upload, FileText, Briefcase, Loader2, CheckCircle,
  AlertTriangle, Shield, Users, Lightbulb, Target, Award, Brain,
  TrendingUp, Eye, Sparkles, BarChart3, Zap, Heart, MessageSquare,
  Star, RefreshCw, FolderOpen, Crown, Lock, XCircle, ChevronDown,
  ChevronUp, Mail, Phone, User, FileWarning, PieChart, Download
} from "lucide-react";

interface CandidateInfo {
  name: string;
  email: string;
  phone: string;
}

interface ScreeningResult {
  fileName: string;
  pageCount: number;
  isDisqualified: boolean;
  disqualificationReason?: string;
  candidateInfo: CandidateInfo;
  skillMatch: number;
  experienceRelevance: number;
  fakeResumeProbability: string;
  cultureFit: number;
  finalCandidateScore: number;
  traits: {
    leadership: number;
    communication: number;
    collaboration: number;
    stability: number;
    innovation: number;
    ownership: number;
  };
  evidence: string[];
}

interface BulkScreeningResponse {
  totalResumes: number;
  screenedResumes: number;
  disqualifiedResumes: number;
  results: ScreeningResult[];
  topPerformers: {
    name: string;
    email: string;
    phone: string;
    score: number;
  }[];
  analytics: {
    averageScore: number;
    averageSkillMatch: number;
    averageExperience: number;
    averageCultureFit: number;
    scoreDistribution: {
      excellent: number;
      good: number;
      average: number;
      poor: number;
    };
  };
}

// Circular Progress Component
const CircularProgress = ({ 
  value, 
  max = 100, 
  size = 100, 
  strokeWidth = 8,
  color = "blue",
  label,
}: { 
  value: number; 
  max?: number; 
  size?: number; 
  strokeWidth?: number;
  color?: string;
  label?: string;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / max) * circumference;
  
  const colorClasses: Record<string, string> = {
    blue: "stroke-blue-500",
    green: "stroke-green-500",
    pink: "stroke-pink-500",
    yellow: "stroke-yellow-500",
    red: "stroke-red-500",
    cyan: "stroke-cyan-500",
  };

  return (
    <div className="relative flex flex-col items-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-700"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`${colorClasses[color]} transition-all duration-1000 ease-out`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-white">{value}</span>
      </div>
      {label && <span className="mt-2 text-xs text-gray-400">{label}</span>}
    </div>
  );
};

// Score Badge Component
const ScoreBadge = ({ score }: { score: number }) => {
  const getColor = (s: number) => {
    if (s >= 80) return "bg-green-500/20 text-green-400 border-green-500/30";
    if (s >= 60) return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    if (s >= 40) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    return "bg-red-500/20 text-red-400 border-red-500/30";
  };
  
  return (
    <span className={`px-2 py-1 rounded-lg text-sm font-bold border ${getColor(score)}`}>
      {score}
    </span>
  );
};

// Distribution Bar Component
const DistributionBar = ({ 
  excellent, good, average, poor, total 
}: { 
  excellent: number; 
  good: number; 
  average: number; 
  poor: number; 
  total: number;
}) => {
  if (total === 0) return null;
  
  const getWidth = (val: number) => `${(val / total) * 100}%`;
  
  return (
    <div className="space-y-2">
      <div className="h-4 rounded-full overflow-hidden flex bg-gray-800">
        {excellent > 0 && (
          <div className="h-full bg-green-500" style={{ width: getWidth(excellent) }} />
        )}
        {good > 0 && (
          <div className="h-full bg-blue-500" style={{ width: getWidth(good) }} />
        )}
        {average > 0 && (
          <div className="h-full bg-yellow-500" style={{ width: getWidth(average) }} />
        )}
        {poor > 0 && (
          <div className="h-full bg-red-500" style={{ width: getWidth(poor) }} />
        )}
      </div>
      <div className="flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-gray-400">Excellent ({excellent})</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-gray-400">Good ({good})</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="text-gray-400">Average ({average})</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-gray-400">Poor ({poor})</span>
        </div>
      </div>
    </div>
  );
};

export default function BulkResumeScreeningPage() {
  const router = useRouter();
  const [jobDescription, setJobDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BulkScreeningResponse | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [checkingPremium, setCheckingPremium] = useState(true);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [expandedResult, setExpandedResult] = useState<string | null>(null);
  const [processingStatus, setProcessingStatus] = useState<string>("");

  // Check authentication and premium status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("/api/users/me");
        if (response.data.user) {
          setIsAuthenticated(true);
          // Check premium status
          const premiumRes = await axios.get("/api/payment/resume-screening");
          setIsPremium(premiumRes.data.purchased || false);
        } else {
          setIsAuthenticated(false);
          router.push("/auth/login-required");
        }
      } catch (error) {
        setIsAuthenticated(false);
        router.push("/auth/login-required");
      } finally {
        setCheckingPremium(false);
      }
    };
    checkAuth();
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const pdfFiles = selectedFiles.filter(f => f.type === "application/pdf");
    
    if (!isPremium && pdfFiles.length > 1) {
      toast.error("Free users can only upload 1 PDF. Upgrade to Premium for bulk uploads!");
      setFiles([pdfFiles[0]]);
    } else {
      setFiles(pdfFiles);
    }
  };

  const extractTextFromPDF = async (file: File): Promise<{ text: string; pageCount: number }> => {
    try {
      // Use PDF.js to extract text
      const pdfjsLib = await import("pdfjs-dist");
      
      // Set worker source - try multiple CDN options
      if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
      }

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const pageCount = pdf.numPages;
      
      console.log(`PDF ${file.name}: ${pageCount} page(s)`);
      
      let fullText = "";
      for (let i = 1; i <= pageCount; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(" ");
        fullText += pageText + "\n";
      }

      return { text: fullText, pageCount };
    } catch (err) {
      console.error(`PDF extraction error for ${file.name}:`, err);
      // Return page count 1 to not disqualify, but with error message in text
      return { 
        text: `Error extracting text from ${file.name}. Please ensure it's a valid PDF file.`, 
        pageCount: 1 
      };
    }
  };

  const handleScreenResumes = async () => {
    if (!jobDescription.trim()) {
      toast.error("Please enter a job description");
      return;
    }
    if (files.length === 0) {
      toast.error("Please upload at least one PDF resume");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // Extract text from all PDFs
      const resumes: { fileName: string; text: string; pageCount: number }[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setProcessingStatus(`Extracting text from ${file.name} (${i + 1}/${files.length})...`);
        
        const { text, pageCount } = await extractTextFromPDF(file);
        console.log(`Processed ${file.name}: ${pageCount} pages, text length: ${text.length}`);
        resumes.push({ fileName: file.name, text, pageCount });
      }

      setProcessingStatus("Analyzing resumes with AI...");

      // Send to API for screening
      const response = await axios.post("/api/resume/bulk-screen", {
        jobDescription: jobDescription.trim(),
        resumes,
      });

      setResult(response.data);
      toast.success(`Screened ${response.data.totalResumes} resume(s)!`);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to screen resumes");
    } finally {
      setLoading(false);
      setProcessingStatus("");
    }
  };

  const handlePurchasePremium = async () => {
    setPurchaseLoading(true);
    try {
      // Record the purchase directly (simulating successful payment for ₹5)
      const response = await axios.post("/api/payment/resume-screening", {
        paymentId: `RSP_${Date.now()}`,
        status: "success",
        amount: 5
      });
      
      if (response.data.success) {
        toast.success("Premium access granted! You can now upload multiple resumes.");
        setIsPremium(true);
      } else {
        toast.error("Failed to activate premium access");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to process payment");
    } finally {
      setPurchaseLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setFiles([]);
    setJobDescription("");
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return "green";
    if (score >= 60) return "blue";
    if (score >= 40) return "yellow";
    return "red";
  };

  if (isAuthenticated === null || checkingPremium) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <FolderOpen className="w-6 h-6 text-blue-400" />
              <h1 className="text-xl font-bold">Bulk Resume Screening</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {isPremium && (
              <span className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-full text-yellow-400 text-sm">
                <Crown className="w-4 h-4" />
                Premium
              </span>
            )}
            {result && (
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                New Analysis
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {!result ? (
          /* Input Form */
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-sm mb-4">
                <Sparkles className="w-4 h-4" />
                Powered by Gemini AI
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Screen Multiple Resumes at Once
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Upload a folder of PDFs, get AI-powered analysis, and see a visual report with top performers.
                {!isPremium && " Free users can upload 1 resume. "}
                <span className="text-yellow-400">Resumes over 2 pages are automatically disqualified.</span>
              </p>
            </div>

            {/* Premium Upgrade Banner */}
            {!isPremium && (
              <div className="mb-8 p-6 bg-gradient-to-r from-yellow-900/20 to-amber-900/20 border border-yellow-500/30 rounded-2xl">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-yellow-500/20 rounded-xl">
                      <Crown className="w-8 h-8 text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Upgrade to Premium</h3>
                      <p className="text-gray-400 text-sm">Upload folders with unlimited PDFs for bulk screening</p>
                    </div>
                  </div>
                  <button
                    onClick={handlePurchasePremium}
                    disabled={purchaseLoading}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-bold rounded-xl transition-all"
                  >
                    {purchaseLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        Get Premium - ₹49
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Input Cards */}
            <div className="space-y-6 mb-8">
              {/* Job Description */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Briefcase className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Job Description</h3>
                    <p className="text-xs text-gray-400">Paste the complete JD to match against</p>
                  </div>
                </div>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here including required skills, responsibilities, experience requirements, and any other relevant details..."
                  rows={8}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none transition-colors"
                />
              </div>

              {/* File Upload */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-pink-500/10 rounded-lg">
                    <FolderOpen className="w-5 h-5 text-pink-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">
                      Upload Resume PDFs
                      {!isPremium && <span className="text-yellow-400 text-xs ml-2">(1 file max)</span>}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {isPremium ? "Select multiple PDF files or a folder" : "Free users: 1 PDF only. Upgrade for bulk uploads."}
                    </p>
                  </div>
                </div>
                
                <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:border-blue-500/50 transition-colors">
                  <input
                    type="file"
                    accept=".pdf"
                    multiple={isPremium}
                    onChange={handleFileChange}
                    className="hidden"
                    id="resume-upload"
                    {...(isPremium ? { webkitdirectory: "", directory: "" } as any : {})}
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                    <p className="text-gray-400 mb-2">
                      {isPremium ? "Click to select PDF files or drag a folder" : "Click to select a PDF file"}
                    </p>
                    <p className="text-xs text-gray-500">Only PDF files accepted</p>
                  </label>
                </div>

                {files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-gray-400">{files.length} file(s) selected:</p>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {files.map((file, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-300 bg-gray-800/50 px-3 py-2 rounded-lg">
                          <FileText className="w-4 h-4 text-blue-400" />
                          {file.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Analyze Button */}
            <div className="text-center">
              <button
                onClick={handleScreenResumes}
                disabled={loading || !jobDescription.trim() || files.length === 0}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {processingStatus || "Processing..."}
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Screen {files.length} Resume{files.length !== 1 ? "s" : ""}
                  </>
                )}
              </button>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
              <div className="text-center p-4 bg-gray-900/30 rounded-xl">
                <FileText className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <span className="text-sm text-gray-400">PDF Analysis</span>
              </div>
              <div className="text-center p-4 bg-gray-900/30 rounded-xl">
                <FileWarning className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <span className="text-sm text-gray-400">2-Page Limit</span>
              </div>
              <div className="text-center p-4 bg-gray-900/30 rounded-xl">
                <PieChart className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                <span className="text-sm text-gray-400">Visual Analytics</span>
              </div>
              <div className="text-center p-4 bg-gray-900/30 rounded-xl">
                <Award className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <span className="text-sm text-gray-400">Top Performers</span>
              </div>
            </div>
          </div>
        ) : (
          /* Results */
          <div className="space-y-8">
            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 text-center">
                <p className="text-3xl font-bold text-white">{result.totalResumes}</p>
                <p className="text-sm text-gray-400">Total Resumes</p>
              </div>
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-5 text-center">
                <p className="text-3xl font-bold text-green-400">{result.screenedResumes}</p>
                <p className="text-sm text-gray-400">Screened</p>
              </div>
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-center">
                <p className="text-3xl font-bold text-red-400">{result.disqualifiedResumes}</p>
                <p className="text-sm text-gray-400">Disqualified</p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-5 text-center">
                <p className="text-3xl font-bold text-blue-400">{result.analytics.averageScore}</p>
                <p className="text-sm text-gray-400">Avg Score</p>
              </div>
            </div>

            {/* Analytics Dashboard */}
            <div className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border border-blue-500/30 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="w-6 h-6 text-blue-400" />
                <h2 className="text-xl font-bold">Analytics Overview</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <CircularProgress 
                  value={result.analytics.averageScore} 
                  color={getScoreColor(result.analytics.averageScore)}
                  label="Avg Score"
                />
                <CircularProgress 
                  value={result.analytics.averageSkillMatch} 
                  color={getScoreColor(result.analytics.averageSkillMatch)}
                  label="Avg Skills"
                />
                <CircularProgress 
                  value={result.analytics.averageExperience} 
                  color={getScoreColor(result.analytics.averageExperience)}
                  label="Avg Experience"
                />
                <CircularProgress 
                  value={result.analytics.averageCultureFit} 
                  color={getScoreColor(result.analytics.averageCultureFit)}
                  label="Avg Culture Fit"
                />
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-3">Score Distribution</h3>
                <DistributionBar 
                  excellent={result.analytics.scoreDistribution.excellent}
                  good={result.analytics.scoreDistribution.good}
                  average={result.analytics.scoreDistribution.average}
                  poor={result.analytics.scoreDistribution.poor}
                  total={result.screenedResumes}
                />
              </div>
            </div>

            {/* Top Performers */}
            {result.topPerformers.length > 0 && (
              <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Award className="w-6 h-6 text-green-400" />
                  <h2 className="text-xl font-bold">Top Performers (Score ≥ 60)</h2>
                </div>
                
                <div className="grid gap-3">
                  {result.topPerformers.map((performer, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-gray-900/50 border border-gray-800 rounded-xl p-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          idx === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                          idx === 1 ? 'bg-gray-400/20 text-gray-300' :
                          idx === 2 ? 'bg-amber-600/20 text-amber-500' :
                          'bg-gray-700/50 text-gray-400'
                        }`}>
                          {idx + 1}
                        </div>
                        <div>
                          <p className="font-medium text-white flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            {performer.name}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                            {performer.email !== "Not Found" && (
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {performer.email}
                              </span>
                            )}
                            {performer.phone !== "Not Found" && (
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {performer.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <ScoreBadge score={performer.score} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Results */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="w-6 h-6 text-blue-400" />
                <h2 className="text-xl font-bold">All Results</h2>
              </div>
              
              <div className="space-y-3">
                {result.results.map((res, idx) => (
                  <div key={idx} className={`border rounded-xl overflow-hidden ${
                    res.isDisqualified 
                      ? 'border-red-500/30 bg-red-900/10' 
                      : 'border-gray-800 bg-gray-900/30'
                  }`}>
                    <div 
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors"
                      onClick={() => setExpandedResult(expandedResult === res.fileName ? null : res.fileName)}
                    >
                      <div className="flex items-center gap-3">
                        {res.isDisqualified ? (
                          <XCircle className="w-5 h-5 text-red-400" />
                        ) : (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        )}
                        <div>
                          <p className="font-medium text-white">{res.fileName}</p>
                          <p className="text-xs text-gray-400">
                            {res.pageCount} page{res.pageCount !== 1 ? 's' : ''}
                            {res.isDisqualified && ` • ${res.disqualificationReason}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {!res.isDisqualified && <ScoreBadge score={res.finalCandidateScore} />}
                        {expandedResult === res.fileName ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                    
                    {expandedResult === res.fileName && !res.isDisqualified && (
                      <div className="border-t border-gray-800 p-4 space-y-4">
                        {/* Candidate Info */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="bg-gray-800/50 rounded-lg p-3">
                            <p className="text-xs text-gray-400 mb-1">Name</p>
                            <p className="text-white font-medium">{res.candidateInfo.name}</p>
                          </div>
                          <div className="bg-gray-800/50 rounded-lg p-3">
                            <p className="text-xs text-gray-400 mb-1">Email</p>
                            <p className="text-white font-medium">{res.candidateInfo.email}</p>
                          </div>
                          <div className="bg-gray-800/50 rounded-lg p-3">
                            <p className="text-xs text-gray-400 mb-1">Phone</p>
                            <p className="text-white font-medium">{res.candidateInfo.phone}</p>
                          </div>
                        </div>

                        {/* Scores */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="text-center p-3 bg-gray-800/30 rounded-lg">
                            <p className="text-2xl font-bold text-blue-400">{res.skillMatch}</p>
                            <p className="text-xs text-gray-400">Skill Match</p>
                          </div>
                          <div className="text-center p-3 bg-gray-800/30 rounded-lg">
                            <p className="text-2xl font-bold text-green-400">{res.experienceRelevance}</p>
                            <p className="text-xs text-gray-400">Experience</p>
                          </div>
                          <div className="text-center p-3 bg-gray-800/30 rounded-lg">
                            <p className="text-2xl font-bold text-pink-400">{res.cultureFit}</p>
                            <p className="text-xs text-gray-400">Culture Fit</p>
                          </div>
                          <div className="text-center p-3 bg-gray-800/30 rounded-lg">
                            <p className="text-2xl font-bold text-yellow-400">{res.fakeResumeProbability}</p>
                            <p className="text-xs text-gray-400">Fake Risk</p>
                          </div>
                        </div>

                        {/* Evidence */}
                        <div>
                          <p className="text-sm font-medium text-gray-400 mb-2">Analysis Evidence</p>
                          <ul className="space-y-1">
                            {res.evidence.map((ev, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                                {ev}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                Screen More Resumes
              </button>
              <button
                onClick={() => router.push("/resume-screening")}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
              >
                <FileText className="w-5 h-5" />
                Single Resume Mode
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
