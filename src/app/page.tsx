"use client";
import { useEffect, useState } from "react";
import { HeroPage } from "@/components/sections/HeroPage";
import { Footer } from "@/components/sections/Footer";
import { IconMessage, IconUser, IconCoffee } from "@tabler/icons-react";
import { FloatingNav } from "@/components/ui/Navbar";
import { Context } from "@/components/sections/context";
import { SecondSection } from "@/components/sections/secondSection";
import { gsap } from "gsap";
import Loading from "@/components/ui/Loading";
import Head from "next/head";

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

    // Bounce effect for the button
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

  const openContributionLink = () => {
    window.open("https://buymeacoffee.com/Ayush5071", "_blank");
  };

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

          {/* Buy Me a Coffee Button */}
          <div className="relative bg-gradient-to-b from-black via-blue-900 to-black overflow-x-hidden">
      {/* Buy Me a Coffee Button */}
      <div
        className="fixed z-50 bottom-6 right-6 w-16 h-16 hover:w-48 bg-gradient-to-br from-purple-600 to-indigo-800 flex items-center justify-center text-white cursor-pointer shadow-lg coffee-btn transition-all duration-300 ease-in-out group"
        onClick={openContributionLink}
      >
        {/* Coffee Icon */}
        <IconCoffee className="h-8 w-8 absolute group-hover:relative group-hover:translate-x-0 transition-all duration-300 ease-in-out z-[60]" />

        {/* Text revealed on hover inside the div */}
        <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out text-white text-base font-semibold">
          <p>Buy me a coffee</p>
        </div>
      </div>
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
