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
      icon: <Server className="w-8 h-8" />,
      description: "Process, Threads, Memory Management, File Systems",
      color: "from-blue-500 to-cyan-500",
      comingSoon: false,
      link: "/prepare-interviews/operating-systems"
    },
    {
      title: "Data Structures & Algorithms",
      icon: <Code className="w-8 h-8" />,
      description: "Arrays, Trees, Graphs, Dynamic Programming",
      color: "from-green-500 to-emerald-500",
      comingSoon: true
    },
    {
      title: "Database Management",
      icon: <Database className="w-8 h-8" />,
      description: "SQL, NoSQL, Transactions, Indexing",
      color: "from-purple-500 to-violet-500",
      comingSoon: true
    },
    {
      title: "Computer Networks",
      icon: <Globe className="w-8 h-8" />,
      description: "TCP/IP, HTTP, DNS, Network Security",
      color: "from-orange-500 to-red-500",
      comingSoon: true
    },
    {
      title: "System Design",
      icon: <Brain className="w-8 h-8" />,
      description: "Scalability, Load Balancing, Microservices",
      color: "from-pink-500 to-rose-500",
      comingSoon: true
    },
    {
      title: "Object Oriented Programming",
      icon: <BookOpen className="w-8 h-8" />,
      description: "Inheritance, Polymorphism, Design Patterns",
      color: "from-indigo-500 to-blue-500",
      comingSoon: true
    },
    {
      title: "Web Development",
      icon: <Globe className="w-8 h-8" />,
      description: "Frontend, Backend, APIs, Security",
      color: "from-teal-500 to-green-500",
      comingSoon: true
    },
    {
      title: "Mobile Development",
      icon: <Smartphone className="w-8 h-8" />,
      description: "Android, iOS, React Native, Flutter",
      color: "from-yellow-500 to-orange-500",
      comingSoon: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900">
      {/* Header with Back Button */}
      <div className="bg-white/5 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors flex items-center gap-2 text-zinc-300 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Prepare for Interviews
              </h1>
              <p className="text-zinc-300 mt-2">
                Master technical concepts for product-based company interviews
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-full px-6 py-3 mb-6">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span className="text-purple-300 font-medium">Interview Preparation Hub</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Get Ready for Your Dream Job
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Comprehensive interview preparation materials covering all essential topics for software engineering roles at top product companies.
          </p>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {upcomingTopics.map((topic, index) => (
            <div
              key={index}
              className={`relative group ${
                topic.comingSoon ? 'cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              {topic.comingSoon ? (
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 h-full flex flex-col transition-all duration-300 hover:border-white/20 opacity-75">
                  <div className={`p-4 bg-gradient-to-r ${topic.color} rounded-xl w-fit mb-4 opacity-60`}>
                    {topic.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{topic.title}</h3>
                  <p className="text-zinc-400 text-sm mb-4 flex-1">{topic.description}</p>
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-full px-4 py-2 w-fit">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-300 text-sm font-medium">Coming Soon</span>
                  </div>
                </div>
              ) : (
                <Link href={topic.link!}>
                  <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 h-full flex flex-col transition-all duration-300 hover:border-white/20 hover:bg-white/10 group-hover:scale-105">
                    <div className={`p-4 bg-gradient-to-r ${topic.color} rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform`}>
                      {topic.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                      {topic.title}
                    </h3>
                    <p className="text-zinc-400 text-sm mb-4 flex-1">{topic.description}</p>
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-full px-4 py-2 w-fit">
                      <BookOpen className="w-4 h-4 text-green-400" />
                      <span className="text-green-300 text-sm font-medium">Available Now</span>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">What You'll Get</h3>
            <p className="text-zinc-400">Complete preparation materials for technical interviews</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-xl p-6">
                <div className="text-3xl font-bold text-blue-400 mb-2">500+</div>
                <div className="text-zinc-300">Interview Questions</div>
                <div className="text-zinc-500 text-sm mt-1">With detailed solutions</div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-xl p-6">
                <div className="text-3xl font-bold text-green-400 mb-2">8</div>
                <div className="text-zinc-300">Core Topics</div>
                <div className="text-zinc-500 text-sm mt-1">Essential for SDE roles</div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-6">
                <div className="text-3xl font-bold text-purple-400 mb-2">24/7</div>
                <div className="text-zinc-300">Access</div>
                <div className="text-zinc-500 text-sm mt-1">Study at your own pace</div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Start Your Journey?</h3>
            <p className="text-zinc-400 mb-6 max-w-2xl mx-auto">
              Begin with Operating Systems - our most comprehensive topic covering everything from basic concepts to advanced interview questions asked at top tech companies.
            </p>
            <Link
              href="/prepare-interviews/operating-systems"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <BookOpen className="w-5 h-5" />
              Start with Operating Systems
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrepareInterviewsPage;
