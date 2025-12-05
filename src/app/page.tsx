"use client";
import { useEffect, useState, memo, useMemo, useCallback } from "react";
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
const MemoizedFooter = memo(Footer);

export default function Home() {
  useLocomotiveScroll();
  const [loading, setLoading] = useState(true);

  // Memoized nav items - simplified for new navbar
  const navItems = useMemo(() => [
    { name: "About", link: "/about" },
    { name: "Blogs", link: "/blogs" },
    { name: "Roadmaps", link: "/explore" },
    { name: "Company Problems", link: "/company-problems" },
    {
      name: "Interview",
      dropdown: [
        { name: "Mock Interview", link: "/interview" },
        { name: "Prepare for Interviews", link: "/prepare-interviews" },
        { name: "Top Interviews", link: "/top-interviews" },
        { name: "Interview History", link: "/top-interview-history" },
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
            <MemoizedFeaturesGrid />
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
