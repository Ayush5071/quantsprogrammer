"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

async function clarifyWithGemini(message: string): Promise<string> {
  const response = await fetch("/api/gemini-clarify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  const clarifiedMsg = await response.text();
  return clarifiedMsg || "AI could not clarify the message.";
}

export default function ContactSupport() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [clarified, setClarified] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClarify = async () => {
    setAiLoading(true);
    const clarifiedMsg = await clarifyWithGemini(message);
    setClarified(clarifiedMsg);
    setAiLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Here you would send clarified || message to your support system
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-black via-gray-900 to-black px-6 relative overflow-hidden">
      <div className="max-w-md w-full p-10 bg-gradient-to-br from-zinc-900/80 via-blue-900/60 to-purple-900/70 backdrop-blur-2xl border border-blue-400/30 rounded-3xl shadow-2xl z-10 flex flex-col items-center animate-fade-in">
        <h1 className="text-3xl font-extrabold text-center text-white mb-6 drop-shadow-lg tracking-tight font-sans">
          Contact Support{" "}
          <span className="ml-2 text-blue-400 animate-pulse">🤖</span>
        </h1>
        <hr className="w-1/2 mx-auto mb-6 border-blue-400 opacity-20" />
        {submitted ? (
          <div className="text-green-400 text-center font-semibold text-lg">
            Thank you! We have received your message and will get back to you soon.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 w-full" autoComplete="off">
            <div>
              <label htmlFor="email" className="block text-base font-semibold text-blue-100 mb-2">
                Your Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full p-3 border border-blue-400/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 text-blue-900 bg-white/90 placeholder:text-blue-400/60 shadow-md font-medium"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-base font-semibold text-blue-100 mb-2">
                Message
              </label>
              <textarea
                id="message"
                className="w-full p-3 border border-blue-400/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 text-blue-900 bg-white/90 placeholder:text-blue-400/60 shadow-md font-medium"
                placeholder="How can we help you?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                required
              />
              <button
                type="button"
                onClick={handleClarify}
                disabled={aiLoading || !message}
                className="mt-2 px-4 py-2 bg-blue-700 text-white rounded-lg font-semibold shadow hover:bg-blue-800 transition-all"
              >
                {aiLoading ? "AI Clarifying..." : "Let AI Clarify"}
              </button>
            </div>
            {clarified && (
              <div className="bg-blue-900/30 border border-blue-400/30 rounded-xl p-4 mt-2 text-blue-100">
                <div className="font-bold mb-1">AI Clarified Message:</div>
                <div>{clarified}</div>
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className={`w-full p-3 text-white rounded-xl font-bold text-lg transition-all duration-300 ease-in-out mt-2 shadow-lg bg-gradient-to-r from-blue-700/90 to-purple-800/90 hover:from-blue-800 hover:to-purple-900 active:scale-95 focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 ${
                loading ? "bg-gray-600 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        )}
        <button
          onClick={() => router.back()}
          className="mt-8 text-blue-300 hover:text-blue-400 hover:underline text-base px-4 py-2 rounded-lg bg-zinc-900/80 shadow border-2 border-blue-400/40 transition-all"
        >
          Back
        </button>
      </div>
    </div>
  );
}
