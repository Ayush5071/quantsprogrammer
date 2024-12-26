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
  const { isLoggedIn } = useCheckedData();  
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
            top: `${Math.random() * 500}vh`,
            left: `${Math.random() * 100}vw`,
            width: `${Math.random() * 2 + 1}px`,
            height: `${Math.random() * 2 + 1}px`,
            opacity: Math.random() * 0.5 + 0.1, // Subtle twinkling effect
          }}
        />
      ));
    };

    setStars(generateStars());  
  }, []); 

  useEffect(() => {
    const fetchRoadmapData = async () => {
      if (!isLoggedIn) return; 

      try {
        const response = await fetch(`/api/roadmap/fetch?topic=DataAnalysis`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        
        if (response.ok) {
          console.log("Fetched roadmap data: ", data);
          setCheckedItems(data.checkedData || []);
          localStorage.setItem("DataAnalysis", JSON.stringify(data.checkedData)); // Save to local storage
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
      const localData = localStorage.getItem("DataAnalysis");
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
  }, [isLoggedIn]); 

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
        topic: "DataAnalysis",
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
          localStorage.setItem("DataAnalysis", JSON.stringify(updatedCheckedItems));
        } else {
          console.error("Error updating roadmap:", data.error);
        }
      } catch (error) {
        console.error("Error during API request:", error);
      }
    } else {
      console.log("User is not logged in, saving data locally.");
      localStorage.setItem("DataAnalysis", JSON.stringify(updatedCheckedItems));
    }
  };

  const data = [
    {
      title: "Module-1: Basics of Data Analysis",
      content: (
        <div className="animate-fadeIn transition-all duration-500">
          <CheckBox
            content="test1"
            isChecked={checkedItems.includes("pythonBasics")}
            onChange={() => handleCheckboxChange("pythonBasics")}
          />
          <CheckBox
            content="Understand Data Cleaning and Preprocessing Techniques"
            isChecked={checkedItems.includes("dataCleaning")}
            onChange={() => handleCheckboxChange("dataCleaning")}
          />
          <CheckBox
            content="Assignment: Analyze a CSV file using Pandas"
            isChecked={checkedItems.includes("assignment1")}
            onChange={() => handleCheckboxChange("assignment1")}
          />
          <div className="assignment pt-2 pb-3 flex flex-wrap items-center gap-3">
            <Taskbtn link="https://youtu.be/hg8a2a0T3ek" content="Python Pandas Basics" />
            <Taskbtn link="https://youtu.be/N0qjvPvAYQ8" content="Data Cleaning Basics" />
          </div>
          <div className="tutorial flex flex-wrap items-center gap-3">
            <Projectbtn link="https://youtu.be/MuDFQu2w7os" content="Building Data Analysis with Pandas" />
            <Projectbtn link="https://youtu.be/Nh2vvOtEkQ0" content="Data Preprocessing Techniques" />
          </div>
        </div>
      ),
    },
    {
      title: "Module-2: Data Visualization and Storytelling",
      content: (
        <div className="animate-fadeIn transition-all duration-500">
          <CheckBox
            content="Learn Data Visualization with Matplotlib and Seaborn"
            isChecked={checkedItems.includes("matplotlibSeaborn")}
            onChange={() => handleCheckboxChange("matplotlibSeaborn")}
          />
          <CheckBox
            content="Create Interactive Dashboards using Plotly"
            isChecked={checkedItems.includes("plotlyDashboards")}
            onChange={() => handleCheckboxChange("plotlyDashboards")}
          />
          <CheckBox
            content="Assignment: Create a dashboard from analyzed data"
            isChecked={checkedItems.includes("assignment2")}
            onChange={() => handleCheckboxChange("assignment2")}
          />
          <div className="assignment pt-2 pb-3 flex flex-wrap items-center gap-3">
            <Taskbtn link="https://youtu.be/d7G5jHzjfbk" content="Matplotlib Introduction" />
            <Taskbtn link="https://youtu.be/lxFS9PoTKQI" content="Building Dashboards with Plotly" />
          </div>
          <div className="tutorial flex flex-wrap items-center gap-3">
            <Projectbtn link="https://youtu.be/KoNugDkwpMk" content="Data Visualization Project" />
            <Projectbtn link="https://youtu.be/92UwqrmXZpw" content="Creating Interactive Dashboards" />
          </div>
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
      <Timeline data={data} heading="Data Analysis Roadmap" />
    </div>
  );
};

export default Page;
