import { NextRequest, NextResponse } from "next/server";
import InterviewResult from "@/models/interviewModel";
import mongoose from "mongoose";
import { connect } from "@/dbConfig/dbConfig";
import { generateContent } from "@/lib/gemini";

// Increase timeout for Vercel/serverless functions
export const maxDuration = 30; // 30 seconds max timeout

// Bulletproof extract and clean function for Gemini output
function extractAndCleanJson(raw: string | undefined | null): string {
  if (!raw || typeof raw !== 'string') return '{}';
  let cleaned = raw.replace(/```json|```/gi, '').trim();
  // Replace smart quotes and Unicode quotes with standard quotes
  cleaned = cleaned
    .replace(/[“”«»„‟❝❞〝〞＂]/g, '"')
    .replace(/[‘’‚‛❛❜⸂⸃⸌⸍⸜⸝⸠⸡]/g, "'");
  // Remove all control characters except \n, \r, \t
  cleaned = cleaned.replace(/[\u0000-\u001F\u007F-\u009F]/g, (c) => {
    if (c === '\n' || c === '\r' || c === '\t') return c;
    return '';
  });
  // Remove all non-ASCII except basic punctuation
  cleaned = cleaned.replace(/[^\x20-\x7E\n\r\t]/g, '');
  // Extract JSON object using regex (greedy match for {...})
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (match) return match[0];
  return cleaned;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log("[Interview Feedback] Incoming body:", body);

  // Ensure mongoose is connected
  if (mongoose.connection.readyState === 0) {
    await connect();
  }

  // Support both single and batch feedback
  if (Array.isArray(body.questions) && Array.isArray(body.answers)) {
    const { topic, questions, answers, user } = body;
    // Strict scoring prompt for Gemini
    const prompt = `You are an expert technical interviewer. Here are the interview questions and my answers. Please provide constructive, actionable feedback for my overall performance and a single overall score out of 10. Be very strict cut marks as much as possible : only give a score of 8, 9, or 10 for truly perfect, expert-level answers. Give 0, 1, 2, 3, or 4 for poor, incorrect, or missing answers. If the answers are mostly wrong or missing, give 0. Respond ONLY in this exact JSON format (no markdown, no code block): { "feedback": "...", "score": 7 }\n\nQuestions and Answers:\n${questions.map((q: string, i: number) => `Q${i+1}: ${q}\nA${i+1}: ${answers[i] || "(skipped)"}`).join("\n")}`;
    console.log("[Interview Feedback] Batch prompt:", prompt);
    
    let geminiText;
    try {
      geminiText = await generateContent(prompt);
      console.log("[Interview Feedback] Gemini batch response:", geminiText);
    } catch (err) {
      console.error("[Interview Feedback] Gemini API Error:", err);
      return NextResponse.json({ 
        feedback: "Sorry, could not generate feedback due to a server error. Please try again.", 
        score: 0 
      });
    }
    
    let feedback = "No feedback";
    let score = 0;
    try {
      const cleaned = extractAndCleanJson(geminiText);
      const parsed = JSON.parse(cleaned);
      feedback = parsed.feedback;
      score = parsed.score;
    } catch (err) {
      // Fallback: try to extract feedback and score with regex
      const feedbackMatch = geminiText?.match(/"feedback"\s*:\s*"([^"]+)"/);
      const scoreMatch = geminiText?.match(/"score"\s*:\s*(\d+)/);
      feedback = feedbackMatch ? feedbackMatch[1] : "Sorry, could not get feedback. Please try again.";
      score = scoreMatch ? Number(scoreMatch[1]) : 0;
      console.error("[Interview Feedback] Batch parse error (fallback used):", err, geminiText);
    }
    // Save the whole interview result using new model fields
    const saved = await InterviewResult.create({
      topic,
      questions,
      answers,
      feedback,
      score,
      user: user || undefined
    });
    return NextResponse.json({ feedback, score, _id: saved._id });
  }

  // Single question feedback (default, not used for full interview save)
  const { topic, question, answer, user } = body;
  const singlePrompt = `You are an expert technical interviewer. Here is the interview question and my answer. Please provide constructive, actionable feedback and a single score out of 10. Be very strict: only give a score of 8, 9, or 10 for truly perfect, expert-level answers. Give 5, 6, or 7 only for partially correct answers. Give 0, 1, 2, 3, or 4 for poor, incorrect, or missing answers. If the answer is mostly wrong or missing, give 0. Respond ONLY in this exact JSON format (no markdown, no code block): { "feedback": "...", "score": 7 }\n\nQuestion: ${question}\nAnswer: ${answer}`;
  console.log("[Interview Feedback] Single prompt:", singlePrompt);
  
  let singleGeminiText;
  try {
    singleGeminiText = await generateContent(singlePrompt);
    console.log("[Interview Feedback] Gemini single response:", singleGeminiText);
  } catch (err) {
    console.error("[Interview Feedback] Gemini API Error:", err);
    return NextResponse.json({ 
      feedback: "Sorry, could not generate feedback due to a server error. Please try again.", 
      score: 0 
    });
  }
  
  let feedback = "No feedback";
  let score = 0;
  try {
    const cleaned = extractAndCleanJson(singleGeminiText);
    const parsed = JSON.parse(cleaned);
    feedback = parsed.feedback;
    score = parsed.score;
  } catch (err) {
    // Fallback: try to extract feedback and score with regex
    const feedbackMatch = singleGeminiText?.match(/"feedback"\s*:\s*"([^"]+)"/);
    const scoreMatch = singleGeminiText?.match(/"score"\s*:\s*(\d+)/);
    feedback = feedbackMatch ? feedbackMatch[1] : "Sorry, could not get feedback. Please try again.";
    score = scoreMatch ? Number(scoreMatch[1]) : 0;
    console.error("[Interview Feedback] Single parse error (fallback used):", err, singleGeminiText);
  }
  // Do not save single question feedback as a full interview result
  return NextResponse.json({ feedback, score });
}
