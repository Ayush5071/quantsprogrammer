"use client";

import React from "react";
import { motion } from "framer-motion";
import { Truck, Package, Clock, Globe, Zap, Monitor, Mail, CheckCircle, Info } from "lucide-react";
import Link from "next/link";

const sections = [
  {
    id: 1,
    title: "Digital Product Delivery",
    icon: Zap,
    content: [
      "PrepSutra is a <strong>100% digital platform</strong> offering online courses, tests, and learning resources.",
      "All products are delivered <strong>electronically</strong> - no physical shipping is involved.",
      "Upon successful payment, access is granted <strong>instantly</strong> to your account.",
      "You can access your purchased content immediately after payment confirmation."
    ]
  },
  {
    id: 2,
    title: "Instant Access",
    icon: Clock,
    isHighlighted: true,
    content: [
      "Digital content is available <strong>immediately</strong> after successful payment.",
      "No waiting time - start learning right away!",
      "Access is provided 24/7 from any device with internet connection.",
      "Content is accessible for the duration specified in the course/subscription."
    ]
  },
  {
    id: 3,
    title: "How to Access Your Purchase",
    icon: Monitor,
    content: [
      "Log in to your PrepSutra account at <strong>www.prepsutra.tech</strong>.",
      "Navigate to your Dashboard or Profile section.",
      "All purchased courses and content will be visible under 'My Courses' or 'My Learning'.",
      "Click on any course to start learning immediately.",
      "Progress is automatically saved and synced across devices."
    ]
  },
  {
    id: 4,
    title: "Delivery Confirmation",
    icon: CheckCircle,
    content: [
      "You will receive an <strong>email confirmation</strong> upon successful purchase.",
      "The email contains your order details and access instructions.",
      "A receipt/invoice is sent to your registered email address.",
      "You can also view purchase history in your account settings."
    ]
  },
  {
    id: 5,
    title: "Global Accessibility",
    icon: Globe,
    content: [
      "Our digital content is accessible <strong>worldwide</strong>.",
      "No geographic restrictions on content delivery.",
      "Access from any country with stable internet connection.",
      "Content is optimized for various internet speeds."
    ]
  },
  {
    id: 6,
    title: "Technical Requirements",
    icon: Package,
    content: [
      "A stable internet connection (minimum 2 Mbps recommended).",
      "Modern web browser (Chrome, Firefox, Safari, Edge - latest versions).",
      "Desktop, laptop, tablet, or smartphone.",
      "JavaScript and cookies must be enabled in your browser."
    ],
    prefix: "To access your content, you need:"
  },
  {
    id: 7,
    title: "Delivery Issues",
    icon: Info,
    content: [
      "If you don't see your content within <strong>15 minutes</strong> of payment, refresh your browser and re-login.",
      "Check your spam/junk folder for confirmation emails.",
      "Clear browser cache and cookies if experiencing issues.",
      "Contact support if access is not granted within 1 hour of payment."
    ],
    note: "Most delivery issues are resolved by simply logging out and logging back in."
  }
];

export default function ShippingPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_50%)]" />
        
        <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full mb-6">
              <Truck className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-300">Delivery Information</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Shipping & Delivery Policy
            </h1>
            
            <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-4">
              Learn how your digital purchases are delivered on PrepSutra.
            </p>
            
            <p className="text-slate-500 text-sm">
              Last Updated: December 5, 2025
            </p>
          </motion.div>
        </div>
      </div>

      {/* Digital Notice */}
      <div className="max-w-5xl mx-auto px-4 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6 sm:p-8"
        >
          <div className="flex items-start gap-4">
            <Zap className="w-8 h-8 text-green-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-white font-semibold text-lg mb-2">100% Digital Delivery</h3>
              <p className="text-slate-300 leading-relaxed">
                <strong className="text-white">PrepSutra</strong> exclusively offers <strong className="text-green-400">digital products</strong>. 
                All courses, tests, and learning materials are delivered electronically through our platform. 
                There is <strong>no physical shipping</strong> - enjoy instant access to your purchases!
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Sections */}
      <div className="max-w-5xl mx-auto px-4 pb-16">
        <div className="space-y-6">
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
              className={`bg-slate-900/50 border rounded-2xl p-6 sm:p-8 ${
                section.isHighlighted 
                  ? 'border-green-500/30 bg-green-500/5' 
                  : 'border-white/10'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${
                  section.isHighlighted 
                    ? 'bg-green-500/10' 
                    : 'bg-blue-500/10'
                }`}>
                  <section.icon className={`w-6 h-6 ${
                    section.isHighlighted 
                      ? 'text-green-400' 
                      : 'text-blue-400'
                  }`} />
                </div>
                
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-white mb-4">
                    {section.id}. {section.title}
                  </h2>
                  
                  {section.prefix && (
                    <p className="text-slate-400 mb-3">{section.prefix}</p>
                  )}
                  
                  <ul className="space-y-3">
                    {section.content.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className={`mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                          section.isHighlighted 
                            ? 'bg-green-400' 
                            : 'bg-blue-400'
                        }`} />
                        <span 
                          className="text-slate-300 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: item }}
                        />
                      </li>
                    ))}
                  </ul>
                  
                  {section.note && (
                    <p className="mt-4 text-sm text-slate-400 italic bg-slate-800/50 p-3 rounded-lg">
                      💡 {section.note}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="max-w-5xl mx-auto px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 rounded-2xl p-6 sm:p-8 text-center"
        >
          <Mail className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h3 className="text-white font-semibold text-xl mb-2">Having Trouble Accessing Your Content?</h3>
          <p className="text-slate-400 mb-4">
            If you're experiencing any issues with accessing your purchased content, our support team is here to help.
          </p>
          <a 
            href="mailto:ayusht5071@gmail.com" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors"
          >
            <Mail className="w-4 h-4" />
            ayusht5071@gmail.com
          </a>
        </motion.div>
      </div>

      {/* Back to Home */}
      <div className="max-w-5xl mx-auto px-4 pb-16 text-center">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
