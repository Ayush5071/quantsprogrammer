"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, XCircle, ArrowRight, Mic } from "lucide-react";
import Link from "next/link";
import axios from "axios";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const paymentId = searchParams.get("payment_id");
        const paymentRequestId = searchParams.get("payment_request_id");
        const paymentStatus = searchParams.get("payment_status");

        console.log("[VerifyPayment] Params:", { paymentId, paymentRequestId, paymentStatus });

        if (!paymentId && !paymentRequestId) {
          setStatus("error");
          setMessage("No payment information found.");
          return;
        }

        // Fetch dynamic pricing
        let mockPrice = 10;
        try {
          const pricingRes = await axios.get("/api/admin/pricing");
          if (pricingRes.data.pricing?.mockInterviews) {
            mockPrice = pricingRes.data.pricing.mockInterviews;
          }
        } catch (e) {
          console.error("Failed to fetch pricing:", e);
        }

        // Verify payment - "Credit" means successful payment from Instamojo
        if (paymentStatus === "Credit" || paymentStatus === "success") {
          console.log("[VerifyPayment] Payment status is Credit/success, recording subscription...");
          
          // Record the subscription
          const response = await axios.post("/api/payment/mock-interviews", {
            paymentId: paymentId || paymentRequestId,
            status: "success",
            amount: mockPrice
          });

          console.log("[VerifyPayment] API response:", response.data);

          if (response.data.success) {
            setStatus("success");
            setMessage("Payment successful! You now have unlimited mock interviews.");
          } else {
            setStatus("error");
            setMessage(response.data.error || "Failed to activate subscription.");
          }
        } else {
          setStatus("error");
          setMessage(`Payment was not successful. Status: ${paymentStatus}`);
        }
      } catch (error: any) {
        console.error("Verification error:", error);
        setStatus("error");
        setMessage(error.response?.data?.error || "An error occurred while verifying payment.");
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative z-10 max-w-md w-full bg-[#111118] border border-white/10 rounded-2xl p-8 text-center"
    >
      {status === "loading" && (
        <>
          <div className="w-20 h-20 mx-auto mb-6 bg-blue-500/10 rounded-full flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">
            Verifying Payment...
          </h1>
          <p className="text-gray-400">
            Please wait while we confirm your payment.
          </p>
        </>
      )}

      {status === "success" && (
        <>
          <div className="w-20 h-20 mx-auto mb-6 bg-green-500/10 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">
            Payment Successful!
          </h1>
          <p className="text-gray-400 mb-6">{message}</p>
          <Link
            href="/interview"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-medium transition-all"
          >
            <Mic className="w-5 h-5" />
            Start Mock Interview
            <ArrowRight className="w-4 h-4" />
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <div className="w-20 h-20 mx-auto mb-6 bg-red-500/10 rounded-full flex items-center justify-center">
            <XCircle className="w-10 h-10 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">
            Payment Failed
          </h1>
          <p className="text-gray-400 mb-6">{message}</p>
          <div className="flex flex-col gap-3">
            <Link
              href="/interview"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all"
            >
              Try Again
            </Link>
            <Link
              href="/contact-support"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </>
      )}
    </motion.div>
  );
}

export default function VerifyMockInterviewsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5" />
      
      <Suspense fallback={
        <div className="flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        </div>
      }>
        <VerifyContent />
      </Suspense>
    </div>
  );
}
