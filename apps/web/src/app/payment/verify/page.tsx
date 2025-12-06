"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, XCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

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

        if (!paymentId && !paymentRequestId) {
          setStatus("error");
          setMessage("No payment information found.");
          return;
        }

        // Call our verify API
        const params = new URLSearchParams();
        if (paymentId) params.set("payment_id", paymentId);
        if (paymentRequestId) params.set("payment_request_id", paymentRequestId);
        if (paymentStatus) params.set("payment_status", paymentStatus);

        const response = await fetch(`/api/payment/verify?${params.toString()}`);
        const data = await response.json();

        if (data.success && data.verified) {
          setStatus("success");
          setMessage(data.message || "Payment successful! All company questions are now unlocked.");
        } else {
          setStatus("error");
          setMessage(data.message || "Payment verification failed.");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("error");
        setMessage("An error occurred while verifying payment.");
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
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="w-20 h-20 mx-auto mb-6 bg-green-500/10 rounded-full flex items-center justify-center"
          >
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          </motion.div>
          <h1 className="text-2xl font-bold text-white mb-3">
            Payment Successful!
          </h1>
          <p className="text-gray-400 mb-6">{message}</p>
          <Link
            href="/company-problems"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition"
          >
            Access All Companies
            <ArrowRight className="w-5 h-5" />
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <div className="w-20 h-20 mx-auto mb-6 bg-red-500/10 rounded-full flex items-center justify-center">
            <XCircle className="w-10 h-10 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">
            Payment Issue
          </h1>
          <p className="text-gray-400 mb-6">{message}</p>
          <div className="flex flex-col gap-3">
            <Link
              href="/company-problems"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-500/20 text-blue-400 font-semibold rounded-xl hover:bg-blue-500/30 transition"
            >
              Try Again
            </Link>
            <Link
              href="/contact-support"
              className="text-gray-500 hover:text-gray-400 text-sm transition"
            >
              Contact Support
            </Link>
          </div>
        </>
      )}
    </motion.div>
  );
}

export default function PaymentVerifyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/5 rounded-full blur-3xl" />
      </div>

      <Suspense fallback={
        <div className="relative z-10 max-w-md w-full bg-[#111118] border border-white/10 rounded-2xl p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-blue-500/10 rounded-full flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Loading...</h1>
        </div>
      }>
        <VerifyContent />
      </Suspense>
    </div>
  );
}
