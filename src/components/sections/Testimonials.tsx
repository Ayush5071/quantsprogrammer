import React from "react";

const testimonials = [
  {
    name: "Priya S.",
    role: "Frontend Developer",
    quote:
      "Dev Roadmap helped me land my first job! The interview prep and clear roadmaps made all the difference.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Rahul K.",
    role: "Full Stack Engineer",
    quote:
      "The Top Interviews feature is a game changer. Practicing real questions boosted my confidence.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Aisha M.",
    role: "CS Student",
    quote:
      "I love the clean UI and the community support. Dev Roadmap is my go-to resource for learning.",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

const Testimonials = () => (
  <section className="w-full max-w-5xl mx-auto py-12 px-4 md:px-0">
    <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">What Our Users Say</h2>
    <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
      {testimonials.map((t, idx) => (
        <div
          key={idx}
          className="flex-1 border border-gray-300 rounded-xl p-6 flex flex-col items-center shadow-sm hover:shadow-lg transition-shadow duration-200"
        >
          <img
            src={t.avatar}
            alt={t.name}
            className="w-20 h-20 rounded-full mb-4 object-cover border-4 border-indigo-500"
          />
          <blockquote className="text-lg italic text-gray-200 text-center mb-4">“{t.quote}”</blockquote>
          <div className="text-indigo-400 font-semibold">{t.name}</div>
          <div className="text-gray-400 text-sm">{t.role}</div>
        </div>
      ))}
    </div>
  </section>
);

export default Testimonials;
