import React from "react";
import { Meteors } from "../ui/Blog-card";

interface BlogCardProps {
  title: string;
  description: string;
  author: string;
  link: string;
}

export function BlogCard({
  title,
  description,
  author,
  link,
}: BlogCardProps) {
  return (
    <div className="">
      <div className="relative min-h-[27rem] md:h-[27rem] w-full md:w-[40vw] lg:w-[28vw] xl:w-[28vw] 2xl:w-[26vw]">

        <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-indigo-900 via-blue-800 to-black transform scale-[0.85] rounded-full blur-[80px] opacity-90" />
        <div className="relative shadow-2xl bg-gradient-to-t from-gray-900 via-gray-800 to-black border border-gray-700 px-6 py-8 h-full overflow-hidden rounded-2xl flex flex-col justify-between items-start">

          <h1 className="font-bold font-Manrope text-2xl text-white mb-4 relative z-50">
            {title}
          </h1>

          <p className="font-medium font-mono text-base leading-5 text-gray-400 mb-4 relative z-50">
            {description.length > 400
              ? description.substring(0, 400) + "..."
              : description}
          </p>

          <div className="mb-4 font-bebas text-gray-400 text-sm">
            <span>Curated by </span>
            <a
              href={link}
              className="text-teal-400 hover:text-teal-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              {author}
            </a>
          </div>

          <Meteors number={10} />
        </div>
      </div>
    </div>
  );
}
