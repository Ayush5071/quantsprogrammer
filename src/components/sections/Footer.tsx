import React from "react";
import { Cover } from "@/components/ui/cover";
import {
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaReact,
  FaNodeJs,
  FaLinkedin,
  FaInstagram,
  FaGithub,
} from "react-icons/fa";

export function Footer() {
  const navItems = [
    { name: "About", link: "/#about" },
    { name: "Blog & Facts", link: "/blogs" },
    { name: "RoadMaps", link: "/explore" },
    { name: "Contact", link: "/#contact" },
  ];

  return (
    <section className="px-2 py-16 text-white">
      <div className="container mx-auto text-center">
        {/* Heading */}
        <h1 className="text-5xl font-bebas md:text-6xl lg:text-8xl font-bold max-w-7xl mx-auto text-center mt-6 relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-purple-500 to-blue-500">
          Master the art of <br /> web development at <Cover>Quants Programmer</Cover>
        </h1>

        {/* Icons Row */}
        <div className="flex justify-center space-x-4 md:space-x-8 mt-10">
          <FaHtml5 className="h-12 w-12 md:h-14 md:w-14 text-orange-500" />
          <FaCss3Alt className="h-12 w-12 md:h-14 md:w-14 text-blue-500" />
          <FaJs className="h-12 w-12 md:h-14 md:w-14 text-yellow-400" />
          <FaReact className="h-12 w-12 md:h-14 md:w-14 text-cyan-400" />
          <FaNodeJs className="h-12 w-12 md:h-14 md:w-14 text-green-500" />
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center space-x-6 mt-10 text-sm md:text-lg">
          {navItems.map((item, index) => (
            <a
              key={index}
              href={item.link}
              className="hover:text-indigo-400 transition-colors"
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Social Links */}
        <div className="flex justify-center space-x-10 mt-10">
          <a
            href="https://www.linkedin.com/in/ayush-tiwari-84a823281/"
            className="hover:text-indigo-400 transition-colors"
          >
            <FaLinkedin className="h-10 w-10 md:h-12 md:w-12" />
          </a>
          <a
            href="https://www.instagram.com/quants_programmer?igsh=bzNiejJmMnRrZnpv"
            className="hover:text-purple-400 transition-colors"
          >
            <FaInstagram className="h-10 w-10 md:h-12 md:w-12" />
          </a>
          <a
            href="https://github.com/Ayush5071"
            className="hover:text-gray-400 transition-colors"
          >
            <FaGithub className="h-10 w-10 md:h-12 md:w-12" />
          </a>
        </div>

        {/* Copyright */}
        <div className="mt-12 text-xs md:text-sm text-gray-400">
          &copy; {new Date().getFullYear()}{" "}
          <a
            href="https://ayush-delta.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:underline"
          >
            Ayush Tiwari{" "}
          </a>
          X QuantsProgrammer. All Rights Reserved.
        </div>
      </div>
    </section>
  );
}
