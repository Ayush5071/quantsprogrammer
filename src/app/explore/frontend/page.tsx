"use client";

import React, { useEffect, useState } from "react";
import { CheckBox } from "@/components/ui/CheckBox";
import Taskbtn from "@/components/ui/Taskbtn";
import Projectbtn from "@/components/ui/Projectbtn";
import { Timeline } from "@/components/ui/Roadmap";
import { useRouter } from "next/navigation";
import { useCheckedData } from "@/context/checkedDataContext";

const Page = () => {
  const router = useRouter();
  const { isLoggedIn } = useCheckedData();  // Accessing login status and userId from context
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRoadmapData = async () => {
      if (!isLoggedIn) return; // No need to fetch data if not logged in

      try {
        const response = await fetch(`/api/roadmap/fetch?topic=FrontEndWeb`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        
        if (response.ok) {
          console.log("Fetched roadmap data: ", data);
          setCheckedItems(data.checkedData || []);
          localStorage.setItem("NewFrontEndDev", JSON.stringify(data.checkedData)); // Save to local storage
        } else {
          console.error("Error fetching roadmap data: ", data.error);
        }
      } catch (error) {
        console.error("Error during API request: ", error);
      }
      setLoading(false);
    };

    if (isLoggedIn) {
      fetchRoadmapData();
    } else {
      // If not logged in, load data from localStorage
      const localData = localStorage.getItem("NewFrontEndWeb");
      if (localData) {
        const parsedData = JSON.parse(localData);
        setCheckedItems(parsedData || []);
        console.log("Found local storage data, setting checked items -> ", parsedData);
      } else {
        console.log("No local data found.");
        setCheckedItems([]);
      }
      setLoading(false);
    }
  }, [isLoggedIn]);  // Only refetch when login status changes

  const handleCheckboxChange = async (id: string) => {
    console.log("Checkbox changed for ID: ", id);

    const updatedCheckedItems = checkedItems.includes(id)
      ? checkedItems.filter((item) => item !== id)
      : [...checkedItems, id];

    console.log("Updated checked items: ", updatedCheckedItems);

    setCheckedItems(updatedCheckedItems);

    if (isLoggedIn) {
      const payload = {
        checkedData: updatedCheckedItems,
        topic: "FrontEndWeb",
      };

      try {
        const response = await fetch("/api/roadmap/store", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        
        if (response.ok) {
          console.log("Roadmap updated successfully:", data);
          localStorage.setItem("NewFrontEndWeb", JSON.stringify(updatedCheckedItems));
        } else {
          console.error("Error updating roadmap:", data.error);
        }
      } catch (error) {
        console.error("Error during API request:", error);
      }
    } else {
      console.log("User is not logged in, saving data locally.");
      localStorage.setItem("NewFrontEndWeb", JSON.stringify(updatedCheckedItems));
    }
  };

  const data = [
    {
      title: "Module-1: Learn Basics of HTML & CSS",
      content: (
        <div className="animate-fadeIn transition-all duration-500">
          <CheckBox
            content="HTML Basics"
            isChecked={checkedItems.includes("htmlBasics")}
            onChange={() => handleCheckboxChange("htmlBasics")}
          />
          <CheckBox
            content="CSS Basics"
            isChecked={checkedItems.includes("cssBasics")}
            onChange={() => handleCheckboxChange("cssBasics")}
          />
          <CheckBox
            content="Responsive Web Design"
            isChecked={checkedItems.includes("responsiveWeb")}
            onChange={() => handleCheckboxChange("responsiveWeb")}
          />
          <div className="assignment pt-2 pb-3 flex flex-wrap items-center gap-3">
            <Taskbtn link="https://youtu.be/4dprtEzunIk?si=niIV9tFDXZR7xvb_" content="Task 1: HTML Basics" />
            <Taskbtn link="https://youtu.be/K1naz9wBwKU?si=V_JrJUaS80s2Pqo" content="Task 2: CSS Basics" />
            <Taskbtn link="https://youtu.be/HG10yrq1pbk?si=e9K3Gkpy3A8eu94S" content="Task 3: Responsive Design" />
          </div>
          <div className="tutorial flex flex-wrap items-center gap-3">
            <Projectbtn link="https://youtu.be/exampleLink" content="Project 1: Basic Page" />
          </div>
        </div>
      ),
    },
    {
      title: "Module-2: Learn JavaScript",
      content: (
        <div className="animate-fadeIn transition-all duration-500">
          <CheckBox
            content="JavaScript Basics (var, let, functions, arrays, loops, conditionals)"
            isChecked={checkedItems.includes("jsBasics")}
            onChange={() => handleCheckboxChange("jsBasics")}
          />
          <CheckBox
            content="Advanced JavaScript (lexical context, data structures, heap, switch, callbacks)"
            isChecked={checkedItems.includes("jsAdvanced")}
            onChange={() => handleCheckboxChange("jsAdvanced")}
          />
          <CheckBox
            content="DOM Manipulation"
            isChecked={checkedItems.includes("domManipulation")}
            onChange={() => handleCheckboxChange("domManipulation")}
          />
          <div className="assignment pt-2 pb-3 flex flex-wrap items-center gap-3">
            <Taskbtn link="https://youtu.be/htznIeWKgg8?si=xRDlFTyb6fV8dllG" content="Basics Tutorial" />
            <Taskbtn link="https://youtu.be/EgDmCbhmstU?si=vt8jlM387xyK_5c" content="Advanced Tutorial" />
            <Taskbtn link="https://youtu.be/2IPEp_4obGw?si=Xy4SIsl6wFDpQuBi" content="Task 3: DOM Practice" />
          </div>
          <div className="tutorial flex flex-wrap items-center gap-3">
            <Projectbtn link="https://youtu.be/exampleLink" content="Project 1: Simple Portfolio" />
            <Projectbtn link="https://youtu.be/6VbETTS67rM?si=SO31FJnY2UMc0ZT2" content="Project 2" />
          </div>
        </div>
      ),
    },
    {
      title: "Module-3: Learn Tailwind CSS",
      content: (
        <div className="animate-fadeIn transition-all duration-500">
          <CheckBox
            content="Master Tailwind CSS"
            isChecked={checkedItems.includes("tailwind")}
            onChange={() => handleCheckboxChange("tailwind")}
          />
          <div className="assignment pt-2 pb-3 flex flex-wrap items-center gap-3">
            <Taskbtn link="https://youtu.be/rbSPe1tJowY?si=L1maz7q2lU5xH5Er" content="Task 1: Tailwind Tutorial" />
          </div>
        </div>
      ),
    },
    {
      title: "Module-4: Learn GSAP",
      content: (
        <div className="animate-fadeIn transition-all duration-500">
          <CheckBox
            content="Animation Creation"
            isChecked={checkedItems.includes("gsapAnimation")}
            onChange={() => handleCheckboxChange("gsapAnimation")}
          />
          <CheckBox
            content="Scroll Trigger"
            isChecked={checkedItems.includes("gsapScrollTrigger")}
            onChange={() => handleCheckboxChange("gsapScrollTrigger")}
          />
          <CheckBox
            content="SVG and Cursor Animation"
            isChecked={checkedItems.includes("gsapSvg")}
            onChange={() => handleCheckboxChange("gsapSvg")}
          />
          <CheckBox
            content="Timeline and Text Animations"
            isChecked={checkedItems.includes("gsapTimeline")}
            onChange={() => handleCheckboxChange("gsapTimeline")}
          />
          <div className="assignment pt-2 pb-3 flex flex-wrap items-center gap-3">
            <Taskbtn link="https://youtube.com/playlist?list=PLbtI3_MArDOnIIJxB6xFtpnhM0wTwz0x6&si=SHHAQnnYcWKgXaG4" content="GSAP Tutorial" />
          </div>
          <div className="tutorial flex flex-wrap items-center gap-3">
            <Projectbtn link="https://youtu.be/xG1_vbVPUUs?si=0QnbuF9zDQc3KAbl" content="Project 1: Animated Page" />
          </div>
        </div>
      ),
    },
    {
      title: "Module-5: React.js",
      content: (
        <div className="animate-fadeIn transition-all duration-500">
          <CheckBox
            content="Understand React (File structure, Virtual DOM, Components)"
            isChecked={checkedItems.includes("reactBasics")}
            onChange={() => handleCheckboxChange("reactBasics")}
          />
          <CheckBox
            content="React Hooks (useState, useEffect, useMemo, useRef)"
            isChecked={checkedItems.includes("reactHooks")}
            onChange={() => handleCheckboxChange("reactHooks")}
          />
          <CheckBox
            content="Context API and Redux Toolkit"
            isChecked={checkedItems.includes("reduxToolkit")}
            onChange={() => handleCheckboxChange("reduxToolkit")}
          />
          <div className="assignment pt-2 pb-3 flex flex-wrap items-center gap-3">
            <Taskbtn link="https://youtube.com/playlist?list=PLu71SKxNbfoDqgPchmvIsL4hTnJIrtige&si=Th3VuLKxeVrppDap" content="React Basics Playlist" />
            <Taskbtn link="https://youtu.be/2LsOyOaobrc?si=3w1gZEovv46A3vay" content="Task 2: Basic React Tutorial 1" />
            <Taskbtn link="https://youtu.be/kfM9j6kmCYI?si=hQkAwdecCRwdAn9L" content="Task 3: React Tutorial 2" />
          </div>
          <div className="tutorial flex flex-wrap items-center gap-3">
            <Projectbtn link="https://youtu.be/syHGmY75pfs?si=FS_oFe0BA8Aszxve" content="Project 1: Mini Docs App" />
            <Projectbtn link="https://youtu.be/AZXYSlxj0vU?si=MyZ3TEL4LZbipl96" content="Project 2: Award-Winning Website" />
          </div>
        </div>
      ),
    },
    {
      title: "Module-6: Learn GSAP + React",
      content: (
        <div className="animate-fadeIn transition-all duration-500">
          <CheckBox
            content="Learn GSAP (GreenSock Animation Platform)"
            isChecked={checkedItems.includes("gsapBasics")}
            onChange={() => handleCheckboxChange("gsapBasics")}
          />
          <CheckBox
            content="Integrate GSAP with React"
            isChecked={checkedItems.includes("gsapReactIntegration")}
            onChange={() => handleCheckboxChange("gsapReactIntegration")}
          />
          <CheckBox
            content="Understand Timeline Animations"
            isChecked={checkedItems.includes("timelineAnimations")}
            onChange={() => handleCheckboxChange("timelineAnimations")}
          />
          <CheckBox
            content="Use Scroll Trigger and Advanced GSAP Animations"
            isChecked={checkedItems.includes("scrollTrigger")}
            onChange={() => handleCheckboxChange("scrollTrigger")}
          />
          <div className="assignment pt-2 pb-3 flex flex-wrap items-center gap-3">
            <Taskbtn
              link="https://youtu.be/UkdJsvosc6c?si=wAYLA3AWbkyg0iau"
              content="Learn GSAP + React Integration"
            />
          </div>
        </div>
      ),
    },
    
  ];
  

  console.log("Rendered Data: ", data);

  return (
    <div className="w-full overflow-x-hidden h-full overflow-hidden bg-gradient-to-b from-black via-blue-900 to-black py-8 px-5">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        {[...Array(600)].map((_, index) => (
          <div
            key={index}
            className="star absolute bg-white rounded-full"
            style={{
              top: `${Math.random() * 300}vh`,
              left: `${Math.random() * 90}vw`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              opacity: Math.random() * 0.5 + 0.1, // Subtle twinkling effect
            }}
          />
        ))}
      </div>
      <div
        className="flex items-center gap-2 mb-6 cursor-pointer font-moon text-zinc-200"
        onClick={() => router.push("/explore")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={4}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
        <span className="font-medium">Back</span>
      </div>
      <Timeline data={data} heading="Full Stack Web Development Roadmap" />
    </div>
  );
};

export default Page;
