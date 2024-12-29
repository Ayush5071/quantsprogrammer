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
            top: `${Math.random() * 300}vh`,
            left: `${Math.random() * 90}vw`,
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
      title: "Module 1: Prerequisites",
      content: (
        <div className="animate-fadeIn transition-all duration-500">
          <CheckBox
            content="Learn Python Basics"
            isChecked={checkedItems.includes("learnPython")}
            onChange={() => handleCheckboxChange("learnPython")}
          />
          <CheckBox
            content="Practice Python"
            isChecked={checkedItems.includes("practicePython")}
            onChange={() => handleCheckboxChange("practicePython")}
          />
          <CheckBox
            content="Assignment: Build a Calculator GUI Application"
            isChecked={checkedItems.includes("assignment1")}
            onChange={() => handleCheckboxChange("assignment1")}
          />
          <div className="assignment pt-2 pb-3 flex flex-wrap items-center gap-3">
            <Taskbtn
              link="https://www.youtube.com/watch?v=u1RKh1kQqaE&list=PLKnIA16_Rmvb1RYR-iTA_hzckhdONtSW4"
              content="Learn Python - Video Tutorial"
            />
            <Taskbtn
              link="https://github.com/campusx-official/100-days-of-python-programming"
              content="Practice Python on GitHub"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Module 2: Mathematics and Statistics for Data Analysis",
      content: (
        <div className="animate-fadeIn transition-all duration-500">
          <CheckBox
            content="Learn Mathematics and Statistics for Data Science"
            isChecked={checkedItems.includes("mathsStatistics")}
            onChange={() => handleCheckboxChange("mathsStatistics")}
          />
          <CheckBox
            content="Explore Topics on Probability and Data Science"
            isChecked={checkedItems.includes("dataScienceProbability")}
            onChange={() => handleCheckboxChange("dataScienceProbability")}
          />
          <div className="assignment pt-2 pb-3 flex flex-wrap items-center gap-3">
            <Taskbtn
              link="https://www.khanacademy.org/math/statistics-probability"
              content="Khan Academy - Mathematics and Statistics"
            />
            <Taskbtn
              link="https://www.youtube.com/watch?v=2GV_ouHBw30&list=PLKnIA16_RmvbYFaaeLY28cWeqV-3vADST"
              content="Probability and Statistics Video Playlist"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Module 3: Data Collection Methods",
      content: (
        <div className="animate-fadeIn transition-all duration-500">
          <CheckBox
            content="Study Data Collection Methods"
            isChecked={checkedItems.includes("dataCollection")}
            onChange={() => handleCheckboxChange("dataCollection")}
          />
          <div className="assignment pt-2 pb-3 flex flex-wrap items-center gap-3">
            <Taskbtn
              link="https://drive.google.com/file/d/1R8yvE3nL4RITN3ajU_ZKbj_4yv7MEIhB/view?usp=sharing"
              content="Reference PDF for Data Collection"
            />
            <Taskbtn
              link="https://www.youtube.com/watch?v=a_XrmKlaGTs&list=PLKnIA16_Rmvbr7zKYQuBfsVkjoLcJgxHH&index=15"
              content="Video Tutorial: Data Collection"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Module 4: Exploratory Data Analysis (EDA)",
      content: (
        <div className="animate-fadeIn transition-all duration-500">
          <CheckBox
            content="Learn Data Wrangling and Munging"
            isChecked={checkedItems.includes("dataWrangling")}
            onChange={() => handleCheckboxChange("dataWrangling")}
          />
          <CheckBox
            content="Perform Analysis with Python"
            isChecked={checkedItems.includes("analysisPython")}
            onChange={() => handleCheckboxChange("analysisPython")}
          />
          <CheckBox
            content="Explore Data Visualization (Power BI, Excel)"
            isChecked={checkedItems.includes("visualizationPowerBI")}
            onChange={() => handleCheckboxChange("visualizationPowerBI")}
          />
          <div className="assignment pt-2 pb-3 flex flex-wrap items-center gap-3">
            <Taskbtn
              link="https://drive.google.com/file/d/1eifAaxOqzxDvruzI0JQRBNo0Kuk7E7LE/view?usp=sharing"
              content="Data Wrangling PDF"
            />
            <Taskbtn
              link="https://www.youtube.com/watch?v=9xiX-I5_LQY&list=PLKnIA16_Rmvbr7zKYQuBfsVkjoLcJgxHH&index=33"
              content="Learn Data Wrangling on YouTube"
            />
            <Taskbtn
              link="https://www.kaggle.com/code/nilaychauhan/etl-pipelines-tutorial-world-bank-datasets"
              content="Practice Data Wrangling on Kaggle"
            />
            <Taskbtn
              link="https://drive.google.com/file/d/1526O80nDMolQGzY_7oMDMnV_vxFghVg9/view?usp=sharing"
              content="Analysis PDF"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Module 5: SQL",
      content: (
        <div className="animate-fadeIn transition-all duration-500">
          <CheckBox
            content="Learn SQL Basics and Fundamentals"
            isChecked={checkedItems.includes("learnSQLBasics")}
            onChange={() => handleCheckboxChange("learnSQLBasics")}
          />
          <CheckBox
            content="Understand SQL Queries for Database Operations"
            isChecked={checkedItems.includes("sqlQueries")}
            onChange={() => handleCheckboxChange("sqlQueries")}
          />
          <CheckBox
            content="Practice SQL Assignments on HackerRank"
            isChecked={checkedItems.includes("practiceSQL")}
            onChange={() => handleCheckboxChange("practiceSQL")}
          />
          <div className="assignment pt-2 pb-3 flex flex-wrap items-center gap-3">
            <Taskbtn
              link="https://www.youtube.com/watch?v=yH1zCq-iaeU&list=PLdOKnrf8EcP17p05q13WXbHO5Z_JfXNpw"
              content="SQL YouTube Playlist"
            />
            <Taskbtn
              link="https://www.khanacademy.org/computing/computer-programming/sql"
              content="SQL Lessons on Khan Academy"
            />
            <Taskbtn
              link="https://www.hackerrank.com"
              content="Practice SQL on HackerRank"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Module 6: Basic Machine Learning",
      content: (
        <div className="animate-fadeIn transition-all duration-500">
          <CheckBox
            content="Understand Machine Learning Basics"
            isChecked={checkedItems.includes("mlBasics")}
            onChange={() => handleCheckboxChange("mlBasics")}
          />
          <CheckBox
            content="Learn Core ML Algorithms"
            isChecked={checkedItems.includes("mlAlgorithms")}
            onChange={() => handleCheckboxChange("mlAlgorithms")}
          />
          <CheckBox
            content="Explore Machine Learning Workflows and Tools"
            isChecked={checkedItems.includes("mlWorkflow")}
            onChange={() => handleCheckboxChange("mlWorkflow")}
          />
          <div className="assignment pt-2 pb-3 flex flex-wrap items-center gap-3">
            <Taskbtn
              link="https://www.youtube.com/watch?v=gmvvaobm7eQ&list=PLeo1K3hjS3uvCeTYTeyfe0-rN5r8zn9rw"
              content="Basic Machine Learning - YouTube Playlist"
            />
          </div>
        </div>
      ),
    },
  ];
  

  return (
    <div className="w-full h-full overflow-hidden bg-gradient-to-b from-black via-blue-900 to-black py-8 px-5">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        {stars}
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
