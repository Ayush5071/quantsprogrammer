import React from "react";

const features = [
  {
    icon: "🗺️",
    title: "Curated Roadmaps",
    description: "Step-by-step learning paths for every stack, crafted by experts and always up-to-date.",
  },
  {
    icon: "📈",
    title: "Progress Tracking",
    description: "Mark tasks, save your journey, and unlock achievements as you grow.",
  },
  {
    icon: "🤝",
    title: "Community Support",
    description: "Connect, discuss, and grow with fellow learners and mentors in a vibrant community.",
  },
  {
    icon: "✨",
    title: "Personalized Suggestions",
    description: "Get smart recommendations for resources and next steps tailored to your goals.",
  },
];

export default function KeyFeatures() {
  return (
    <section className="w-full py-16 px-4 md:px-0 flex flex-col items-center">
      <h2 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent mb-8 text-center">
        Key Features
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="flex items-start gap-4 bg-zinc-900/60 border-2 border-dashed border-blue-700/40 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-200"
          >
            <div className="text-4xl md:text-5xl mt-1 text-blue-300 drop-shadow-lg">
              {feature.icon}
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold text-blue-200 mb-1">
                {feature.title}
              </h3>
              <p className="text-zinc-300 text-base md:text-lg">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
