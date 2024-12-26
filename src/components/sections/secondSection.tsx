"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ContainerScroll } from "../ui/Container-scroll";

export function SecondSection() {
  const [imageSrc, setImageSrc] = useState("/secondSection-small.webp");

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1536) {
        setImageSrc("/secondSection-large.webp");
      } else if (width >= 608) {
        setImageSrc("/secondSection-med.webp"); 
      } else if (width >= 408) {
        setImageSrc("/secondSection-med-s.webp"); 
      } else {
        setImageSrc("/secondSection-small.webp"); 
      }
    };

    // Initial check on mount
    handleResize();

    // Add event listener for resize
    window.addEventListener("resize", handleResize);

    // Clean up the event listener when component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-bebas font-semibold text-white">
              Empowering You with <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                Development Roadmaps
              </span>
            </h1>
          </>
        }
      >
        <Image
          src={imageSrc}
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}
