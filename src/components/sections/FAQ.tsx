import React from "react";

const faqData = [
  {
    question: "What is Dev Roadmap and how does it work?",
    answer:
      "Dev Roadmap is a comprehensive platform that combines structured learning roadmaps, AI-powered mock interviews, blog publishing, and progress tracking. You follow expert-crafted roadmaps, practice interviews with AI feedback, write technical blogs, and earn certificates—all in one integrated platform designed to accelerate your developer journey.",
  },
  {
    question: "Is Dev Roadmap free to use?",
    answer:
      "Yes! All core features including roadmaps, AI interviews, progress tracking, and certificates are completely free. You just need to create an account to access personalized features, track your progress, and start earning certificates immediately.",
  },
  {
    question: "How do the AI mock interviews work?",
    answer:
      "Our AI interviews use Google's Gemini AI to provide realistic interview experiences with voice and text capabilities. You can answer questions via typing or voice input, get instant detailed feedback with scoring, and track your performance over time. The AI adapts questions based on your roadmap progress and skill level.",
  },
  {
    question: "Can I earn real certificates from completing roadmaps?",
    answer:
      "Absolutely! Upon completing any roadmap, you'll receive a beautiful, shareable digital certificate generated using Canvas API. These certificates include your name, completion date, roadmap details, and can be downloaded in high resolution or shared directly to LinkedIn, resume, or portfolio.",
  },
  {
    question: "How do I publish blogs on the platform?",
    answer:
      "First, request blog publishing access from your profile dashboard. Once approved by an admin (usually within 24 hours), you can write and publish technical blogs using our rich text editor similar to Medium. This helps build your developer brand and showcase your expertise to the community.",
  },
  {
    question: "What are Top Interviews and leaderboards?",
    answer:
      "Top Interviews are curated, challenging interview questions created by admins that feature competitive leaderboards. Unlike mock interviews focused on practice, these are designed for competition where you can rank against other users, showcase your skills, and climb the global leaderboard.",
  },
  {
    question: "Are the roadmaps updated with latest technologies?",
    answer:
      "Yes! Our team of experienced developers regularly updates roadmaps with the latest technologies, best practices, and industry trends. We also incorporate user feedback and ensure content stays relevant to current job market demands and emerging technologies.",
  },
  {
    question: "How comprehensive is the progress tracking?",
    answer:
      "Your profile dashboard provides detailed analytics including completed roadmap tasks with timestamps, interview history with performance scores, published blogs with views, earned certificates, overall learning streaks, and personalized recommendations for improvement.",
  },
  {
    question: "Can I use the certificates for job applications?",
    answer:
      "Yes! Our certificates are designed to be professional and showcase real skill development. Many users add them to their LinkedIn profiles, resumes, and portfolios. While they're not accredited certifications, they demonstrate practical learning and commitment to continuous improvement.",
  },
  {
    question: "What makes Dev Roadmap different from other learning platforms?",
    answer:
      "Dev Roadmap uniquely combines four essential aspects of developer growth: structured learning paths, realistic AI interview practice, professional blog publishing, and comprehensive progress tracking. Most platforms focus on just one area, but we provide a complete ecosystem for career development.",
  },
];

const FAQ = () => (
  <section className="w-full py-16 px-4 md:px-8 relative overflow-hidden">
    {/* Enhanced Background Effects - matching main page style */}
    <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-900 to-black"></div>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_50%)]"></div>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(37,99,235,0.12),transparent_50%)]"></div>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(29,78,216,0.08),transparent_70%)]"></div>
    
    {/* Animated Grid Pattern - matching main page */}
    <div className="absolute inset-0 opacity-20">
      <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)]"></div>
    </div>
    
    <div className="max-w-6xl mx-auto relative z-10">
      <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent text-center mb-4">
        Frequently Asked Questions
      </h2>
      <p className="text-lg text-zinc-300 text-center mb-12 max-w-2xl mx-auto">
        Everything you need to know about Dev Roadmap's features and how to get started
      </p>
      <div className="space-y-6">
        {faqData.map((faq, idx) => (
          <details
            key={idx}
            className="group bg-white/5 backdrop-blur-lg border border-white/10 hover:border-white/20 rounded-2xl p-6 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
          >
            <summary className="cursor-pointer text-lg md:text-xl font-bold text-white flex items-center justify-between hover:text-blue-300 transition-colors">
              {faq.question}
              <span className="ml-4 text-blue-400 group-open:rotate-180 transition-transform duration-300 bg-white/10 rounded-full p-2 backdrop-blur-sm">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
            </summary>
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-zinc-300 text-base md:text-lg leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </details>
        ))}
      </div>
      
      <div className="text-center mt-12">
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 max-w-md mx-auto">
          <p className="text-zinc-400 mb-4">Still have questions?</p>
          <button 
            onClick={() => window.location.href = '/contact-support'}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-900 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  </section>
);

export default FAQ;
