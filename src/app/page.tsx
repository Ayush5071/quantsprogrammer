"use client";
import { useEffect, useState, memo, useMemo, useCallback } from "react";
import { HeroPage } from "@/components/sections/HeroPage";
import { Footer } from "@/components/sections/Footer";
import { IconMessage, IconUser, IconCoffee } from "@tabler/icons-react";
import { FloatingNav } from "@/components/ui/Navbar";
import { gsap } from "gsap";
import Loading from "@/components/ui/Loading";
import Head from "next/head";
import KeyFeatures from "@/components/sections/KeyFeatures";
import FeaturesSection from "@/components/sections/FeaturesSection";
import PlatformOverview from "@/components/sections/PlatformOverview";
import CompensationSection from "@/components/sections/CompensationSection";
import InterviewPreparation from "@/components/sections/InterviewPreparation";
import FAQ from "@/components/sections/FAQ";
import CertificateShowcase from "@/components/sections/CertificateShowcase";
import useLocomotiveScroll from "@/hooks/useLocomotiveScroll";

// Memoized Components for better performance
const MemoizedHeroPage = memo(HeroPage);
const MemoizedPlatformOverview = memo(PlatformOverview);
const MemoizedInterviewPreparation = memo(InterviewPreparation);
const MemoizedCompensationSection = memo(CompensationSection);
const MemoizedFeaturesSection = memo(FeaturesSection);
const MemoizedCertificateShowcase = memo(CertificateShowcase);
const MemoizedFAQ = memo(FAQ);
const MemoizedFooter = memo(Footer);

export default function Home() {
  useLocomotiveScroll();
  const [loading, setLoading] = useState(true);

  // Memoized nav items to prevent recreation on every render
  const navItems = useMemo(() => [
    {
      name: "About",
      link: "/about",
      icon: <IconUser className="h-4 w-4 text-white" />,
    },
    {
      name: "Blogs",
      link: "/blogs",
      icon: <IconMessage className="h-4 w-4 text-white" />,
    },
    {
      name: "Roadmaps",
      link: "/explore",
      icon: <IconMessage className="h-4 w-4 text-white" />,
    },
    {
      name: "OA & DSA Qs",
      link: "/oa-dsa-questions",
      icon: <IconCoffee className="h-4 w-4 text-white" />,
    },
    {
      name: "Interview",
      icon: <IconUser className="h-4 w-4 text-white" />,
      dropdown: [
        { name: "Mock Interview", link: "/interview" },
        { name: "Prepare for Interviews", link: "/prepare-interviews" },
        { name: "Top Interviews", link: "/top-interviews" },
        { name: "Top Interview History", link: "/top-interview-history" },
        { name: "Compensation Data", link: "/placement-data" },
        { name: "Past Interviews", link: "/profile#interview-history" },
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
        <div className="relative bg-gradient-to-b from-black via-blue-900 to-black overflow-x-hidden" data-scroll-container>
          {/* Components */}
          <div className="relative z-10 min-h-screen flex flex-col">
            <FloatingNav navItems={navItems} />
            <div className="">
              <MemoizedHeroPage />
              <MemoizedPlatformOverview />
              <MemoizedInterviewPreparation />
              <MemoizedCompensationSection />
              <MemoizedFeaturesSection />
              <MemoizedCertificateShowcase />
              <MemoizedFAQ />
              <MemoizedFooter />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
