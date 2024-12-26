"use client";
import React from "react";
import { AnimatedTooltip } from "../ui/Tooltip";
import {
  FaHtml5,
  FaDatabase,
  FaNodeJs,
  FaTools,
  FaCloud,
  FaRobot,
} from "react-icons/fa";

const people = [
  {
    id: 1,
    name: "Frontend",
    icon: <FaHtml5 className="text-orange-600" />,
  },
  {
    id: 2,
    name: "Backend",
    icon: <FaNodeJs className="text-green-500" />,
  },
  {
    id: 3,
    name: "Database",
    icon: <FaDatabase className="text-blue-600" />,
  },
  {
    id: 4,
    name: "Development Tools",
    icon: <FaTools className="text-gray-500" />,
  },
  {
    id: 5,
    name: "DevOps",
    icon: <FaCloud className="text-blue-500" />,
  },
  {
    id: 6,
    name: "Basic Machine Learning",
    icon: <FaRobot className="text-yellow-500" />,
  },
];

export function Welcome() {
  return (
    <div id="roadmaps" className="font-moon flex flex-row items-center justify-center mb-10 w-full">
      <AnimatedTooltip items={people} />
    </div>
  );
}
