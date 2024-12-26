import React from "react";
import { BackgroundBeamsWithCollision } from "../ui/Title";
import { Welcome } from "./Welcome";

export function HeroPage() {
  const RedirectAbout = () => {
    window.open('https://ayush-delta.vercel.app/', '_blank');
  };

  return (
    <BackgroundBeamsWithCollision>
      <div className="flex flex-col mt-32 justify-center p-2 md:p-11 items-center gap-2">
        <h2 className="text-2xl font-Acme relative z-20 md:text-3xl lg:text-6xl font-bold text-center text-white tracking-tight mb-4">
          Hey, I&apos;m Ayush Tiwari, Sharing a roadmap to learn Web-Dev based on my experience, specifically for{" "}
          <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
            <div className="absolute left-0 bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r from-indigo-400 via-blue-500 to-purple-600 [text-shadow:0_0_rgba(0,0,0,0.2)]">
              <span className="text-2xl md:text-4xl lg:text-7xl">Fresher&apos;s</span>
            </div>
            <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-indigo-400 via-blue-500 to-purple-600">
              <span className="text-2xl md:text-4xl lg:text-7xl">Fresher&apos;s</span>
            </div>
          </div>
        </h2>
        <div className="">
          <Welcome />
        </div>
        <button
          onClick={RedirectAbout}
          className="px-16 py-4 border text-lg text-white bg-transparent border-white relative group transition duration-200"
        >
          <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 h-full w-full -z-10 group-hover:bottom-0 group-hover:right-0 transition-all duration-200" />
          <span className="relative font-bebas text-2xl xl:text-3xl">
            Know More About Me
          </span>
        </button>
      </div>
    </BackgroundBeamsWithCollision>
  );
}
