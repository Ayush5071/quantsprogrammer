"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, XCircle, ArrowRight, FileText } from "lucide-react";
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
        let premiumPrice = 10;
        try {
          const pricingRes = await axios.get("/api/admin/pricing");
          if (pricingRes.data.pricing?.resumeScreeningPremium) {
            premiumPrice = pricingRes.data.pricing.resumeScreeningPremium;
          }
        } catch (e) {
          console.error("Failed to fetch pricing:", e);
        }

        // Verify payment with Instamojo - "Credit" means successful payment
        if (paymentStatus === "Credit" || paymentStatus === "success") {
          console.log("[VerifyPayment] Payment status is Credit/success, recording purchase...");
          
          // Record the purchase
          const response = await axios.post("/api/payment/resume-screening", {
            paymentId: paymentId || paymentRequestId,
            status: "success",
            amount: premiumPrice
          });

          console.log("[VerifyPayment] API response:", response.data);

          if (response.data.success) {
            setStatus("success");
            setMessage("Payment successful! You now have access to bulk resume screening.");
          } else {
            setStatus("error");
            setMessage(response.data.error || "Failed to activate premium access.");
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
            href="/resume-screening/bulk"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition"
          >
            <FileText className="w-5 h-5" />
            Go to Bulk Screening
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
            Payment Failed
          </h1>
          <p className="text-gray-400 mb-6">{message}</p>
          <Link
            href="/resume-screening/bulk"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-700 text-white font-semibold rounded-xl hover:bg-gray-600 transition"
          >
            Try Again
          </Link>
        </>
      )}
    </motion.div>
  );
}

export default function VerifyResumeScreeningPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

      <Suspense
        fallback={
          <div className="flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
          </div>
        }
      >
        <VerifyContent />
      </Suspense>
    </div>
  );
}
