"use client";
import React, { useEffect } from "react";
import { BlogCard } from "@/components/component/blog-card";
import { gsap } from "gsap";

const blogData = [
  {
    title: "Why Development Isn’t as Boring as You Think",
    description:
      "You might think development is boring because you’re only focused on getting through two projects for placement, but that’s not the whole story. The fun comes in the journey of learning, building, and creating. You can make anything you imagine if you enjoy the process of developing.",
    author: "Ayush Tiwari",
    link: "#",
  },
  {
    title: "Is It Fine to Create Clone Apps?",
    description:
      "Absolutely! Cloning apps is a great way to learn, but don’t just copy everything blindly from YouTube. Understand the tech behind it, add your unique creativity, and build something original. It’s all about mastering the basics and applying them to create real products that people will use.",
    author: "Ayush Tiwari",
    link: "#",
  },
  {
    title: "How to Build Any Application Like a Pro",
    description:
      "Every app, at its core, is a to-do app. Whether it’s an ecommerce platform focusing on payments, social media where chat rules, or a healthcare app requiring video calls, file uploads, and socket communication – the essentials remain similar. Learn the common building blocks, and you can create any application that exists or doesn’t.",
    author: "Ayush Tiwari",
    link: "#",
  },
  {
    title: "Will Only DSA Get You a Job? Here’s the Reality",
    description:
      "It’s true – in colleges, companies often prioritize DSA and high CPI over development skills. But you need to master both to succeed in the placement race. Development might have a smaller role, but it still has an impact in the very few companies that care about it.",
    author: "Ayush Tiwari",
    link: "#",
  },
  {
    title: "How to Start Development If You’re a Beginner",
    description:
      "Feeling lost in development? No worries. Start by following a roadmap that aligns with your interests. Join tech channels like ‘Chai Aur Code’, ‘Sheriyan Coding School’, ‘FreeCodeCamp’, and more for practical advice and solid tips on how to begin your dev journey the right way.",
    author: "Ayush Tiwari",
    link: "#",
  },
  {
    title: "Hackathon Reality – Creativity Under Pressure",
    description:
      "In hackathons, you’ve got limited time to build something amazing. The pressure is real, but that’s where creativity shines. Focus on features and functionality, add as much value as you can – even if it’s not perfectly polished. I believe a well-optimized to-do app will stand out more than any hackathon-winning project that’s flashy but not functional.",
    author: "Ayush Tiwari",
    link: "#",
  },
];

const BlogSection = () => {
  useEffect(() => {
    const timeline = gsap.timeline();

    timeline.fromTo(
      ".moon",
      {
        y: "50vh",
        x: "50%",
        opacity: 0,
      },
      {
        y: "-10vh",
        x: "50%",
        opacity: 1,
        duration: 3,
        ease: "power2.out",
        scale: 2,
      }
    );

    gsap.to(".star", {
      opacity: 0.7,
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
    <div className="relative overflow-x-hidden h-screen text-white bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        {[...Array(50)].map((_, index) => (
          <div
            key={index}
            className="star absolute bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}vh`,
              left: `${Math.random() * 100}vw`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              opacity: 0.5,
            }}
          />
        ))}
      </div>

      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 moon z-10 h-48 w-48 rounded-full bg-gradient-to-br from-gray-300 via-white to-blue-200 shadow-2xl border-4 border-white"></div>

      <div className="relative z-20 text-center py-16">
        <h1 className="text-5xl font-bebas lg:text-7xl xl:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-teal-400">
          Discover the Cosmos of Tech Blogs
        </h1>
        <p className="text-xl font-serif text-gray-400 mt-4">
          Dive into insightful blogs about web development, machine learning, hackathons, and everything tech!
        </p>
      </div>

      <div className="relative z-20 py-8 px-4 sm:px-6 lg:px-12">
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          style={{
            background: "inherit",
            boxShadow: "inset 0px 0px 10px rgba(255, 255, 255, 0.1)",
            borderRadius: "8px",
            padding: "1rem",
          }}
        >
          {blogData.map((blog, index) => (
            <BlogCard
              key={index}
              title={blog.title}
              description={blog.description}
              author={blog.author}
              link={blog.link}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogSection;
