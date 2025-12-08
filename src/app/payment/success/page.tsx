"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, XCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Instamojo redirects with payment_id, payment_status, and payment_request_id
        const paymentId = searchParams.get("payment_id");
        const paymentStatus = searchParams.get("payment_status");
        const paymentRequestId = searchParams.get("payment_request_id");

        console.log("Payment params:", { paymentId, paymentStatus, paymentRequestId });

        // Fetch dynamic pricing
        let oaPrice = 10;
        try {
          const pricingRes = await fetch("/api/admin/pricing");
          if (pricingRes.ok) {
            const pricingData = await pricingRes.json();
            if (pricingData.pricing?.oaQuestions) {
              oaPrice = pricingData.pricing.oaQuestions;
            }
          }
        } catch (e) {
          console.error("Failed to fetch pricing:", e);
        }

        // Instamojo uses "Credit" for successful payments
        if (paymentStatus === "Credit" || paymentStatus === "success" || paymentId) {
          // Record the successful payment
          const response = await fetch("/api/payment/oa-questions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              paymentId: paymentId || paymentRequestId || `INS_${Date.now()}`,
              status: "success",
              amount: oaPrice,
            }),
          });

          if (response.ok) {
            setStatus("success");
            setMessage("Payment successful! You now have access to all 450+ company questions.");
          } else {
            const data = await response.json();
            // If user not authenticated, still show success but ask to login
            if (response.status === 401) {
              setStatus("success");
              setMessage("Payment successful! Please login to access all company questions.");
            } else {
              setStatus("error");
              setMessage(data.error || "Failed to verify payment. Please contact support with your payment ID: " + paymentId);
            }
          }
        } else if (paymentStatus === "Failed") {
          setStatus("error");
          setMessage("Payment failed. Please try again or contact support.");
        } else {
          // No payment parameters, might be direct navigation - check if already purchased
          const checkResponse = await fetch("/api/payment/oa-questions");
          if (checkResponse.ok) {
            const data = await checkResponse.json();
            if (data.purchased) {
              setStatus("success");
              setMessage("You already have access to all company questions!");
            } else {
              setStatus("error");
              setMessage("No payment information found. If you've completed payment, please contact support.");
            }
          } else {
            setStatus("error");
            setMessage("Please login to verify your purchase status.");
          }
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        setStatus("error");
        setMessage("An error occurred while verifying your payment. Please contact support.");
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
            Start Practicing
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
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition"
            >
              Go to Company Problems
            </Link>
            <Link
              href="/contact-support"
              className="text-blue-400 hover:text-blue-300 text-sm transition"
            >
              Contact Support
            </Link>
          </div>
        </>
      )}
    </motion.div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
      {/* Background effects */}
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
        <PaymentSuccessContent />
      </Suspense>
    </div>
  );
}
