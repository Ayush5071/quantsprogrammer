"use client";
import { useEffect, useState, memo, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Sparkles, CheckCircle2, Loader2, X } from "lucide-react";
// Old imports - commented out for new design
// import { HeroPage } from "@/components/sections/HeroPage";
// import { IconMessage, IconUser, IconCoffee } from "@tabler/icons-react";
// import { FloatingNav } from "@/components/ui/Navbar";
// import KeyFeatures from "@/components/sections/KeyFeatures";
// import FeaturesSection from "@/components/sections/FeaturesSection";
// import PlatformOverview from "@/components/sections/PlatformOverview";
// import CompensationSection from "@/components/sections/CompensationSection";
// import InterviewPreparation from "@/components/sections/InterviewPreparation";
// import FAQ from "@/components/sections/FAQ";
// import CertificateShowcase from "@/components/sections/CertificateShowcase";

// New modern imports
import { Footer } from "@/components/sections/Footer";
import { FloatingNav } from "@/components/ui/NewNavbar";
import NewHero from "@/components/sections/home/NewHero";
import FeaturesGrid from "@/components/sections/home/FeaturesGrid";
import StatsSection from "@/components/sections/home/StatsSection";
import PrepareSection from "@/components/sections/home/PrepareSection";
import HowItWorks from "@/components/sections/home/HowItWorks";
import FAQSection from "@/components/sections/home/FAQSection";
import CTASection from "@/components/sections/home/CTASection";
import GitHubWrappedPromo from "@/components/sections/home/GitHubWrappedPromo";
import PremiumDeals from "@/components/sections/home/PremiumDeals";

import { gsap } from "gsap";
import Loading from "@/components/ui/Loading";
import Head from "next/head";
import useLocomotiveScroll from "@/hooks/useLocomotiveScroll";

// Memoized Components for better performance
// Old components - commented out
// const MemoizedHeroPage = memo(HeroPage);
// const MemoizedPlatformOverview = memo(PlatformOverview);
// const MemoizedInterviewPreparation = memo(InterviewPreparation);
// const MemoizedCompensationSection = memo(CompensationSection);
// const MemoizedFeaturesSection = memo(FeaturesSection);
// const MemoizedCertificateShowcase = memo(CertificateShowcase);
// const MemoizedFAQ = memo(FAQ);

// New modern components - memoized
const MemoizedNewHero = memo(NewHero);
const MemoizedStatsSection = memo(StatsSection);
const MemoizedFeaturesGrid = memo(FeaturesGrid);
const MemoizedPrepareSection = memo(PrepareSection);
const MemoizedHowItWorks = memo(HowItWorks);
const MemoizedFAQSection = memo(FAQSection);
const MemoizedCTASection = memo(CTASection);
const MemoizedGitHubWrappedPromo = memo(GitHubWrappedPromo);
const MemoizedPremiumDeals = memo(PremiumDeals);
const MemoizedFooter = memo(Footer);

