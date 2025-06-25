import React from "react";

const faqData = [
  {
    question: "What is Dev Roadmap?",
    answer:
      "Dev Roadmap is a platform to help developers navigate their learning journey with curated roadmaps, interview prep, and community support.",
  },
  {
    question: "Is Dev Roadmap free to use?",
    answer:
      "Yes, all core features are free for everyone. Some advanced features may require sign-in.",
  },
  {
    question: "How can I contribute?",
    answer:
      "You can contribute by sharing feedback, submitting blog posts, or supporting us via 'Buy Me a Coffee'.",
  },
  {
    question: "Are the interview questions updated regularly?",
    answer:
      "Yes, our team and community regularly update the interview questions and roadmaps.",
  },
];

const FAQ = () => (
  <section className="w-full max-w-3xl mx-auto py-12 px-4 md:px-0">
    <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Frequently Asked Questions</h2>
    <div className="space-y-4">
      {faqData.map((faq, idx) => (
        <details
          key={idx}
          className="group border border-gray-300 rounded-lg p-4 transition-all duration-200 hover:shadow-md"
        >
          <summary className="cursor-pointer text-lg font-semibold flex items-center justify-between">
            {faq.question}
            <span className="ml-2 text-indigo-500 group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <p className="mt-2 text-gray-200 text-base leading-relaxed">{faq.answer}</p>
        </details>
      ))}
    </div>
  </section>
);

export default FAQ;
