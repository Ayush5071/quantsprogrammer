"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Building2, 
  ExternalLink, 
  ArrowLeft,
  Loader2,
  Code2,
  TrendingUp,
  Filter,
  ChevronDown,
  Star,
  BookOpen,
  Lock,
  Unlock,
  Crown,
  Sparkles,
  CheckCircle2
} from "lucide-react";

interface Problem {
  difficulty: string;
  title: string;
  frequency: string;
  acceptance: string;
  link: string;
}

interface Company {
  name: string;
  displayName: string;
  problemCount?: number;
}

// Popular companies to feature
const FEATURED_COMPANIES = [
  "Google", "Amazon", "Microsoft", "Meta", "Apple", "Netflix", 
  "Adobe", "Goldman Sachs", "Uber", "Salesforce", "Oracle", "IBM"
];

// Free companies available without purchase
const FREE_COMPANIES = ["Google", "Amazon", "Microsoft"];

export default function CompanyProblemsPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProblems, setLoadingProblems] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [companySearch, setCompanySearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [error, setError] = useState<string | null>(null);
  const [hasPurchased, setHasPurchased] = useState<boolean>(false);
  const [checkingPurchase, setCheckingPurchase] = useState(true);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  // Check if user has purchased OA questions and show modal on page load
  useEffect(() => {
    const checkPurchaseStatus = async () => {
      try {
        const response = await fetch("/api/payment/oa-questions");
        if (response.ok) {
          const data = await response.json();
          setHasPurchased(data.purchased || false);
          
          // Show purchase modal on page load if user hasn't purchased
          // Check if modal was already shown in this session
          const modalShown = sessionStorage.getItem("oaModalShown");
          if (!data.purchased && !modalShown) {
            // Small delay to let page render first
            setTimeout(() => {
              setShowPurchaseModal(true);
              sessionStorage.setItem("oaModalShown", "true");
            }, 1500);
          }
        } else {
          // Not logged in - show modal to encourage purchase/signup
          const modalShown = sessionStorage.getItem("oaModalShown");
          if (!modalShown) {
            setTimeout(() => {
              setShowPurchaseModal(true);
              sessionStorage.setItem("oaModalShown", "true");
            }, 1500);
          }
        }
      } catch (err) {
        console.error("Error checking purchase status:", err);
      } finally {
        setCheckingPurchase(false);
      }
    };
    checkPurchaseStatus();
  }, []);

  // Check if a company is free
  const isCompanyFree = (companyName: string) => {
    return FREE_COMPANIES.some(fc => 
      companyName.toLowerCase().includes(fc.toLowerCase())
    );
  };

  // Handle payment - Create payment request and redirect
  const handlePurchase = async () => {
    setProcessingPayment(true);
    setShowPurchaseModal(false);

    try {
      // Create payment request via our API
      const response = await fetch("/api/payment/create-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to create payment request. Please try again.");
        setProcessingPayment(false);
        return;
      }

      if (data.paymentUrl) {
        // Redirect to Instamojo payment page
        window.location.href = data.paymentUrl;
      } else {
        alert("Payment URL not received. Please try again.");
        setProcessingPayment(false);
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert("Failed to initiate payment. Please try again.");
      setProcessingPayment(false);
    }
  };

  // Fetch company list from secure API
  const fetchCompanies = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/company-problems");
      
      if (!response.ok) throw new Error("Failed to fetch companies");
      
      const data = await response.json();
      
      // Sort companies - featured first
      const companyList: Company[] = data.companies
        .sort((a: Company, b: Company) => {
          const aFeatured = FEATURED_COMPANIES.some(c => 
            a.displayName.toLowerCase().includes(c.toLowerCase())
          );
          const bFeatured = FEATURED_COMPANIES.some(c => 
            b.displayName.toLowerCase().includes(c.toLowerCase())
          );
          if (aFeatured && !bFeatured) return -1;
          if (!aFeatured && bFeatured) return 1;
          return a.displayName.localeCompare(b.displayName);
        });
      
      setCompanies(companyList);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch problems for selected company via secure API
  const fetchProblems = useCallback(async (companyName: string) => {
    try {
      setLoadingProblems(true);
      setError(null);
      
      // Fetch from our secure API (checks purchase status server-side)
      const response = await fetch(`/api/company-problems?company=${encodeURIComponent(companyName)}`);
      
      if (!response.ok) {
        const data = await response.json();
        if (response.status === 403) {
          // User needs to purchase
          setShowPurchaseModal(true);
          setSelectedCompany(null);
        }
        throw new Error(data.error || "No problems found for this company");
      }
      
      const data = await response.json();
      setProblems(data.problems || []);
      setFilteredProblems(data.problems || []);
    } catch (err: any) {
      setError(err.message);
      setProblems([]);
    } finally {
      setLoadingProblems(false);
    }
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  // Filter problems based on search and difficulty
  useEffect(() => {
    let filtered = problems;
    
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (difficultyFilter !== "all") {
      filtered = filtered.filter(p => 
        p.difficulty.toLowerCase() === difficultyFilter.toLowerCase()
      );
    }
    
    setFilteredProblems(filtered);
  }, [problems, searchQuery, difficultyFilter]);

  // Filter companies based on search
  const filteredCompanies = companies.filter(c =>
    c.displayName.toLowerCase().includes(companySearch.toLowerCase())
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toUpperCase()) {
      case "EASY": return "text-green-400 bg-green-500/10 border-green-500/20";
      case "MEDIUM": return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
      case "HARD": return "text-red-400 bg-red-500/10 border-red-500/20";
      default: return "text-gray-400 bg-gray-500/10 border-gray-500/20";
    }
  };

  const handleCompanySelect = (company: Company) => {
    // Check if company is locked
    if (!hasPurchased && !isCompanyFree(company.displayName)) {
      setShowPurchaseModal(true);
      return;
    }
    
    setSelectedCompany(company);
    setProblems([]);
    setSearchQuery("");
    setDifficultyFilter("all");
    fetchProblems(company.name);
  };

  // Purchase Modal Component
  const PurchaseModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={() => setShowPurchaseModal(false)}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-br from-[#0f0f1a] to-[#1a1a2e] border border-white/10 rounded-2xl p-8 max-w-lg w-full"
      >
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full flex items-center justify-center">
            <Crown className="w-10 h-10 text-yellow-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">
            Unlock 450+ Company Questions
          </h2>
          <p className="text-gray-400 mb-6">
            Get access to curated LeetCode problems from 450+ top companies including Meta, Apple, Netflix, Adobe, and many more!
          </p>

          <div className="bg-white/5 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400">One-time Payment</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 line-through text-sm">₹99</span>
                <span className="text-2xl font-bold text-white">₹10</span>
              </div>
            </div>
            <div className="space-y-2 text-left">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span>Lifetime access to all company questions</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span>Regular updates with new problems</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span>Frequency & acceptance data</span>
              </div>
            </div>
          </div>

          <button
            onClick={handlePurchase}
            disabled={processingPayment}
            className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-xl hover:from-yellow-400 hover:to-orange-400 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processingPayment ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Pay ₹10 & Unlock
              </>
            )}
          </button>
          
          <button
            onClick={() => setShowPurchaseModal(false)}
            className="mt-4 text-gray-500 hover:text-gray-400 text-sm transition"
          >
            Maybe later
          </button>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Purchase Modal */}
      <AnimatePresence>
        {showPurchaseModal && <PurchaseModal />}
      </AnimatePresence>
      
      {/* Processing Payment Overlay */}
      <AnimatePresence>
        {processingPayment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-yellow-400 animate-spin mx-auto mb-4" />
              <p className="text-white font-medium">Redirecting to payment...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => selectedCompany ? setSelectedCompany(null) : router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            {selectedCompany ? "Back to Companies" : "Back"}
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                  <Code2 className="w-8 h-8 text-white" />
                </div>
                {selectedCompany ? selectedCompany.displayName : "Company-Wise Problems"}
              </h1>
              <p className="text-gray-400 mt-2">
                {selectedCompany 
                  ? `LeetCode problems frequently asked at ${selectedCompany.displayName}`
                  : "Practice company-specific LeetCode problems for your dream job"
                }
              </p>
            </div>

            <div className="flex items-center gap-3">
              {!hasPurchased && !checkingPurchase && (
                <button
                  onClick={() => setShowPurchaseModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl text-yellow-400 font-medium flex items-center gap-2 hover:from-yellow-500/30 hover:to-orange-500/30 transition"
                >
                  <Crown className="w-4 h-4" />
                  Unlock All 450+ Companies
                </button>
              )}
              {hasPurchased && (
                <span className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 font-medium flex items-center gap-2">
                  <Unlock className="w-4 h-4" />
                  Premium Access
                </span>
              )}
              {selectedCompany && (
                <span className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 font-medium">
                  {filteredProblems.length} Problems
                </span>
              )}
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!selectedCompany ? (
            /* Company List View */
            <motion.div
              key="companies"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Search Companies */}
              <div className="mb-8">
                <div className="relative max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search companies..."
                    value={companySearch}
                    onChange={(e) => setCompanySearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-[#111118] border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                  />
                </div>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                  <p className="text-gray-400">Loading companies...</p>
                </div>
              ) : error ? (
                <div className="text-center py-20">
                  <p className="text-red-400">{error}</p>
                  <button
                    onClick={fetchCompanies}
                    className="mt-4 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <>
                  {/* Featured Companies */}
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-400" />
                      Featured Companies
                      {!hasPurchased && (
                        <span className="text-xs text-gray-500 font-normal ml-2">
                          ({FREE_COMPANIES.length} free, rest require purchase)
                        </span>
                      )}
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {filteredCompanies
                        .filter(c => FEATURED_COMPANIES.some(fc => 
                          c.displayName.toLowerCase().includes(fc.toLowerCase())
                        ))
                        .slice(0, 12)
                        .map((company, idx) => {
                          const isFree = isCompanyFree(company.displayName);
                          const isLocked = !hasPurchased && !isFree;
                          
                          return (
                            <motion.div
                              key={company.name}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: idx * 0.05 }}
                              onClick={() => handleCompanySelect(company)}
                              className={`group relative p-4 bg-gradient-to-br from-blue-500/5 to-purple-500/5 border rounded-xl cursor-pointer transition-all ${
                                isLocked 
                                  ? "border-white/5 hover:border-yellow-500/30" 
                                  : "border-white/10 hover:border-blue-500/30 hover:bg-white/5"
                              }`}
                            >
                              {isLocked && (
                                <div className="absolute top-2 right-2">
                                  <Lock className="w-4 h-4 text-yellow-500/70" />
                                </div>
                              )}
                              {isFree && !hasPurchased && (
                                <div className="absolute top-2 right-2">
                                  <span className="text-[10px] px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded-full">
                                    FREE
                                  </span>
                                </div>
                              )}
                              <div className="flex flex-col items-center text-center">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${
                                  isLocked 
                                    ? "bg-gradient-to-br from-gray-500/20 to-gray-600/20" 
                                    : "bg-gradient-to-br from-blue-500/20 to-purple-500/20"
                                }`}>
                                  <Building2 className={`w-6 h-6 ${isLocked ? "text-gray-500" : "text-blue-400"}`} />
                                </div>
                                <h3 className={`text-sm font-medium truncate w-full ${
                                  isLocked ? "text-gray-500" : "text-white"
                                }`}>
                                  {company.displayName}
                                </h3>
                              </div>
                            </motion.div>
                          );
                        })}
                    </div>
                  </div>

                  {/* All Companies */}
                  <div>
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-blue-400" />
                      All Companies ({filteredCompanies.length})
                      {!hasPurchased && (
                        <button
                          onClick={() => setShowPurchaseModal(true)}
                          className="text-xs text-yellow-400 font-normal ml-auto flex items-center gap-1 hover:text-yellow-300 transition"
                        >
                          <Lock className="w-3 h-3" />
                          Unlock all for ₹10
                        </button>
                      )}
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                      {filteredCompanies.map((company, idx) => {
                        const isFree = isCompanyFree(company.displayName);
                        const isLocked = !hasPurchased && !isFree;
                        
                        return (
                          <motion.div
                            key={company.name}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: Math.min(idx * 0.02, 0.5) }}
                            onClick={() => handleCompanySelect(company)}
                            className={`group relative p-3 bg-[#111118] border rounded-xl cursor-pointer transition-all ${
                              isLocked 
                                ? "border-white/5 hover:border-yellow-500/20" 
                                : "border-white/5 hover:border-blue-500/30 hover:bg-white/5"
                            }`}
                          >
                            {isLocked && (
                              <div className="absolute top-2 right-2">
                                <Lock className="w-3 h-3 text-yellow-500/50" />
                              </div>
                            )}
                            {isFree && !hasPurchased && (
                              <div className="absolute top-2 right-2">
                                <span className="text-[8px] px-1 py-0.5 bg-green-500/20 text-green-400 rounded">
                                  FREE
                                </span>
                              </div>
                            )}
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition ${
                                isLocked 
                                  ? "bg-white/5 group-hover:bg-yellow-500/10" 
                                  : "bg-white/5 group-hover:bg-blue-500/20"
                              }`}>
                                <Building2 className={`w-4 h-4 transition ${
                                  isLocked 
                                    ? "text-gray-500 group-hover:text-yellow-500" 
                                    : "text-gray-400 group-hover:text-blue-400"
                                }`} />
                              </div>
                              <span className={`text-sm truncate transition ${
                                isLocked 
                                  ? "text-gray-500 group-hover:text-gray-400" 
                                  : "text-gray-300 group-hover:text-white"
                              }`}>
                                {company.displayName}
                              </span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          ) : (
            /* Problems View */
            <motion.div
              key="problems"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search problems..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-[#111118] border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                  />
                </div>

                <div className="flex gap-2">
                  {["all", "easy", "medium", "hard"].map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setDifficultyFilter(diff)}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                        difficultyFilter === diff
                          ? diff === "easy"
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : diff === "medium"
                            ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                            : diff === "hard"
                            ? "bg-red-500/20 text-red-400 border border-red-500/30"
                            : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                          : "bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10"
                      }`}
                    >
                      {diff.charAt(0).toUpperCase() + diff.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {problems.filter(p => p.difficulty === "EASY").length}
                  </div>
                  <div className="text-sm text-gray-400">Easy</div>
                </div>
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {problems.filter(p => p.difficulty === "MEDIUM").length}
                  </div>
                  <div className="text-sm text-gray-400">Medium</div>
                </div>
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
                  <div className="text-2xl font-bold text-red-400">
                    {problems.filter(p => p.difficulty === "HARD").length}
                  </div>
                  <div className="text-sm text-gray-400">Hard</div>
                </div>
              </div>

              {loadingProblems ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                  <p className="text-gray-400">Loading problems...</p>
                </div>
              ) : error ? (
                <div className="text-center py-20 bg-[#111118] border border-white/5 rounded-2xl">
                  <p className="text-red-400 mb-4">{error}</p>
                  <button
                    onClick={() => fetchProblems(selectedCompany.name)}
                    className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition"
                  >
                    Retry
                  </button>
                </div>
              ) : filteredProblems.length === 0 ? (
                <div className="text-center py-20 bg-[#111118] border border-white/5 rounded-2xl">
                  <Code2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No problems found</p>
                </div>
              ) : (
                /* Problems Table */
                <div className="bg-[#111118] border border-white/5 rounded-2xl overflow-hidden">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-4 p-4 bg-white/5 border-b border-white/5 text-sm font-medium text-gray-400">
                    <div className="col-span-1">#</div>
                    <div className="col-span-5">Problem</div>
                    <div className="col-span-2">Difficulty</div>
                    <div className="col-span-2">Frequency</div>
                    <div className="col-span-2 text-right">Action</div>
                  </div>

                  {/* Table Body */}
                  <div className="divide-y divide-white/5">
                    {filteredProblems.map((problem, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: Math.min(idx * 0.02, 0.3) }}
                        className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition group"
                      >
                        <div className="col-span-1 text-gray-500 text-sm">
                          {idx + 1}
                        </div>
                        <div className="col-span-5">
                          <a
                            href={problem.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white hover:text-blue-400 transition font-medium flex items-center gap-2"
                          >
                            {problem.title}
                            <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
                          </a>
                        </div>
                        <div className="col-span-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(problem.difficulty)}`}>
                            {problem.difficulty}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-blue-400" />
                            <span className="text-gray-300 text-sm">{problem.frequency}</span>
                          </div>
                        </div>
                        <div className="col-span-2 text-right">
                          <a
                            href={problem.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition text-sm font-medium"
                          >
                            Solve
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
