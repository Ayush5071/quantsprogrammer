"use client";

import React from "react";
import { motion } from "framer-motion";
import { CreditCard, XCircle, AlertTriangle, CheckCircle, HelpCircle, Mail, FileText } from "lucide-react";
import Link from "next/link";

const sections = [
  {
    id: 1,
    title: "General Policy",
    icon: FileText,
    content: [
      "All purchases made on PrepSutra are <strong>final and non-refundable</strong>.",
      "By completing a purchase, you acknowledge and agree to this no-refund policy.",
      "We encourage users to review course details, previews, and descriptions before making a purchase.",
      "Once payment is processed, the transaction cannot be reversed."
    ]
  },
  {
    id: 2,
    title: "No Refund Policy",
    icon: XCircle,
    isHighlighted: true,
    content: [
      "Digital content and courses are non-refundable once access is granted.",
      "Subscription fees are non-refundable, even if cancelled mid-cycle.",
      "No refunds for partial completion of courses or tests.",
      "No refunds for change of mind or personal circumstances.",
      "No refunds if you fail to complete the course within the access period."
    ]
  },
  {
    id: 3,
    title: "Exceptions (At Our Sole Discretion)",
    icon: CheckCircle,
    content: [
      "<strong>Duplicate Payment</strong>: If charged multiple times for the same purchase due to technical error.",
      "<strong>Course Cancellation</strong>: If we permanently remove a course you purchased before you could access it.",
      "<strong>Technical Issues</strong>: If verified technical problems on our end prevent access for an extended period (7+ days).",
      "<strong>Unauthorized Transaction</strong>: If payment was made without your consent (subject to investigation)."
    ],
    note: "All exception requests are reviewed on a case-by-case basis. Our decision is final."
  },
  {
    id: 4,
    title: "Cancellation Policy",
    icon: AlertTriangle,
    content: [
      "You may cancel your subscription anytime from your account settings.",
      "Cancellation will take effect at the end of the current billing cycle.",
      "No partial refunds for unused days in the billing period.",
      "Cancelled accounts retain access until the billing period ends.",
      "Reactivation after cancellation may require a new subscription at current rates."
    ]
  },
  {
    id: 5,
    title: "How to Request Exception Review",
    icon: HelpCircle,
    content: [
      "Email us at <strong>ayusht5071@gmail.com</strong> within 48 hours of purchase.",
      "Include your registered email, transaction ID, and reason for request.",
      "Provide any supporting documentation (screenshots, error messages).",
      "We will respond within 7-10 working days.",
      "If approved, refund will be processed to the original payment method within 5-7 business days."
    ]
  },
  {
    id: 6,
    title: "Payment Disputes",
    icon: CreditCard,
    content: [
      "If you initiate a chargeback without contacting us first, your account will be suspended.",
      "Fraudulent chargebacks may result in legal action.",
      "We recommend contacting our support team before disputing with your bank.",
      "All payment disputes are subject to Indian laws and regulations."
    ]
  }
];

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(239,68,68,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.1),transparent_50%)]" />
        
        <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full mb-6">
              <CreditCard className="w-4 h-4 text-red-400" />
              <span className="text-sm text-red-300">Payment Policy</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Refund & Cancellation Policy
            </h1>
            
            <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-4">
              Please read our refund and cancellation policy carefully before making any purchase.
            </p>
            
            <p className="text-slate-500 text-sm">
              Last Updated: December 5, 2025
            </p>
          </motion.div>
        </div>
      </div>

      {/* Important Notice */}
      <div className="max-w-5xl mx-auto px-4 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-2xl p-6 sm:p-8"
        >
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-8 h-8 text-red-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-white font-semibold text-lg mb-2">Important Notice</h3>
              <p className="text-slate-300 leading-relaxed">
                <strong className="text-white">PrepSutra</strong> follows a strict <strong className="text-red-400">NO REFUND</strong> policy 
                for all digital products, courses, and subscriptions. All sales are final. Please ensure you understand what you are 
                purchasing before completing your transaction.
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
                  ? 'border-red-500/30 bg-red-500/5' 
                  : 'border-white/10'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${
                  section.isHighlighted 
                    ? 'bg-red-500/10' 
                    : 'bg-blue-500/10'
                }`}>
                  <section.icon className={`w-6 h-6 ${
                    section.isHighlighted 
                      ? 'text-red-400' 
                      : 'text-blue-400'
                  }`} />
                </div>
                
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-white mb-4">
                    {section.id}. {section.title}
                  </h2>
                  
                  <ul className="space-y-3">
                    {section.content.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className={`mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                          section.isHighlighted 
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
                  
                  {section.note && (
                    <p className="mt-4 text-sm text-slate-400 italic bg-slate-800/50 p-3 rounded-lg">
                      {section.note}
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
          <h3 className="text-white font-semibold text-xl mb-2">Need Help?</h3>
          <p className="text-slate-400 mb-4">
            If you have questions about our refund policy or need assistance, contact us:
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
