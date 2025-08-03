"use client";
import { useState } from "react";
import { FaBuilding, FaCode, FaChartLine, FaGraduationCap } from "react-icons/fa";
import Link from "next/link";

const companies = [
  {
    name: "Goldman Sachs",
    slug: "goldman-sachs",
    description: "Investment banking and financial services",
    questionCount: 88,
    difficulty: "Hard",
    icon: <FaBuilding className="w-8 h-8" />,
    color: "from-blue-600 to-blue-800",
    borderColor: "border-blue-500",
  },
  {
    name: "Microsoft",
    slug: "microsoft",
    description: "Technology and software development",
    questionCount: 75,
    difficulty: "Medium",
    icon: <FaCode className="w-8 h-8" />,
    color: "from-green-600 to-green-800",
    borderColor: "border-green-500",
  },
  {
    name: "Google",
    slug: "google",
    description: "Search engine and technology",
    questionCount: 92,
    difficulty: "Hard",
    icon: <FaChartLine className="w-8 h-8" />,
    color: "from-red-600 to-red-800",
    borderColor: "border-red-500",
  },
  {
    name: "Amazon",
    slug: "amazon",
    description: "E-commerce and cloud computing",
    questionCount: 68,
    difficulty: "Medium",
    icon: <FaGraduationCap className="w-8 h-8" />,
    color: "from-yellow-600 to-yellow-800",
    borderColor: "border-yellow-500",
  },
];

export default function OAandDSAQuestions() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-950 to-black text-white">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              OA & DSA Questions
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Comprehensive collection of Online Assessment and Data Structure & Algorithm questions from top tech companies
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Easy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Medium</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Hard</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Companies Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {companies.map((company, index) => (
            <div
              key={company.slug}
              className={`group relative overflow-hidden rounded-2xl border-2 ${company.borderColor} bg-gray-800/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                hoveredCard === index ? 'shadow-2xl' : ''
              }`}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${company.color} opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
              
              {/* Content */}
              <div className="relative z-10 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${company.color} shadow-lg`}>
                      {company.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{company.name}</h3>
                      <p className="text-gray-300 text-sm">{company.description}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    company.difficulty === "Hard" ? "bg-red-700 text-red-100" :
                    company.difficulty === "Medium" ? "bg-yellow-700 text-yellow-100" :
                    "bg-green-700 text-green-100"
                  }`}>
                    {company.difficulty}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Total Questions</span>
                    <span className="text-2xl font-bold text-white">{company.questionCount}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Difficulty Level</span>
                    <span className="text-white font-medium">{company.difficulty}</span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-8">
                  {company.slug === "goldman-sachs" ? (
                    <Link
                      href={`/oa-dsa-questions/${company.slug}`}
                      className={`w-full inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r ${company.color} hover:shadow-lg transition-all duration-200 group-hover:scale-105`}
                    >
                      <FaCode className="w-5 h-5 mr-2" />
                      View Questions
                    </Link>
                  ) : (
                    <button
                      className="w-full inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-gray-400 bg-gray-700 cursor-not-allowed"
                      disabled
                    >
                      <FaCode className="w-5 h-5 mr-2" />
                      Coming Soon
                    </button>
                  )}
                </div>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -skew-x-12"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics Section */}
      <div className="bg-gray-800/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-blue-400">323+</div>
              <div className="text-gray-300">Total Questions</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-purple-400">4</div>
              <div className="text-gray-300">Top Companies</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-pink-400">100%</div>
              <div className="text-gray-300">Real Interview Questions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/30">
          <h2 className="text-3xl font-bold mb-4 text-white">Ready to Practice?</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Start with Goldman Sachs questions and build your problem-solving skills. More companies coming soon!
          </p>
          <Link
            href="/oa-dsa-questions/goldman-sachs"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:scale-105 transition-all duration-200"
          >
            <FaCode className="w-5 h-5 mr-2" />
            Start Practicing
          </Link>
        </div>
      </div>
    </div>
  );
}
