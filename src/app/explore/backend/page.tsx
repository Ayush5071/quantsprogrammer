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
  const [stars, setStars] = useState<JSX.Element[]>([]);

  useEffect(() => {
    // Generate star pattern only once
    const generateStars = () => {
      return [...Array(600)].map((_, index) => (
        <div
          key={index}
          className="star absolute bg-white rounded-full"
          style={{
            top: `${Math.random() * 300}vh`,
            left: `${Math.random() * 93}vw`,
            width: `${Math.random() * 2 + 1}px`,
            height: `${Math.random() * 2 + 1}px`,
            opacity: Math.random() * 0.5 + 0.1, // Subtle twinkling effect
          }}
        />
      ));
    };

    setStars(generateStars());  // Store the generated stars pattern
  }, []); // Empty dependency array ensures this runs only once

  useEffect(() => {
    const fetchRoadmapData = async () => {
      if (!isLoggedIn) return; // No need to fetch data if not logged in

      try {
        const response = await fetch(`/api/roadmap/fetch?topic=BackEndWeb`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        
        if (response.ok) {
          console.log("Fetched roadmap data: ", data);
          setCheckedItems(data.checkedData || []);
          localStorage.setItem("NewBackEndWeb", JSON.stringify(data.checkedData)); // Save to local storage
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
      const localData = localStorage.getItem("NewBackEndWeb");
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
        topic: "BackEndWeb",
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
          localStorage.setItem("NewBackEndWeb", JSON.stringify(updatedCheckedItems));
        } else {
          console.error("Error updating roadmap:", data.error);
        }
      } catch (error) {
        console.error("Error during API request:", error);
      }
    } else {
      console.log("User is not logged in, saving data locally.");
      localStorage.setItem("NewBackEndWeb", JSON.stringify(updatedCheckedItems));
    }
  };

  const data = [
    {
      title: "Module-1: Learn JavaScript",
      content: (
        <div className="animate-fadeIn transition-all duration-500">
          <CheckBox
            content="Learn JavaScript Basics"
            isChecked={checkedItems.includes("jsBasics")}
            onChange={() => handleCheckboxChange("jsBasics")}
          />
          <CheckBox
            content="Learn Functions"
            isChecked={checkedItems.includes("jsFunctions")}
            onChange={() => handleCheckboxChange("jsFunctions")}
          />
          <CheckBox
            content="DOM Manipulation"
            isChecked={checkedItems.includes("dom")}
            onChange={() => handleCheckboxChange("dom")}
          />
          <CheckBox
            content="JavaScript Arrays and Objects"
            isChecked={checkedItems.includes("jsArraysObjects")}
            onChange={() => handleCheckboxChange("jsArraysObjects")}
          />
          <CheckBox
            content="Learn Async JavaScript (Promises, Async/Await)"
            isChecked={checkedItems.includes("asyncJS")}
            onChange={() => handleCheckboxChange("asyncJS")}
          />
          <CheckBox
            content="Learn Browser Storage (localStorage, sessionStorage)"
            isChecked={checkedItems.includes("browserStorage")}
            onChange={() => handleCheckboxChange("browserStorage")}
          />
          <CheckBox
            content="Understand JavaScript Engines (V8, Event Loop)"
            isChecked={checkedItems.includes("jsEngines")}
            onChange={() => handleCheckboxChange("jsEngines")}
          />
          <CheckBox
            content="APIs, Fetch, Axios"
            isChecked={checkedItems.includes("api")}
            onChange={() => handleCheckboxChange("api")}
          />
          <CheckBox
            content="Performance Optimization in JavaScript"
            isChecked={checkedItems.includes("optimization")}
            onChange={() => handleCheckboxChange("optimization")}
          />
          <div className="assignment pt-2 pb-3 flex flex-wrap items-center gap-3">
            <Taskbtn link="https://youtube.com/playlist?list=PLu71SKxNbfoBuX3f4EOACle2y-tRC5Q37&si=0O416kWbQy7ipP5Q" content="JavaScript Tutorial" />
          </div>
          <div className="tutorial flex flex-wrap items-center gap-3">
            <Projectbtn link="https://youtu.be/G0jO8kUrg-I?si=-Yo6w1IClMFjAdDi" content="To-Do App Frontend" />
          </div>
        </div>
      ),
    },
    {
      title: "Module-2: Learn Node.js",
      content: (
        <div className="animate-fadeIn transition-all duration-500">
          <CheckBox
            content="Learn Node.js"
            isChecked={checkedItems.includes("nodeJs")}
            onChange={() => handleCheckboxChange("nodeJs")}
          />
          <CheckBox
            content="Create a Server Using Node.js"
            isChecked={checkedItems.includes("nodeServer")}
            onChange={() => handleCheckboxChange("nodeServer")}
          />
          <CheckBox
            content="Read About Template Engines (EJS, Pug)"
            isChecked={checkedItems.includes("templateEngines")}
            onChange={() => handleCheckboxChange("templateEngines")}
          />
          <div className="assignment pt-2 pb-3 flex flex-wrap items-center gap-3">
            <Taskbtn link="https://youtube.com/playlist?list=PLu71SKxNbfoBuX3f4EOACle2y-tRC5Q37&si=0O416kWbQy7ipP5Q" content="Node.js Crash Course" />
          </div>
        </div>
      ),
    },
    {
      title: "Module-3: Learn Express.js",
      content: (
        <div className="animate-fadeIn transition-all duration-500">
          <CheckBox
            content="Learn Express.js"
            isChecked={checkedItems.includes("expressJs")}
            onChange={() => handleCheckboxChange("expressJs")}
          />
          <CheckBox
            content="Middlewares"
            isChecked={checkedItems.includes("middlewares")}
            onChange={() => handleCheckboxChange("middlewares")}
          />
          <CheckBox
            content="Setup App.js or Index.js"
            isChecked={checkedItems.includes("setupAppJs")}
            onChange={() => handleCheckboxChange("setupAppJs")}
          />
          <div className="assignment pt-2 pb-3 flex flex-wrap items-center gap-3">
            <Taskbtn link="https://youtu.be/qfTpKOkZRhs" content="Building APIs with Express" />
          </div>
        </div>
      ),
    },
    {
      title: "Module-4: MongoDB and Data Modeling",
      content: (
        <div className="animate-fadeIn transition-all duration-500">
          <CheckBox
            content="Data Modeling"
            isChecked={checkedItems.includes("dataModeling")}
            onChange={() => handleCheckboxChange("dataModeling")}
          />
          <CheckBox
            content="MongoDB Queries"
            isChecked={checkedItems.includes("mongoQueries")}
            onChange={() => handleCheckboxChange("mongoQueries")}
          />
          <div className="assignment pt-2 pb-3 flex flex-wrap items-center gap-3">
            <Taskbtn link="https://youtu.be/VbGl3msgce8?si=y3kqPGph2akW-eRX" content="MongoDB Queries Tutorial" />
            <Taskbtn link="https://youtu.be/lA_mNpddN5U?si=ecEdfnLw5oBHEvap" content="Data Modeling" />
          </div>
        </div>
      ),
    },
    {
      title: "Module-5: Database Connections and Error Handling",
      content: (
        <div className="animate-fadeIn transition-all duration-500">
          <CheckBox
            content="Database Connections"
            isChecked={checkedItems.includes("dbConnections")}
            onChange={() => handleCheckboxChange("dbConnections")}
          />
          <CheckBox
            content="Error Handling"
            isChecked={checkedItems.includes("errorHandling")}
            onChange={() => handleCheckboxChange("errorHandling")}
          />
          <div className="assignment pt-2 pb-3 flex flex-wrap items-center gap-3">
            <Taskbtn link="https://youtu.be/w4z8Py-UoNk?si=lqpraCPuxk4QRie" content="Database Connections" />
            <Taskbtn link="https://youtu.be/S5EpsMjel-M?si=BqOgYN093HIZr560" content="Error Handling Tutorial" />
          </div>
        </div>
      ),
    },
    {
      title: "Module-6: Routers, Controllers, and Authentication",
      content: (
        <div className="animate-fadeIn transition-all duration-500">
          <CheckBox
            content="Routers and Controllers"
            isChecked={checkedItems.includes("routersControllers")}
            onChange={() => handleCheckboxChange("routersControllers")}
          />
          <CheckBox
            content="Middleware and Cookies"
            isChecked={checkedItems.includes("middlewareCookies")}
            onChange={() => handleCheckboxChange("middlewareCookies")}
          />
          <div className="assignment pt-2 pb-3 flex flex-wrap items-center gap-3">
            <Taskbtn link="https://youtube.com/playlist?list=PLu71SKxNbfoBGh_8p_NS-ZAh6v7HhYqHW" content="Authentication and Routes Tutorial" />
          </div>
        </div>
      ),
    },
    {
      title: "Module-7: Advanced Backend and MongoDB Aggregations",
      content: (
        <div className="animate-fadeIn transition-all duration-500">
          <CheckBox
            content="Subscription Schema"
            isChecked={checkedItems.includes("subscriptionSchema")}
            onChange={() => handleCheckboxChange("subscriptionSchema")}
          />
          <CheckBox
            content="Aggregation Pipelines"
            isChecked={checkedItems.includes("aggregationPipelines")}
            onChange={() => handleCheckboxChange("aggregationPipelines")}
          />
          <div className="assignment pt-2 pb-3 flex flex-wrap items-center gap-3">
            <Taskbtn link="https://youtube.com/playlist?list=PLu71SKxNbfoBGh_8p_NS-ZAh6v7HhYqHW" content="MongoDB Aggregation Pipelines" />
          </div>
        </div>
      ),
    },
    {
      title: "Module-8: WebSockets Using Socket.io",
      content: (
        <div className="animate-fadeIn transition-all duration-500">
          <CheckBox
            content="Learn Socket.io"
            isChecked={checkedItems.includes("socketIo")}
            onChange={() => handleCheckboxChange("socketIo")}
          />
          <div className="assignment pt-2 pb-3 flex flex-wrap items-center gap-3">
            <Taskbtn link="https://youtu.be/UUddpbgPEJM?si=VHVRZAcHH44PX6lm" content="Socket.io Tutorial" />
          </div>
        </div>
      ),
    },
    {
      title: "Module-9: Nodemailer",
      content: (
        <div className="animate-fadeIn transition-all duration-500">
          <CheckBox
            content="Learn Nodemailer to Send Emails"
            isChecked={checkedItems.includes("nodemailer")}
            onChange={() => handleCheckboxChange("nodemailer")}
          />
          <div className="assignment pt-2 pb-3 flex flex-wrap items-center gap-3">
            <Taskbtn link="https://www.nodemailer.com/" content="Nodemailer Official Docs" />
          </div>
        </div>
      ),
    },
    {
      title: "Module-10: Authentication System with OTP",
      content: (
        <div className="animate-fadeIn transition-all duration-500">
          <CheckBox
            content="Create Authentication System with OTP (Backend Only)"
            isChecked={checkedItems.includes("authOTP")}
            onChange={() => handleCheckboxChange("authOTP")}
          />
        </div>
      ),
    },
  ];
  

  return (
    <div className="w-full h-full overflow-hidden bg-gradient-to-b from-black via-blue-900 to-black py-8 px-5">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        {stars}  {/* Render the stars only once */}
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
      <Timeline data={data} heading="Backend Development Roadmap" />
    </div>
  );
};

export default Page;
