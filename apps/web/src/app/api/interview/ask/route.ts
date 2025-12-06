import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { topic, experience, skills, numQuestions = 5 } = await req.json();

  // Compose a prompt for Gemini
  const prompt = `
    I am preparing for a mock interview.
    My experience: ${experience} years.
    My top skills: ${skills}.
    Topic: ${topic}.
    Please generate ${numQuestions} unique, relevant interview questions for me.
    Return only a JSON array of questions, no explanation or extra text.
    Example: ["What is a closure in JavaScript?", "Explain event delegation."]
  `;

  console.log("[Gemini Interview] Prompt:", prompt);

  const geminiRes = await fetch(
    "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=" +
      process.env.GEMINI_API_KEY,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    }
  );

  const geminiData = await geminiRes.json();
  console.log("[Gemini Interview] Raw Response:", JSON.stringify(geminiData));
  let questions: string[] = [];
  try {
    // Try to extract JSON array from the response, even if extra text is present
    const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "";
    console.log("[Gemini Interview] Extracted Text:", text);
    // Use a more compatible regex for JSON array extraction
    const match = text.match(/\[[\s\S]*\]/);
    if (match) {
      questions = JSON.parse(match[0]);
    } else {
      questions = ["Sorry, could not generate questions. Please try again."];
    }
  } catch (err) {
    console.error("[Gemini Interview] Parse Error:", err);
    questions = ["Sorry, could not generate questions. Please try again."];
  }

  console.log("[Gemini Interview] Final Questions:", questions);
  return NextResponse.json({ questions });
}
