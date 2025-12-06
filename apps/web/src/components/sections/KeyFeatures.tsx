import React from "react";

const features = [
  {
    icon: "🗺️",
    title: "Interactive Learning Roadmaps",
    description: "Expert-crafted learning paths for frontend, backend, full-stack, and specialized roles. Track progress with checkpoints, complete practical tasks, and earn certificates upon completion.",
    highlight: "Progress Tracking & Certificates",
  },
  {
    icon: "🤖",
    title: "AI-Powered Mock Interviews",
    description: "Practice with intelligent AI interviews featuring real-time feedback, speech-to-text, text-to-speech, and performance analytics for authentic interview preparation experience.",
    highlight: "Gemini AI Integration",
  },
  {
    icon: "🏆",
    title: "Competitive Interview Challenges",
    description: "Compete in curated Top Interview challenges, climb global leaderboards, and showcase your problem-solving skills with detailed performance analytics and rankings.",
    highlight: "Global Leaderboards",
  },
  {
    icon: "📝",
    title: "Professional Blog Platform",
    description: "Write and publish technical blogs with a Medium-style rich text editor. Request publishing access, build your developer brand, and share knowledge with the community.",
    highlight: "Rich Text Editor & Publishing",
  },
  {
    icon: "👤",
    title: "Comprehensive Profile Dashboard",
    description: "Track all your progress, interview history, certificates, blog analytics, and achievements in one personalized dashboard with detailed learning insights.",
    highlight: "Complete Progress Analytics",
  },
  {
    icon: "🎓",
    title: "Beautiful Digital Certificates",
    description: "Earn stunning, shareable certificates upon completing roadmaps. Canvas-generated with your details, perfect for LinkedIn, resume, and showcasing achievements professionally.",
    highlight: "Canvas-Generated & Shareable",
  },
  {
    icon: "🔊",
    title: "Voice-Enabled Interviews",
    description: "Experience realistic interviews with text-to-speech question delivery and speech-to-text answer input using Web Speech API for natural conversation flow.",
    highlight: "Natural Conversation Flow",
  },
  {
    icon: "📊",
    title: "Advanced Analytics & Insights",
    description: "Get comprehensive feedback on interview performance, learning progress, time tracking, skill assessments, and personalized AI-generated recommendations for improvement.",
    highlight: "AI-Generated Feedback",
  },
];

export default function KeyFeatures() {
  return (
    <section className="w-full py-20 px-4 md:px-8 flex flex-col items-center relative overflow-hidden">
      <div className="relative z-10 w-full max-w-7xl">
        <h2 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent mb-4 text-center drop-shadow-lg">
          Platform Features
        </h2>
        <p className="text-lg md:text-xl text-zinc-300 text-center max-w-3xl mx-auto mb-12 font-medium">
          Everything you need to accelerate your developer journey in one comprehensive platform
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative bg-white/5 backdrop-blur-lg border border-white/10 hover:border-white/20 rounded-2xl p-6 shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 hover:scale-[1.05] hover:-translate-y-2"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Glassmorphism glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl"></div>
              
              <div className="relative z-10">
                <div className="text-4xl md:text-5xl mb-4 text-center drop-shadow-2xl transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-3 text-center group-hover:text-purple-300 transition-colors duration-300">
                  {feature.title}
                </h3>
                <div className="text-xs font-semibold text-purple-300 text-center mb-4 px-3 py-1 bg-purple-500/30 backdrop-blur-sm rounded-full border border-purple-400/30">
                  {feature.highlight}
                </div>
                <p className="text-zinc-300 text-sm md:text-base leading-relaxed text-center group-hover:text-zinc-200 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="relative z-10 mt-16 text-center">
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 max-w-4xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Accelerate Your Developer Journey?
          </h3>
          <p className="text-lg text-zinc-300 mb-6 max-w-2xl mx-auto">
            Join thousands of developers who are already using Dev Roadmap to level up their skills, 
            practice interviews, and build impressive portfolios.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.location.href = '/auth/signup'}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl backdrop-blur-sm"
            >
              Get Started Free
            </button>
            <button 
              onClick={() => window.location.href = '/explore'}
              className="px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-all duration-200"
            >
              Explore Roadmaps
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
