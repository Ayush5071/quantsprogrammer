import { NextRequest, NextResponse } from "next/server";

// POST: Evaluate Top Interview answers with strict scoring and feedback
export async function POST(req: NextRequest) {
  const { questions, answers } = await req.json();
  if (!questions || !answers || !Array.isArray(questions) || !Array.isArray(answers)) {
    return NextResponse.json({ error: "Missing or invalid questions/answers" }, { status: 400 });
  }

  // Strict Gemini prompt for Top Interviews
  const prompt = `You are an expert technical interviewer. Here are the Top Interview questions and my answers. 
- If an answer is perfect and fully correct, give a score of 70-100 (random in this range, but explain why).
- If an answer is partially correct, give a score in the range 50-70.
- If an answer is irrelevant, weak, or mostly wrong, give a score between 0-5.
- For each answer, provide a short, actionable feedback.
Respond ONLY in this exact JSON format (no markdown, no code block):
[
  { "question": "...", "answer": "...", "feedback": "...", "score": 75 },
  ...
]

Questions and Answers:
${questions.map((q: string, i: number) => `Q${i+1}: ${q}\nA${i+1}: ${answers[i] || "(skipped)"}`).join("\n")}`;

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
  let feedback = [];
  try {
    const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const match = text.match(/\[[\s\S]*\]/);
    if (match) {
      feedback = JSON.parse(match[0]);
    } else {
      feedback = [{ feedback: "Sorry, could not generate feedback. Please try again.", score: 0 }];
    }
  } catch (err) {
    feedback = [{ feedback: "Sorry, could not generate feedback. Please try again.", score: 0 }];
  }
  return NextResponse.json({ feedback });
}
