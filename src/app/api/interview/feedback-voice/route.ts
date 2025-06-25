import { NextRequest, NextResponse } from "next/server";
import InterviewResult from "../../../../lib/interviewDb";

// Dummy voice-to-text and feedback (replace with Gemini API integration for real use)
async function transcribeAudio(audioBuffer: Buffer): Promise<string> {
  // In real use, send audioBuffer to Gemini or another speech-to-text API
  // Here, just return a placeholder
  return "[Transcribed answer: This is a placeholder. Integrate Gemini for real transcription.]";
}

function generateFeedback(answer: string): { feedback: string; score: number } {
  if (!answer || answer.length < 20) {
    return {
      feedback: "Your answer is too short. Try to elaborate more and provide examples.",
      score: 3
    };
  }
  // Simulate AI feedback
  return {
    feedback: "Good answer! You covered the main points. For a perfect score, add more details and examples.",
    score: Math.min(10, 6 + Math.floor(answer.length / 50))
  };
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const topic = formData.get("topic") as string;
  const question = formData.get("question") as string;
  const audio = formData.get("audio") as File;
  const audioBuffer = Buffer.from(await audio.arrayBuffer());
  // Transcribe audio (simulate)
  const answer = await transcribeAudio(audioBuffer);
  // Generate feedback and score
  const { feedback, score } = generateFeedback(answer);
  // Store in DB
  await InterviewResult.create({ topic, question, answer, feedback, score });
  return NextResponse.json({ feedback, score });
}
