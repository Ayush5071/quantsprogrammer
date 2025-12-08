import { NextRequest, NextResponse } from "next/server";
import { generateContent } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  const { numQuestions, field, company, topics, level, skills } = await req.json();

  // Validate required fields
  if (!numQuestions || !field || !company || !topics || !level || !skills) {
    console.log("[API] Missing required fields", { numQuestions, field, company, topics, level, skills });
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Compose a prompt for Gemini (add company and roughness/level)
  const prompt = `
    I am preparing for a mock interview for the company: ${company}.
    My experience: 2 years.
    My top skills: ${skills}.
    Topic: ${field}.
    Level: ${level}.
    Please generate ${numQuestions} unique, relevant interview questions for me.
    Return only a JSON array of questions, no explanation or extra text.
    Example: ["What is a closure in JavaScript?", "Explain event delegation."]
  `;

  try {
    console.log("[API] Sending prompt to Gemini:", prompt);
    const geminiText = await generateContent(prompt);
    console.log("[API] Gemini response:", geminiText);
    
    let questions: string[] = [];
    try {
      const text = typeof geminiText === 'string' ? geminiText : '';
      console.log("[API] Gemini extracted text:", text);
      const match = text?.match(/\[[\s\S]*\]/);
      if (match) {
        questions = JSON.parse(match[0]);
      } else {
        questions = ["Sorry, could not generate questions. Please try again."];
      }
    } catch (err) {
      console.error("[API] Error parsing Gemini response:", err);
      questions = ["Sorry, could not generate questions. Please try again."];
    }
    return NextResponse.json({ questions });
  } catch (err: any) {
    console.error("[API] Unknown error:", err);
    return NextResponse.json({ error: err.message || "Unknown error" }, { status: 500 });
  }
}
