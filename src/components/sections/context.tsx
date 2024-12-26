"use client";
import Image from "next/image";
import React from "react";
import { WobbleCard } from "../ui/wobble-card";
import { Cardstack } from "../component/CardStack";

export function Context() {
  return (
    <div className=" w-full">
    <div id="about" className="px-4  grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full md:w-[85%] lg:w-[80%] 2xl:w-[80%]">
      {/* First WobbleCard */}
      <WobbleCard
        containerClassName="col-span-1 lg:col-span-2 h-full bg-pink-800 min-h-[500px] lg:min-h-[300px]"
        className=""
      >
        <div className="max-w-xs">
          <h2 className="font-Manrope text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            Learn & Master Technologies with Roadmaps!
          </h2>
          <p className="font-Sfpro mt-4 text-left text-base/6 text-neutral-200">
            Our platform provides roadmaps for a variety of technologies:
            full-stack development, backend, frontend, data science, app
            development, and data analysis. These are designed based on my own
            learning experience to help guide you step by step.
          </p>
        </div>
        <Image
          src="/home/test1.webp"
          width={500}
          height={500}
          alt="Roadmap image"
          className="absolute -right-4 lg:-right-[40%] grayscale filter -bottom-10 object-contain rounded-2xl"
        />
      </WobbleCard>

      {/* Second WobbleCard */}
      <WobbleCard containerClassName="col-span-1 min-h-[300px]">
        <h2 className="font-Manrope max-w-80 text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
          More Upcoming Features & Updates!
        </h2>
        <p className="font-Sfpro mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
          We’re constantly working on new features to enhance your experience.
          Stay tuned for upcoming updates that will make this platform even
          more valuable for developers and learners.
        </p>
      </WobbleCard>

      {/* Third WobbleCard */}
      <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-blue-900 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]">
        <div className="max-w-sm">
          <h2 className="font-Manrope max-w-sm md:max-w-lg text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            Official Website for My Learning Journey
          </h2>
          <p className="mt-4 font-Sfpro max-w-[26rem] text-left text-base/6 text-neutral-200">
            This website is a space where I can share my experience, the
            technologies I’ve learned, and provide a structured learning
            path for others. All the roadmaps are based on my personal
            experience, so use them as a guide—feel free to tailor them to
            your own needs!
          </p>
        </div>
        <Image
          src="/home/test2.webp"
          width={500}
          height={500}
          alt="Roadmap demo image"
          className="absolute -right-10 md:-right-[40%] lg:-right-[20%] -bottom-10 object-contain rounded-2xl"
        />
      </WobbleCard>

      {/* Auth steps */}
      <WobbleCard containerClassName="col-span-1 lg:col-span-2 h-full bg-violet-500 min-h-[500px] lg:min-h-[300px]">
        <div className="max-w-xs">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-Manrope font-semibold text-white">
            How to Log In
          </h2>
          <p className="mt-4 text-base font-Sfpro text-neutral-200">
            To create an account, simply sign up, and after signing up, you
            will be redirected to the login page. Please make sure to verify your
            email account first—an email with a verification link will be sent
            to your registered Gmail. Without completing the verification, you
            will not be able to access the website.
          </p>
        </div>
        <Image
          src="/home/test3.webp"
          width={500}
          height={500}
          alt="Roadmap demo image"
          className="absolute self-center lg:self-auto lg:-right-[20%] -bottom-10 object-contain rounded-2xl"
        />
      </WobbleCard>
      <WobbleCard containerClassName="col-span-1 min-h-[300px] flex flex-col item-center justify-center bg-pink-500">
        <Cardstack/>
      </WobbleCard>
    </div>
    </div>
  );
}
