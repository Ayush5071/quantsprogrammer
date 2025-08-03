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
    available: true,
  },
  {
    name: "Wells Fargo",
    slug: "wells-fargo-pyq",
    description: "Banking, financial services, and DSA/OA questions",
    questionCount: 15,
    difficulty: "Medium",
    icon: <img src="/official_logo.png" alt="Wells Fargo" className="w-8 h-8 rounded-full bg-white p-1" />,
    color: "from-yellow-700 to-red-700",
    borderColor: "border-yellow-600",
    available: true,
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
    available: false,
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
    available: false,
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
    available: false,
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

      {/* Companies Grid - Responsive: 1 card/row mobile, 2 on md, 3 on lg+ */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {companies.map((company, index) => (
            <div
              key={company.slug}
              className={`group relative overflow-hidden rounded-2xl border-2 ${company.borderColor} bg-gray-900/60 backdrop-blur-lg shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                hoveredCard === index ? 'shadow-2xl' : ''
              }`}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Animated Gradient Border */}
              <div className={`absolute inset-0 bg-gradient-to-br ${company.color} opacity-30 group-hover:opacity-50 transition-opacity duration-300 blur-[2px]`}></div>

              {/* Content */}
              <div className="relative z-10 p-8 flex flex-col items-center gap-6">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${company.color} shadow-lg flex-shrink-0 flex items-center justify-center`}>
                  {company.icon}
                </div>
                <div className="flex-1 w-full">
                  <h3 className="text-2xl font-extrabold text-white mb-2 flex items-center gap-2">
                    {company.name}
                    {company.available && <span className="ml-2 px-2 py-1 text-xs rounded-full bg-green-700 text-green-100 font-semibold">Live</span>}
                  </h3>
                  <p className="text-gray-300 text-base mb-3">{company.description}</p>
                  <div className="flex flex-wrap gap-4 mb-3">
                    <div className="flex flex-col items-start">
                      <span className="text-gray-400 text-xs">Total Questions</span>
                      <span className="text-xl font-bold text-white">{company.questionCount}</span>
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-gray-400 text-xs">Difficulty</span>
                      <span className={`font-semibold text-base ${
                        company.difficulty === "Hard" ? "text-red-400" :
                        company.difficulty === "Medium" ? "text-yellow-300" :
                        "text-green-300"
                      }`}>{company.difficulty}</span>
                    </div>
                  </div>
                  {/* Action Button */}
                  <div className="mt-2">
                    {company.available ? (
                      <Link
                        href={`/oa-dsa-questions/${company.slug}`}
                        className={`w-full inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r ${company.color} hover:shadow-lg transition-all duration-200 group-hover:scale-105 text-base`}
                      >
                        <FaCode className="w-5 h-5 mr-2" />
                        View Questions
                      </Link>
                    ) : (
                      <button
                        className="w-full inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold text-gray-400 bg-gray-700 cursor-not-allowed text-base"
                        disabled
                      >
                        <FaCode className="w-5 h-5 mr-2" />
                        Coming Soon
                      </button>
                    )}
                  </div>
                </div>
              </div>
              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -skew-x-12 pointer-events-none"></div>
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
