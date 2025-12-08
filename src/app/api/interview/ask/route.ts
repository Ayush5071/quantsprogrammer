import { NextRequest, NextResponse } from "next/server";
import { generateContent } from "@/lib/gemini";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import jwt from "jsonwebtoken";

connect();

// Helper to get user ID from request
async function getUserIdFromRequest(request: NextRequest): Promise<string | null> {
  try {
    const cookieToken = request.cookies.get("token")?.value;
    const authHeader = request.headers.get("authorization");
    const headerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
    
    const token = cookieToken || headerToken;
    if (!token) return null;
    
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as { id: string };
    return decoded.id;
  } catch (error) {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const userId = await getUserIdFromRequest(req);
  
  // Check if user is authenticated
  if (!userId) {
    return NextResponse.json(
      { error: "Please login to start a mock interview" },
      { status: 401 }
    );
  }
  
  // Get user and check subscription/daily limit
  const user = await User.findById(userId);
  if (!user) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }
  
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const isSubscribed = user.purchases?.mockInterviews?.purchased || false;
  const usageDate = user.mockInterviewUsage?.date;
  const usageCount = usageDate === today ? (user.mockInterviewUsage?.count || 0) : 0;
  
  // Free users can only do 1 interview per day
  if (!isSubscribed && usageCount >= 1) {
    return NextResponse.json(
      { 
        error: "Daily limit reached", 
        limitReached: true,
        message: "Free users can only do 1 mock interview per day. Upgrade to premium for unlimited interviews!"
      },
      { status: 403 }
    );
  }
  
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

  const geminiText = await generateContent(prompt);
  console.log("[Gemini Interview] Response:", geminiText);
  
  let questions: string[] = [];
  try {
    // Try to extract JSON array from the response, even if extra text is present
    const text = geminiText;
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

  // Update daily usage count (only if questions were generated successfully)
  if (questions.length > 0 && questions[0] !== "Sorry, could not generate questions. Please try again.") {
    await User.findByIdAndUpdate(userId, {
      $set: {
        "mockInterviewUsage.date": today,
        "mockInterviewUsage.count": usageDate === today ? usageCount + 1 : 1,
      }
    });
  }

  console.log("[Gemini Interview] Final Questions:", questions);
  return NextResponse.json({ questions });
}
