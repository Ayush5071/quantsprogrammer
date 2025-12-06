"use client";
import React from "react";
import { ArrowLeft, BookOpen, Brain, Code, Database, Globe, Server, Smartphone, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const PrepareInterviewsPage = () => {
  const router = useRouter();

  const upcomingTopics = [
    {
      title: "Operating Systems",
      icon: <Server className="w-6 h-6" />,
      description: "Process, Threads, Memory Management, File Systems",
      color: "from-blue-500 to-cyan-500",
      comingSoon: false,
      link: "/prepare-interviews/operating-systems"
    },
    {
      title: "Data Structures & Algorithms",
      icon: <Code className="w-6 h-6" />,
      description: "Arrays, Trees, Graphs, Dynamic Programming",
      color: "from-green-500 to-emerald-500",
      comingSoon: true
    },
    {
      title: "Database Management",
      icon: <Database className="w-6 h-6" />,
      description: "SQL, NoSQL, Transactions, Indexing",
      color: "from-purple-500 to-violet-500",
      comingSoon: true
    },
    {
      title: "Computer Networks",
      icon: <Globe className="w-6 h-6" />,
      description: "TCP/IP, HTTP, DNS, Network Security",
      color: "from-orange-500 to-red-500",
      comingSoon: true
    },
    {
      title: "System Design",
      icon: <Brain className="w-6 h-6" />,
      description: "Scalability, Load Balancing, Microservices",
      color: "from-pink-500 to-rose-500",
      comingSoon: true
    },
    {
      title: "Object Oriented Programming",
      icon: <BookOpen className="w-6 h-6" />,
      description: "Inheritance, Polymorphism, Design Patterns",
      color: "from-indigo-500 to-blue-500",
      comingSoon: true
    },
    {
      title: "Web Development",
      icon: <Globe className="w-6 h-6" />,
      description: "Frontend, Backend, APIs, Security",
      color: "from-teal-500 to-green-500",
      comingSoon: true
    },
    {
      title: "Mobile Development",
      icon: <Smartphone className="w-6 h-6" />,
      description: "Android, iOS, React Native, Flutter",
      color: "from-yellow-500 to-orange-500",
      comingSoon: true
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Subtle background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(99,102,241,0.06),transparent_50%)]" />
      </div>

      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2 text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline text-sm">Back</span>
            </button>
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                Prepare for Interviews
              </h1>
              <p className="text-gray-500 text-sm mt-0.5 hidden sm:block">
                Master technical concepts for product-based company interviews
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-5">
            <Zap className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">Interview Preparation Hub</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Get Ready for Your Dream Job
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            Comprehensive interview preparation materials covering all essential topics for software engineering roles at top product companies.
          </p>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {upcomingTopics.map((topic, index) => (
            <div key={index} className="group">
              {topic.comingSoon ? (
                <div className="bg-[#111118] border border-white/5 rounded-xl p-5 h-full flex flex-col transition-all hover:border-white/10 opacity-60">
                  <div className={`p-3 bg-gradient-to-r ${topic.color} rounded-lg w-fit mb-4 opacity-50`}>
                    {topic.icon}
                  </div>
                  <h3 className="text-base font-semibold text-white mb-1.5">{topic.title}</h3>
                  <p className="text-gray-500 text-sm mb-4 flex-1 line-clamp-2">{topic.description}</p>
                  <div className="inline-flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-3 py-1.5 w-fit">
                    <Zap className="w-3.5 h-3.5 text-yellow-500" />
                    <span className="text-yellow-500 text-xs font-medium">Coming Soon</span>
                  </div>
                </div>
              ) : (
                <Link href={topic.link!}>
                  <div className="bg-[#111118] border border-white/5 rounded-xl p-5 h-full flex flex-col transition-all hover:border-blue-500/30 hover:bg-[#13131a] group-hover:shadow-lg group-hover:shadow-blue-500/5">
                    <div className={`p-3 bg-gradient-to-r ${topic.color} rounded-lg w-fit mb-4 transition-transform group-hover:scale-105`}>
                      {topic.icon}
                    </div>
                    <h3 className="text-base font-semibold text-white mb-1.5 group-hover:text-blue-400 transition-colors">
                      {topic.title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-4 flex-1 line-clamp-2">{topic.description}</p>
                    <div className="inline-flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1.5 w-fit">
                      <BookOpen className="w-3.5 h-3.5 text-green-500" />
                      <span className="text-green-500 text-xs font-medium">Available Now</span>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-12 bg-[#111118] border border-white/5 rounded-xl p-6 sm:p-8">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-white mb-1">What You'll Get</h3>
            <p className="text-gray-500 text-sm">Complete preparation materials for technical interviews</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#0a0a0f] border border-white/5 rounded-lg p-5 text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">500+</div>
              <div className="text-gray-300 text-sm">Interview Questions</div>
              <div className="text-gray-600 text-xs mt-0.5">With detailed solutions</div>
            </div>
            
            <div className="bg-[#0a0a0f] border border-white/5 rounded-lg p-5 text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">8</div>
              <div className="text-gray-300 text-sm">Core Topics</div>
              <div className="text-gray-600 text-xs mt-0.5">Essential for SDE roles</div>
            </div>
            
            <div className="bg-[#0a0a0f] border border-white/5 rounded-lg p-5 text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">24/7</div>
              <div className="text-gray-300 text-sm">Access</div>
              <div className="text-gray-600 text-xs mt-0.5">Study at your own pace</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8 text-center">
          <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-xl p-6 sm:p-8">
            <h3 className="text-xl font-bold text-white mb-3">Ready to Start Your Journey?</h3>
            <p className="text-gray-400 text-sm mb-5 max-w-xl mx-auto">
              Begin with Operating Systems - our most comprehensive topic covering everything from basic concepts to advanced interview questions.
            </p>
            <Link
              href="/prepare-interviews/operating-systems"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-medium rounded-lg transition-all"
            >
              <BookOpen className="w-4 h-4" />
              Start with Operating Systems
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrepareInterviewsPage;