export default function Home() {
  useLocomotiveScroll();
  const [loading, setLoading] = useState(true);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [oaPrice, setOaPrice] = useState<number>(10);

  // Fetch dynamic pricing
  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const res = await fetch("/api/admin/pricing");
        if (res.ok) {
          const data = await res.json();
          if (data.pricing?.oaQuestions) {
            setOaPrice(data.pricing.oaQuestions);
          }
        }
      } catch (error) {
        console.error("Failed to fetch pricing:", error);
      }
    };
    fetchPricing();
  }, []);

  // Check if user should see purchase modal on first visit
  useEffect(() => {
    const checkAndShowModal = async () => {
      // Check if modal was already shown in this session
      const modalShown = sessionStorage.getItem("homeOaModalShown");
      if (modalShown) return;

      // Check if user has already purchased
      try {
        const response = await fetch("/api/payment/oa-questions");
        if (response.ok) {
          const data = await response.json();
          if (data.purchased) return; // User already purchased, don't show modal
        }
      } catch (err) {
        // If error checking, still show modal
      }

      // Show modal after a short delay
      setTimeout(() => {
        setShowPurchaseModal(true);
        sessionStorage.setItem("homeOaModalShown", "true");
      }, 3000); // Show after 3 seconds
    };

    if (!loading) {
      checkAndShowModal();
    }
  }, [loading]);

  // Handle payment
  const handlePurchase = async () => {
    setProcessingPayment(true);
    setShowPurchaseModal(false);

    try {
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

  // Purchase Modal Component
  const PurchaseModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={() => setShowPurchaseModal(false)}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-br from-[#0f0f1a] to-[#1a1a2e] border border-white/10 rounded-2xl p-8 max-w-lg w-full relative"
      >
        {/* Close button */}
        <button
          onClick={() => setShowPurchaseModal(false)}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full flex items-center justify-center">
            <Crown className="w-10 h-10 text-yellow-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">
            🎉 Special Offer: 450+ Company Questions
          </h2>
          <p className="text-gray-400 mb-6">
            Get access to curated LeetCode problems from 450+ top companies including Google, Amazon, Meta, Apple, Netflix, and many more!
          </p>

          <div className="bg-white/5 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400">One-time Payment</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 line-through text-sm">₹99</span>
                <span className="text-2xl font-bold text-white">₹{oaPrice}</span>
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
                Pay ₹{oaPrice} & Unlock Now
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

  // Memoized nav items - simplified for new navbar
  const navItems = useMemo(() => [
    { name: "About", link: "/about" },
    { name: "Blogs", link: "/blogs" },
    { name: "Roadmaps", link: "/explore" },
    { name: "Company Problems", link: "/company-problems" },
    {
      name: "Wrapped 2025",
      dropdown: [
        { name: "GitHub Wrapped", link: "/github-wrapped" },
        { name: "Codeforces Wrapped", link: "/codeforces-wrapped" },
        { name: "LeetCode Wrapped", link: "/leetcode-wrapped" },
      ],
    },
    {
      name: "Resume",
      dropdown: [
        { name: "Resume Builder", link: "/resume-builder" },
        { name: "AI Resume Screening", link: "/resume-screening" },
      ],
    },
    {
      name: "Interview",
      dropdown: [
        { name: "Mock Interview", link: "/interview" },
        { name: "Prepare for Interviews", link: "/prepare-interviews" },
        { name: "Coding Arena", link: "/top-interviews" },
        { name: "Contest History", link: "/top-interview-history" },
        { name: "Compensation Data", link: "/placement-data" },
      ],
    },
  ], []);

  // Memoized loading effect callback
  const handleLoadingEffect = useCallback(() => {
    const hasVisited = localStorage.getItem("hasVisited");
    if (!hasVisited) {
      setLoading(true);
      localStorage.setItem("hasVisited", "true");
      const timer = setTimeout(() => setLoading(false), 1500); // Reduced from 2000ms
      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    return handleLoadingEffect();
  }, [handleLoadingEffect]);

  // Simplified GSAP animation - reduced intensity
  useEffect(() => {
    const coffeeBtn = document.querySelector(".coffee-btn");
    if (coffeeBtn) {
      gsap.fromTo(
        coffeeBtn,
        { scale: 1 },
        {
          scale: 1.05, // Reduced from 1.1
          duration: 2, // Increased duration for smoother animation
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
        }
      );
    }
  }, [loading]); // Only run after loading is complete


  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </Head>

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
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-yellow-400 animate-spin mx-auto mb-4" />
              <p className="text-white text-lg">Redirecting to payment...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <Loading />
      ) : (
        <div className="relative bg-[#0a0a0f] overflow-x-hidden" data-scroll-container>
          {/* Navigation */}
          <FloatingNav navItems={navItems} />
          
          {/* Main Content */}
          <main className="relative z-10 min-h-screen flex flex-col pt-20">
            {/* New Modern Sections */}
            <MemoizedNewHero />
            <MemoizedStatsSection />
            <MemoizedGitHubWrappedPromo />
            <MemoizedFeaturesGrid />
            <MemoizedPremiumDeals />
            <MemoizedPrepareSection />
            <MemoizedHowItWorks />
            <MemoizedFAQSection />
            <MemoizedCTASection />
            <MemoizedFooter />

            {/* Old Sections - Commented Out
            <MemoizedHeroPage />
            <MemoizedPlatformOverview />
            <MemoizedInterviewPreparation />
            <MemoizedCompensationSection />
            <MemoizedFeaturesSection />
            <MemoizedCertificateShowcase />
            <MemoizedFAQ />
            */}
          </main>
        </div>
      )}
    </>
  );
}
