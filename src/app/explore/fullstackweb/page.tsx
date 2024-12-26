"use client";

import React, { useEffect, useState } from "react";
import { CheckBox } from "@/components/ui/CheckBox";
import Taskbtn from "@/components/ui/Taskbtn";
import Projectbtn from "@/components/ui/Projectbtn";
import { fetchDataFromAPI } from "@/helpers/fetchData";
import { useCheckedData } from "@/context/checkedDataContext";
import { Timeline } from "@/components/ui/Roadmap";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();
  const { checkedData, setCheckedData, isLoggedIn } = useCheckedData();
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Log to verify initialization
  console.log("checkedItems value:", checkedItems);
  console.log("Is array? ->", Array.isArray(checkedItems));
  console.log("is loggediN", isLoggedIn);

  useEffect(() => {
    console.log("user LoggedIn Roadmap Page -> ", isLoggedIn);

    const fetchData = async () => {
      if (isLoggedIn) {
        try {
          const data = await fetchDataFromAPI();
          console.log("Fetched data RoadmapPage (Logged In) ->", data?.checkedData);
          if (data?.checkedData) {
            setCheckedData(data.checkedData); // Update context state
            setCheckedItems(data.checkedData); // Update component state
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      } else {
        const localData = localStorage.getItem("roadmap");
        console.log("Fetched data RoadmapPage (LocalStorage) ->", localData);
        if (localData) {
          const parsedData = JSON.parse(localData);
          setCheckedItems(parsedData);
          setCheckedData(parsedData);
        }
      }
      setLoading(false);
    };

    fetchData();
  }, [isLoggedIn, setCheckedData]);

  const handleCheckboxChange = (id: string) => {
    const updatedCheckedItems = checkedItems.includes(id)
      ? checkedItems.filter((item) => item !== id)
      : [...checkedItems, id];
    setCheckedItems(updatedCheckedItems);
    console.log(updatedCheckedItems, "--->updated");

    if (isLoggedIn) {
      fetch("/api/data/store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${document.cookie.replace("token=", "")}`,
        },
        body: JSON.stringify({ checkedData: updatedCheckedItems }),
      })
        .then((response) => response.json())
        .then(() => {
          setCheckedData(updatedCheckedItems);
        })
        .catch(console.error);
    } else {
      localStorage.setItem("roadmap", JSON.stringify(updatedCheckedItems));
    }
  };

  console.log(checkedItems, "ye decision sbhjb");

  const data = [
    {
      title: "Module-1: Basics of Web Development",
      content: (
        <div className="animate-fadeIn transition-all duration-500">
          <CheckBox
            content="Learn HTML5 (No need to go very deep, just learn some important tags)"
            isChecked={checkedItems.includes("html5")}
            onChange={() => handleCheckboxChange("html5")}
          />
          <CheckBox
            content="Learn CSS, It will take time"
            isChecked={checkedItems.includes("css")}
            onChange={() => handleCheckboxChange("css")}
          />
          <CheckBox
            content="Assignment 1: Create a Product card of Nike shoes with hover effect"
            isChecked={checkedItems.includes("assignment1")}
            onChange={() => handleCheckboxChange("assignment1")}
          />
          <CheckBox
            content="Assignment 2: Create Product page where all product cards are in order (Tip: use Flex or Grid)"
            isChecked={checkedItems.includes("assignment2")}
            onChange={() => handleCheckboxChange("assignment2")}
          />
          <div className="assignment pt-2 pb-3 flex flex-wrap items-center gap-3">
            <Taskbtn link="https://youtu.be/CJ26NLtdzPA?si=CaTd5uxN3Vyq3Iai" content="Assignment-1"/>            
            <Taskbtn link="https://images.app.goo.gl/iPXUrmvacHgHzbWy7" content="Assignment-2"/>            
          </div>          
          <div className="tutorial flex flex-wrap items-center gap-3">
            <Projectbtn link="https://youtu.be/iVCzmDwIQpA?si=JaLIicvvw0hYpgMD" content="HTML5"/>            
            <Projectbtn link="https://youtu.be/WuiB5TAQOAM?si=dS93p1mGarQbP7Lu" content="CSS"/>            
          </div>          
        </div>
      ),
    },
    {
      title: "Module-2: Projects to Practice Basics",
      content: (
        <div className="animate-fadeIn transition-all duration-500 delay-100">
          <CheckBox
            content="Project 1: Build a portfolio website"
            isChecked={checkedItems.includes("project1")}
            onChange={() => handleCheckboxChange("project1")}
          />
          <CheckBox
            content="Project 2: Create a landing page for an e-commerce site"
            isChecked={checkedItems.includes("project2")}
            onChange={() => handleCheckboxChange("project2")}
          />
          <CheckBox
            content="Project 3: Build a responsive blog page"
            isChecked={checkedItems.includes("project3")}
            onChange={() => handleCheckboxChange("project3")}
          />
          <div className="assignment pt-2 pb-3 flex flex-wrap items-center gap-3">
            <Taskbtn link="https://youtu.be/qDkOrHv42rY?si=QrAB83B1Ytu0eFXI" content="Project-1"/>            
            <Taskbtn link="https://youtu.be/nGhKIC_7Mkk?si=_f0DcEKyPjlATgXO" content="Project-2"/>            
            <Taskbtn link="https://images.app.goo.gl/VsSSC8FQZov4goTp8" content="Project-3"/>            
          </div>          
        </div>
      ),
    },
    {
      title: "Module-3: Learn Basics of JavaScript",
      content: (
        <div className="animate-fadeIn transition-all duration-500 delay-200">
          <CheckBox
            content="Learn variables, data types, operators"
            isChecked={checkedItems.includes("js_basics")}
            onChange={() => handleCheckboxChange("js_basics")}
          />
          <CheckBox
            content="Learn functions, loops, arrays, and objects"
            isChecked={checkedItems.includes("js_functions")}
            onChange={() => handleCheckboxChange("js_functions")}
          />
          <CheckBox
            content="Understand DOM manipulation"
            isChecked={checkedItems.includes("js_dom")}
            onChange={() => handleCheckboxChange("js_dom")}
          />
          <CheckBox
            content="Create a basic solar system"
            isChecked={checkedItems.includes("assignment3")}
            onChange={() => handleCheckboxChange("assignment3")}
          />
          <div className="assignment pt-2 pb-3 flex flex-wrap items-center gap-3">
            <Taskbtn link="https://www.google.com/imgres?imgurl=https%3A%2F%2Fmedia.dev.to%2Fdynamic%2Fimage%2Fwidth%3D1000%2Cheight%3D500%2Cfit%3Dcover%2Cgravity%3Dauto%2Cformat%3Dauto%2Fhttps%253A%252F%252Fdev-to-uploads.s3.amazonaws.com%252Fuploads%252Farticles%252Fcisezprc0baagpjb7wna.png&tbnid=hPYfRIhJ2bPLSM&vet=1&imgrefurl=https%3A%2F%2Fdev.to%2Fmadsstoumann%2Fthe-solar-system-in-css-51bo&docid=BYcQv8uQRdeafM&w=1000&h=500&hl=en-IN&gl=in&source=sh%2Fx%2Fim%2Fm1%2F4&kgs=d80bbdd19e6e0ae6&shem=abme%2Ctrie" content="Assignment-3"/>            
          </div>          
          <div className="tutorial flex flex-wrap items-center gap-3">
            <Projectbtn link="https://youtube.com/playlist?list=PLu71SKxNbfoBuX3f4EOACle2y-tRC5Q37&si=6H9jAdlZC5h2rKfj" content="Chai Aur Code"/>            
            <Projectbtn link="https://youtu.be/htznIeWKgg8?si=dTvdIcwwLCpJIAcP" content="Sheryians"/>
            <Projectbtn link="https://www.youtube.com/watch?v=jS4aFq5-91M" content="FreeCodeCamp"/>
          </div>  
        </div>

      ),
    },
    {
      title: "Module-4: Projects Using JavaScript",
      content: (
        <div className="animate-fadeIn transition-all duration-500 delay-300">
          <CheckBox
            content="Project 1: Create a To-do app"
            isChecked={checkedItems.includes("todo_project")}
            onChange={() => handleCheckboxChange("todo_project")}
          />
          <CheckBox
            content="Project 2: Build a weather app using an API"
            isChecked={checkedItems.includes("weather_project")}
            onChange={() => handleCheckboxChange("weather_project")}
          />
          <CheckBox
            content="Project 2.5: Build a weather app using an API"
            isChecked={checkedItems.includes("Ecommerce_App")}
            onChange={() => handleCheckboxChange("Ecommerce_App")}
          />
          <div className="assignment pt-2 pb-3 flex flex-wrap items-center gap-3">
            <Taskbtn link="https://youtu.be/01YKQmia2Jw?si=6_BfbIXpYQ0cgauj" content="Project-4"/>            
            <Taskbtn link="https://youtu.be/MIYQR-Ybrn4?si=50-XKWpCPnniRCL4" content="Project-5"/>            
            <Taskbtn link="https://youtu.be/AONnHqXeFgc?si=tx0ivuW6F1_DBymz" content="Project-5.5"/>            
          </div>          
        </div>
      ),
    },
    {
      title: "Module-5: Understand GitHub and JS Asynchronous Concepts",
      content: (
        <div className="animate-fadeIn transition-all duration-500 delay-400">
          <CheckBox
            content="Learn GitHub basics: clone, commit, push"
            isChecked={checkedItems.includes("github_basics")}
            onChange={() => handleCheckboxChange("github_basics")}
          />
          <CheckBox
            content="Understand async JavaScript: promises, async/await"
            isChecked={checkedItems.includes("js_async")}
            onChange={() => handleCheckboxChange("js_async")}
          />    
          <div className="tutorial pt-2 pb-3 flex flex-wrap items-center gap-3">
            <Projectbtn link="https://youtu.be/yBebbcNBhRc?si=GeYXWQrXcm-Kgcfj" content="GitHub"/>            
            <Projectbtn link="https://youtu.be/6kE8lrqfwHo?si=3k8ytZPOP5EDVkju" content="Async Js"/>            
          </div>  
        </div>
      ),
    },
    {
      title: "Module-6: Learn CSS Frameworks",
      content: (
        <div className="animate-fadeIn transition-all duration-500 delay-500">
          <CheckBox
            content="Learn Bootstrap"
            isChecked={checkedItems.includes("bootstrap")}
            onChange={() => handleCheckboxChange("bootstrap")}
          />
          <CheckBox
            content="Learn Tailwind CSS"
            isChecked={checkedItems.includes("tailwind")}
            onChange={() => handleCheckboxChange("tailwind")}
          />
          <CheckBox
            content="Learn CSS Grid and Flexbox"
            isChecked={checkedItems.includes("grid_flexbox")}
            onChange={() => handleCheckboxChange("grid_flexbox")}
          />     
          <div className="tutorial flex flex-wrap items-center gap-3">
            <Projectbtn link="https://youtu.be/QSfUAuQqfVM?si=QjfYI9-12AmuE4cz" content="Bootstrap"/>            
            <Projectbtn link="https://youtu.be/_9mTJ84uL1Q?si=4OCDDh5CAfmf_3sB" content="Tailwind"/>
            <Projectbtn link="https://youtu.be/DXxt4oIAI4Y?si=cU7OkcgdXUOcF_A8" content="IMP CSS"/>
          </div>  
        </div>
      ),
    },
    {
      title: "Module-7: Node.js, Express, EJS, and MongoDB",
      content: (
        <div className="animate-fadeIn transition-all duration-500 delay-600">
          <CheckBox
            content="Learn Node.js basics"
            isChecked={checkedItems.includes("node_basics")}
            onChange={() => handleCheckboxChange("node_basics")}
          />
          <CheckBox
            content="Learn Express.js for building backend servers"
            isChecked={checkedItems.includes("express_basics")}
            onChange={() => handleCheckboxChange("express_basics")}
          />
          <CheckBox
            content="Learn EJS for templating"
            isChecked={checkedItems.includes("ejs_basics")}
            onChange={() => handleCheckboxChange("ejs_basics")}
          />
          <CheckBox
            content="Learn MongoDB for databases"
            isChecked={checkedItems.includes("mongodb_basics")}
            onChange={() => handleCheckboxChange("mongodb_basics")}
          />
          <CheckBox
            content="Create your own Server using Node"
            isChecked={checkedItems.includes("assignment-4")}
            onChange={() => handleCheckboxChange("assignment-4")}
          />
          <div className="assignment pt-2 pb-3 flex flex-wrap items-center gap-3">
            <Taskbtn link="https://youtu.be/ZQsrcayZcSk?si=iBgaCS33U69sfa5U" content="Assignment-4"/>            
          </div>          
          <div className="tutorial flex flex-wrap items-center gap-3">
            <Projectbtn link="https://youtube.com/playlist?list=PLu71SKxNbfoBGh_8p_NS-ZAh6v7HhYqHW&si=QAu7Xfz_10zB2oCh" content="Chai aur code"/>            
            <Projectbtn link="https://youtube.com/playlist?list=PL92rin1bGHEyqnAWgmIZmL0DmIxWq249F&si=0gG0bkViFBuyW8Mb" content="Sheryians"/>
          </div>  
        </div>
      ),
    },
    {
      title: "Module-8: Complete 2 Big Projects",
      content: (
        <div className="animate-fadeIn transition-all duration-500 delay-700">
          <CheckBox
            content="Big Project 1: Create a blog Application."
            isChecked={checkedItems.includes("big_project1")}
            onChange={() => handleCheckboxChange("big_project1")}
          />
          <CheckBox
            content="Big Project 2: Create Pinterest Clone."
            isChecked={checkedItems.includes("big_project2")}
            onChange={() => handleCheckboxChange("big_project2")}
          />
           <div className="tutorial flex flex-wrap pt-2 items-center gap-3">
            <Projectbtn link="https://youtube.com/playlist?list=PL4cUxeGkcC9hAJ-ARcYq_z6lDZV7kT1xD&si=AC5nGPk5U0dviHDe" content="Notes App"/>            
            <Projectbtn link="https://youtu.be/CuS2c74B0YQ?si=T67xqm2Sol47o-BN" content="Pinterest Clone"/>            
          </div>  
        </div>
        
      ),
    },
    {
      title: "Module-9: Learn React and Redux",
      content: (
        <div className="animate-fadeIn transition-all duration-500 delay-800">
          <CheckBox
            content="Learn React basics (components, hooks, state)"
            isChecked={checkedItems.includes("react_basics")}
            onChange={() => handleCheckboxChange("react_basics")}
          />
          <CheckBox
            content="Learn Redux for state management"
            isChecked={checkedItems.includes("redux")}
            onChange={() => handleCheckboxChange("redux")}
          />
          <CheckBox
            content="Work on React projects"
            isChecked={checkedItems.includes("react_projects")}
            onChange={() => handleCheckboxChange("react_projects")}
          />  
          <div className="assignment pt-2 pb-3 flex flex-wrap items-center gap-3">
            <Taskbtn link="https://youtube.com/playlist?list=PLu71SKxNbfoDqgPchmvIsL4hTnJIrtige&si=vEkeKkUjSoXPBfXr" content="Learn React"/>            
          </div>       
          <div className="tutorial flex flex-wrap pt-2 items-center gap-3">
            <Projectbtn link="https://youtu.be/syHGmY75pfs?si=Qt1vEls-uB-thxYw" content="Sticky Notes App"/>            
          </div>  
        </div>
      ),
    },
    {
      title: "Module-10: Advanced Web Concepts",
      content: (
        <div className="animate-fadeIn transition-all duration-500 delay-900">
          <CheckBox
            content="Learn WebSockets"
            isChecked={checkedItems.includes("websockets")}
            onChange={() => handleCheckboxChange("websockets")}
          />
          <CheckBox
            content="Authentication (JWT, OAuth)"
            isChecked={checkedItems.includes("auth")}
            onChange={() => handleCheckboxChange("auth")}
          />
          <CheckBox
            content="Context API"
            isChecked={checkedItems.includes("context")}
            onChange={() => handleCheckboxChange("context")}
          />
       
          <div className="tutorial flex flex-wrap items-center gap-3">
            <Projectbtn link="https://youtu.be/73Tz6qTgNuU?si=Il8btOJXsNJehwi9" content="Context API"/>            
            <Projectbtn link="https://youtube.com/playlist?list=PLu71SKxNbfoBGh_8p_NS-ZAh6v7HhYqHW&si=v11lSwelLfQQMxBG" content="Auth"/>
          </div>  
        </div>
      ),
    },
    {
      title: "Module-11: State Management Libraries",
      content: (
        <div className="animate-fadeIn transition-all duration-500 delay-1000">
          <CheckBox
            content="Learn Zustand"
            isChecked={checkedItems.includes("zustand")}
            onChange={() => handleCheckboxChange("zustand")}
          />
          <CheckBox
            content="Explore other state management libraries"
            isChecked={checkedItems.includes("other_state_libraries")}
            onChange={() => handleCheckboxChange("other_state_libraries")}
          />       
          <div className="tutorial flex flex-wrap items-center gap-3">
            <Projectbtn link="https://youtu.be/fZPgBnL2x-Q?si=EXtYIFDCzjMN9v0P" content="Zustand"/>            
          </div>  
        </div>
      ),
    },
    {
      title: "Module-12: Full Stack Project",
      content: (
        <div className="animate-fadeIn transition-all duration-500 delay-1100">
          <CheckBox
            content="Create an Ecommerce Application."
            isChecked={checkedItems.includes("full_stack_project")}
            onChange={() => handleCheckboxChange("full_stack_project")}
          />
          <div className="assignment pt-2 pb-3 flex flex-wrap items-center gap-3">
            <Taskbtn link="https://www.linkedin.com/posts/ayush-tiwari-84a823281_hogwarts-haul-where-fantasy-meets-reality-activity-7177179704649555968-AMnW?utm_source=share&utm_medium=member_android" content="Ecommerce App"/>            
          </div>          
        </div>
      ),
    },
    {
      title: "Module-13: Learn TypeScript and SQL",
      content: (
        <div className="animate-fadeIn transition-all duration-500 delay-1200">
          <CheckBox
            content="Learn TypeScript"
            isChecked={checkedItems.includes("typescript")}
            onChange={() => handleCheckboxChange("typescript")}
          />
          <CheckBox
            content="Learn SQL with Postgres"
            isChecked={checkedItems.includes("sql_postgres")}
            onChange={() => handleCheckboxChange("sql_postgres")}
          />      
          <div className="tutorial pt-3 flex flex-wrap items-center gap-3">
            <Projectbtn link="https://youtube.com/playlist?list=PLRAV69dS1uWRPSfKzwZsIm-Axxq-LxqhW&si=IVofuzw-BqOvh5aD" content="TypeScript"/>            
            <Projectbtn link="#" content="Postgres"/>
          </div>  
        </div>
      ),
    },
    {
      title: "Module-14: Learn Next.js",
      content: (
        <div className="animate-fadeIn transition-all duration-500 delay-1300">
          <CheckBox
            content="Learn Next.js for SSR and full-stack development"
            isChecked={checkedItems.includes("nextjs")}
            onChange={() => handleCheckboxChange("nextjs")}
          />      
          <div className="tutorial flex flex-wrap items-center gap-3">
            <Projectbtn link="#" content="Nextjs"/>            
          </div>  
        </div>
      
      ),
    },
    {
      title: "Final Project: Major Full-Stack Projects",
      content: (
        <div className="animate-fadeIn transition-all duration-500 delay-1500">
          <CheckBox
            content="Project 1: Create a real-time cached chatting app"
            isChecked={checkedItems.includes("chatting_app")}
            onChange={() => handleCheckboxChange("chatting_app")}
          />
          <CheckBox
            content="Project 2: Build a full-fledged social media application"
            isChecked={checkedItems.includes("social_media_app")}
            onChange={() => handleCheckboxChange("social_media_app")}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-black via-blue-900 to-black py-8 px-5 overflow-hidden">
      {/* Background stars */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        {[...Array(600)].map((_, index) => (
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
        ))}
      </div>

      {/* Back Arrow */}
      <div
        className="flex items-center gap-2 mb-6 cursor-pointer font-moon text-zinc-200"
        onClick={() => router.push('/')}
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

export default page;
