"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, FileText, Users, CreditCard, Lock, Scale, AlertTriangle, MessageSquare, Gavel, Mail, RefreshCw, Info } from "lucide-react";
import Link from "next/link";

const sections = [
  {
    id: 1,
    title: "Eligibility",
    icon: Users,
    content: [
      "You must be at least 13 years old to use the Platform.",
      "If you are below 18, parental/guardian consent is required.",
      "By using the Platform, you confirm that you have the legal capacity to enter this agreement."
    ]
  },
  {
    id: 2,
    title: "Definitions",
    icon: FileText,
    content: [
      "<strong>Platform</strong>: The services provided by PrepSutra including the website www.prepsutra.tech, mobile app, content and tools.",
      "<strong>Courses/Content</strong>: Includes videos, notes, quizzes, assignments, tests, documents, and learning resources.",
      "<strong>User</strong>: Any individual accessing or using the Platform.",
      "<strong>Payment Instrument</strong>: UPI, cards, net banking, wallets, or any valid payment method."
    ]
  },
  {
    id: 3,
    title: "User Responsibilities",
    icon: Shield,
    content: [
      "Provide accurate registration and payment details.",
      "Keep your login credentials confidential.",
      "Use the Platform only for personal learning.",
      "Not share or distribute Platform content without our written consent.",
      "Follow applicable Indian laws."
    ]
  },
  {
    id: 4,
    title: "Prohibited Actions",
    icon: AlertTriangle,
    content: [
      "Copy, modify, reproduce, or resell content.",
      "Use bots, crawlers, or automated tools to access the Platform.",
      "Upload viruses, spam, or harmful content.",
      "Impersonate another person or misrepresent your identity.",
      "Post abusive, offensive, or misleading information.",
      "Attempt to bypass Platform security systems.",
      "<em>Violation may lead to account termination without refund.</em>"
    ],
    isProhibited: true
  },
  {
    id: 5,
    title: "Payments & Refund Policy",
    icon: CreditCard,
    content: [
      "All payments must be made through legitimate sources.",
      "Fees once paid are <strong>non-refundable</strong>, except when: the course is cancelled by us, or technical issues prevent access and are verified by us.",
      "Refund decisions are final and governed solely by PrepSutra.",
      "Fraudulent transactions may lead to legal action."
    ]
  },
  {
    id: 6,
    title: "Intellectual Property Rights",
    icon: Lock,
    content: [
      "All trademarks, content, videos, materials, and Platform design belong exclusively to PrepSutra.",
      "You receive a limited, non-transferable license for personal learning.",
      "Unauthorized copying or distribution may result in legal action."
    ]
  },
  {
    id: 7,
    title: "Limitation of Liability",
    icon: Scale,
    content: [
      "Technical failures, downtime, or interruptions.",
      "Loss of data, revenue, or indirect damages.",
      "Issues arising from third-party payment gateways.",
      "<em>Your use of the Platform is at your own risk.</em>"
    ],
    prefix: "We are not liable for:"
  },
  {
    id: 8,
    title: "User-Generated Content",
    icon: MessageSquare,
    content: [
      "You grant us rights to use and display such content.",
      "You must ensure the content does not violate laws or IP rights.",
      "We may remove content deemed inappropriate."
    ],
    prefix: "If you post comments, doubts, answers, or reviews:"
  },
  {
    id: 9,
    title: "Governing Law & Dispute Resolution",
    icon: Gavel,
    content: [
      "These Terms are governed by Indian laws.",
      "Disputes will be resolved by arbitration under the Arbitration and Conciliation Act, 1996.",
      "Arbitration will be conducted in Prayagraj in English.",
      "Courts in Uttar Pradesh will have exclusive jurisdiction."
    ]
  },
  {
    id: 10,
    title: "Grievance Redressal",
    icon: Mail,
    content: [
      "<strong>Grievance Officer</strong>: Ayush Tiwari",
      "<strong>Email</strong>: ayusht5071@gmail.com",
      "Response time: 7–15 working days."
    ]
  },
  {
    id: 11,
    title: "Modifications",
    icon: RefreshCw,
    content: [
      "We may update these Terms anytime. Continued use after updates means acceptance of revised Terms."
    ]
  },
  {
    id: 12,
    title: "Disclaimer",
    icon: Info,
    content: [
      "We do not guarantee exam results, job placements, or performance outcomes.",
      "Content is for educational purposes only.",
      "You must use your own judgment before applying concepts."
    ]
  }
];

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.1),transparent_50%)]" />
        
        <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
              <FileText className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-300">Legal Document</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Terms and Conditions
            </h1>
            
            <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-4">
              Please read these terms carefully before using the PrepSutra platform.
            </p>
            
            <p className="text-slate-500 text-sm">
              Last Updated: December 5, 2025
            </p>
          </motion.div>
        </div>
      </div>

      {/* Introduction */}
      <div className="max-w-5xl mx-auto px-4 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 rounded-2xl p-6 sm:p-8"
        >
          <p className="text-slate-300 leading-relaxed">
            By accessing or using the <strong className="text-white">PrepSutra</strong> platform ("Platform", "Website", or "App"), 
            you ("User", "you", "your") agree to be bound by these Terms and Conditions ("Terms") and our Privacy Policy. 
            If you do not agree with these Terms, you must immediately stop using the Platform.
          </p>
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
                section.isProhibited 
                  ? 'border-red-500/20 bg-red-500/5' 
                  : 'border-white/10'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${
                  section.isProhibited 
                    ? 'bg-red-500/10' 
                    : 'bg-blue-500/10'
                }`}>
                  <section.icon className={`w-6 h-6 ${
                    section.isProhibited 
                      ? 'text-red-400' 
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
                          section.isProhibited 
                            ? 'bg-red-400' 
                            : 'bg-blue-400'
                        }`} />
                        <span 
                          className="text-slate-300 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: item }}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Agreement Footer */}
      <div className="max-w-5xl mx-auto px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6 sm:p-8 text-center"
        >
          <Shield className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <p className="text-white font-semibold text-lg mb-2">
            BY USING THE PLATFORM, YOU CONFIRM THAT YOU HAVE READ AND AGREED TO THESE TERMS AND CONDITIONS.
          </p>
          <p className="text-slate-400 text-sm">
            If you have any questions, please contact us at{" "}
            <a href="mailto:ayusht5071@gmail.com" className="text-blue-400 hover:underline">
              ayusht5071@gmail.com
            </a>
          </p>
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
