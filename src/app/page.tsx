"use client";
import { useEffect, useState } from "react";
import { HeroPage } from "@/components/sections/HeroPage";
import { Footer } from "@/components/sections/Footer";
import { IconMessage, IconUser, IconCoffee } from "@tabler/icons-react";
import { FloatingNav } from "@/components/ui/Navbar";
// import { Context } from "@/components/sections/context";
// import { SecondSection } from "@/components/sections/secondSection";
import { gsap } from "gsap";
import Loading from "@/components/ui/Loading";
import Head from "next/head";
import KeyFeatures from "@/components/sections/KeyFeatures";
import FeaturesSection from "@/components/sections/FeaturesSection";
import PlatformOverview from "@/components/sections/PlatformOverview";
import CompensationSection from "@/components/sections/CompensationSection";
import InterviewPreparation from "@/components/sections/InterviewPreparation";
import FAQ from "@/components/sections/FAQ";
// import Testimonials from "@/components/sections/Testimonials";
import CertificateShowcase from "@/components/sections/CertificateShowcase";
import useLocomotiveScroll from "@/hooks/useLocomotiveScroll";

export default function Home() {
  useLocomotiveScroll();
  const [loading, setLoading] = useState(true);

  const navItems = [
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
  ];

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited");
    if (!hasVisited) {
      setLoading(true);
      localStorage.setItem("hasVisited", "true");
      const timer = setTimeout(() => setLoading(false), 2000);
      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Bounce effect for the button only
    gsap.fromTo(
      ".coffee-btn",
      { scale: 1 },
      {
        scale: 1.1,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      }
    );
  }, []);


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
          {/* Star background removed for cleaner look */}

          {/* Buy Me a Coffee Button */}

          {/* Components */}
          <div className="relative z-10 min-h-screen flex flex-col">
            <FloatingNav navItems={navItems} />
            {/* Hero Page - Now full 100vh */}
            {/* Other sections for users who scroll */}
            <div className="">
            <HeroPage />
              {/* Platform Overview Section: Four main modules */}
              <PlatformOverview />
              {/* Interview Preparation Section: Comprehensive prep materials */}
              <InterviewPreparation />
              {/* Compensation Data Section: Salary insights and company data */}
              <CompensationSection />
              {/* New Features Section: Category-based platform features */}
              <FeaturesSection />
              {/* Certificate Showcase Section: Sample certificate display */}
              <CertificateShowcase />
              {/* FAQ Section with glassmorphism */}
              <FAQ />
            <Footer />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
