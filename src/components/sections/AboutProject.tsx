import React from "react";

const features = [
  {
    title: "Comprehensive Roadmaps",
    description: "Step-by-step guides for developers at every stage, from beginner to advanced, tailored for modern tech stacks.",
    icon: "🗺️",
  },
  {
    title: "Expert-Curated Content",
    description: "All resources and paths are reviewed by industry professionals to ensure accuracy and relevance.",
    icon: "🎓",
  },
  {
    title: "Community Driven",
    description: "Contribute, discuss, and grow with a vibrant developer community. Share your own roadmaps and insights.",
    icon: "🤝",
  },
];

export default function AboutProject() {
  return (
    <section className="w-full py-16 px-4 md:px-0 bg-gradient-to-br from-blue-950 via-blue-900 to-neutral-950 flex flex-col items-center">
      <h2 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-6 text-center">
        What is Dev Roadmap?
      </h2>
      <p className="max-w-2xl text-lg md:text-xl text-neutral-200 mb-10 text-center">
        Dev Roadmap is your all-in-one platform for structured developer growth. Whether you’re just starting out or looking to master new technologies, our curated roadmaps, resources, and community support help you achieve your goals efficiently.
      </p>
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl justify-center">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="flex-1 bg-zinc-900 border border-blue-700 rounded-2xl shadow-xl p-6 flex flex-col items-center text-center hover:scale-105 transition-transform duration-200"
          >
            <div className="text-4xl mb-3">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-blue-300 mb-2">
              {feature.title}
            </h3>
            <p className="text-neutral-300 text-base md:text-lg">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
