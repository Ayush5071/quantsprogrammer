import React from "react";
import { motion } from "framer-motion";

function PricingCard({ label, price, subtitle, highlight, features, ideal, note, accent }: {
  label: string;
  price: string;
  subtitle: string;
  highlight: string;
  features: string[];
  ideal: string;
  note?: string;
  accent: "blue" | "purple";
}) {
  const accentClasses = accent === "blue"
    ? "from-blue-500/40 to-cyan-400/40 text-blue-300"
    : "from-purple-500/40 to-pink-400/40 text-purple-300";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative rounded-2xl bg-[#0b0b13] border border-white/10 p-6 shadow-xl overflow-hidden"
    >
      <div className={`absolute -top-20 right-[-40%] h-40 w-56 bg-gradient-to-r ${accentClasses} opacity-40 blur-3xl`} />
      <div className="relative z-10">
        <h3 className="text-lg font-semibold mb-1">{label}</h3>
        <p className="text-[11px] text-gray-400 mb-4">{highlight}</p>
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-2xl font-bold">{price}</span>
          <span className="text-xs text-gray-400">{subtitle}</span>
        </div>
        <ul className="text-xs text-gray-200 space-y-1.5 mb-4">
          {features.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-[2px] text-[10px]">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="text-[11px] text-gray-300 mb-2">
          <span className="font-semibold">Ideal for:</span> {ideal}
        </p>
        {note && (
          <p className="text-[10px] text-gray-400 italic">{note}</p>
        )}
      </div>
    </motion.div>
  );
}

export default function PricingSection() {
  return (
    <section id="pricing" className="w-full px-4 py-16 bg-[#05050a]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl font-bold mb-3 text-green-400">Pricing</h2>
          <p className="text-gray-300 text-sm sm:text-base">
            Transparent, value-driven pricing. These are <span className="font-semibold text-gray-100">starting prices</span> — final quotes depend on pages, features, and complexity.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          <PricingCard
            label="Basic Static Websites"
            price="₹2,499"
            subtitle="starting price"
            highlight="Perfect for portfolios and simple brand sites."
            features={[
              "Modern, responsive UI",
              "Up to 5 pages",
              "Smooth navigation & basic animations",
              "Static contact / enquiry forms",
              "SEO-friendly structure",
            ]}
            ideal="Personal portfolios, school / college intro sites, business profiles, event pages."
            accent="blue"
          />
          <PricingCard
            label="Dynamic Websites & Web Apps"
            price="₹7,999"
            subtitle="starting price"
            highlight="For serious businesses that need real functionality."
            features={[
              "Full-stack: front-end + back-end",
              "Database & API integration",
              "Admin panel (if required)",
              "Auth / login systems if needed",
              "Scalable architecture for growth",
            ]}
            ideal="E-commerce, e-learning, dashboards, booking systems, SaaS, and any custom app."
            note="Domain, hosting, and database charges are additional and depend on your provider & usage."
            accent="purple"
          />
        </div>
        <div className="mt-10 text-center max-w-2xl mx-auto text-sm text-gray-300">
          <p className="font-semibold text-blue-300">We can build anything you imagine.</p>
          <p className="mt-2">For specialized or large-scale projects, we hire or collaborate with professional teams dedicated to your project to ensure top-tier quality and performance.</p>
        </div>
      </div>
    </section>
  );
}
