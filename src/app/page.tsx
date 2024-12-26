"use client"; 
import { useEffect, useState } from "react";
import { HeroPage } from "@/components/sections/HeroPage";
import { Footer } from "@/components/sections/Footer";
import { IconHome, IconMessage, IconUser } from "@tabler/icons-react";
import { FloatingNav } from "@/components/ui/Navbar";
import { Context } from "@/components/sections/context";
import { SecondSection } from "@/components/sections/secondSection";
import { gsap } from "gsap";
import Loading from "@/components/ui/Loading";
import Head from "next/head"; // Import Head component for managing meta and favicon

export default function Home() {
  const [loading, setLoading] = useState(true);

  const navItems = [
    {
      name: "About",
      link: "/#about",
      icon: <IconUser className="h-4 w-4 text-white" />,
    },
    {
      name: "Blogs",
      link: "/blogs",
      icon: <IconMessage className="h-4 w-4 text-white" />,
    },
    {
      name: "RoadMaps",
      link: "/explore",
      icon: <IconMessage className="h-4 w-4 text-white" />,
    },
  ];

  useEffect(() => {
    // Check if user has visited before
    const hasVisited = localStorage.getItem("hasVisited");

    if (!hasVisited) {
      // Show loader if first visit
      setLoading(true);
      localStorage.setItem("hasVisited", "true");

      const timer = setTimeout(() => {
        setLoading(false);
      }, 2000);

      return () => {
        clearTimeout(timer);
      };
    } else {
      // Skip loader on subsequent visits
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    gsap.to(".star", {
      opacity: 0.8,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: {
        amount: 1,
        from: "random",
      },
    });
  }, []);

  return (
    <>
      <Head>
        {/* Adding the favicon for the page */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </Head>
      
      {loading ? (
        <Loading />
      ) : (
        <div className="relative bg-gradient-to-b from-black via-blue-900 to-black overflow-x-hidden">
          <div className="absolute top-0 left-0 w-full h-full z-0">
            {[...Array(600)].map((_, index) => (
              <div
                key={index}
                className="star absolute bg-white rounded-full"
                style={{
                  top: `${Math.random() * 500}vh`,
                  left: `${Math.random() * 100}vw`,
                  width: `${Math.random() * 1.5 + 0.5}px`,
                  height: `${Math.random() * 1.5 + 0.5}px`,
                  opacity: Math.random() * 0.7,
                }}
              />
            ))}
          </div>

          {/* Components */}
          <div className="relative z-10">
            <FloatingNav navItems={navItems} />
            <HeroPage />
            <SecondSection />
            <Context />
            <Footer />
          </div>
        </div>
      )}
    </>
  );
}
