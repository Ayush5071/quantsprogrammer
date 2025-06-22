import React from "react";

const reasons = [
  {
    title: "Modern & Intuitive UI",
    description: "Enjoy a seamless, responsive experience on any device, with a design that’s both beautiful and functional.",
    icon: "✨",
  },
  {
    title: "Always Up-to-Date",
    description: "We constantly update our roadmaps and resources to reflect the latest industry trends and best practices.",
    icon: "🔄",
  },
  {
    title: "Personalized Progress",
    description: "Track your learning, bookmark resources, and customize your journey to fit your unique goals.",
    icon: "📈",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="w-full py-16 px-4 md:px-0 bg-gradient-to-br from-blue-950 via-blue-900 to-neutral-950 flex flex-col items-center">
      <h2 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 mb-6 text-center">
        Why Choose Dev Roadmap?
      </h2>
      <p className="max-w-2xl text-lg md:text-xl text-neutral-200 mb-10 text-center">
        We’re committed to making developer growth accessible, enjoyable, and effective. Here’s why thousands of learners trust Dev Roadmap for their tech journey:
      </p>
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl justify-center">
        {reasons.map((reason) => (
          <div
            key={reason.title}
            className="flex-1 bg-zinc-900 border border-purple-700 rounded-2xl shadow-xl p-6 flex flex-col items-center text-center hover:scale-105 transition-transform duration-200"
          >
            <div className="text-4xl mb-3">{reason.icon}</div>
            <h3 className="text-xl font-semibold text-purple-300 mb-2">
              {reason.title}
            </h3>
            <p className="text-neutral-300 text-base md:text-lg">
              {reason.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
