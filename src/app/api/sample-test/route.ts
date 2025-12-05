import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { getDataFromToken } from "@/helpers/getToken";
import jwt from "jsonwebtoken";

connect();

// Sample MCQ questions - always the same 5 questions
const SAMPLE_QUESTIONS = [
  {
    id: "sq1",
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Tech Modern Language",
      "Hyper Transfer Markup Language",
      "Home Tool Markup Language"
    ],
    correctAnswer: 0,
    marks: 2
  },
  {
    id: "sq2",
    question: "Which CSS property is used to change the text color?",
    options: [
      "font-color",
      "text-color",
      "color",
      "foreground-color"
    ],
    correctAnswer: 2,
    marks: 2
  },
  {
    id: "sq3",
    question: "What is the correct way to declare a JavaScript variable?",
    options: [
      "variable x = 5;",
      "var x = 5;",
      "v x = 5;",
      "declare x = 5;"
    ],
    correctAnswer: 1,
    marks: 2
  },
  {
    id: "sq4",
    question: "Which of the following is NOT a JavaScript data type?",
    options: [
      "String",
      "Boolean",
      "Float",
      "Object"
    ],
    correctAnswer: 2,
    marks: 2
  },
  {
    id: "sq5",
    question: "What does CSS stand for?",
    options: [
      "Computer Style Sheets",
      "Cascading Style Sheets",
      "Creative Style System",
      "Colorful Style Sheets"
    ],
    correctAnswer: 1,
    marks: 2
  }
];

// Helper to get userId from request
function getUserIdFromRequest(request: NextRequest): string | null {
  try {
    const userId = getDataFromToken(request);
    if (userId) return userId;
  } catch (e) {}
  
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      const token = authHeader.substring(7);
      const decoded: any = jwt.verify(token, process.env.TOKEN_SECRET!);
      return decoded.id;
    } catch (e) {}
  }
  
  return null;
}

// GET: Check eligibility and get questions
export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);
    
    if (!userId) {
      return NextResponse.json({ 
        error: "Not authenticated",
        canTakeTest: false 
      }, { status: 401 });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    // Check if user has already taken the sample test
    const hasAttempted = user.sampleTestAttempt?.completed === true;
    
    // Check if user has full profile details
    const requiredFields = ['fullName', 'college', 'contactNumber'];
    const missingFields = requiredFields.filter(field => !user[field]);
    const hasFullDetails = missingFields.length === 0;
    
    if (hasAttempted) {
      return NextResponse.json({
        canTakeTest: false,
        hasAttempted: true,
        attempt: user.sampleTestAttempt,
        hasFullDetails,
        missingDetails: missingFields.length > 0 ? `Missing: ${missingFields.join(', ')}` : null
      });
    }
    
    // Return questions without correct answers for test-taking
    const questionsForUser = SAMPLE_QUESTIONS.map(q => ({
      id: q.id,
      question: q.question,
      options: q.options,
      marks: q.marks
    }));
    
    return NextResponse.json({
      canTakeTest: true,
      hasAttempted: false,
      hasFullDetails,
      missingDetails: missingFields.length > 0 ? `Missing: ${missingFields.join(', ')}` : null,
      questions: questionsForUser,
      totalMarks: 10,
      passingMarks: 6,
      duration: 5 // 5 minutes for sample test
    });
  } catch (error: any) {
    console.error("Error in sample test GET:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Submit test answers
export async function POST(request: NextRequest) {
  try {
    console.log("Sample test POST: Starting submission");
    
    const userId = getUserIdFromRequest(request);
    console.log("Sample test POST: userId =", userId);
    
    if (!userId) {
      console.log("Sample test POST: No userId found");
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    await connect();
    const user = await User.findById(userId);
    console.log("Sample test POST: user found =", !!user);
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    // Check if already attempted
    if (user.sampleTestAttempt?.completed) {
      console.log("Sample test POST: Already attempted");
      return NextResponse.json({ 
        error: "You have already taken the sample test",
        attempt: user.sampleTestAttempt 
      }, { status: 400 });
    }
    
    const body = await request.json();
    console.log("Sample test POST: body =", JSON.stringify(body));
    const { answers } = body;
    
    if (!answers || typeof answers !== 'object') {
      console.log("Sample test POST: Invalid answers format");
      return NextResponse.json({ error: "Invalid answers format" }, { status: 400 });
    }
    
    // Calculate score
    let score = 0;
    const results: any[] = [];
    
    for (const q of SAMPLE_QUESTIONS) {
      const userAnswer = answers[q.id];
      const isCorrect = userAnswer === q.correctAnswer;
      if (isCorrect) {
        score += q.marks;
      }
      results.push({
        questionId: q.id,
        question: q.question,
        userAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect,
        marks: isCorrect ? q.marks : 0
      });
    }
    
    const totalMarks = 10;
    const percentage = Math.round((score / totalMarks) * 100);
    const passed = percentage >= 60;
    
    // Generate certificate ID if passed
    const certificateId = passed ? `SAMPLE-${userId.slice(-6).toUpperCase()}-${Date.now().toString(36).toUpperCase()}` : null;
    
    // Save attempt to user
    user.sampleTestAttempt = {
      completed: true,
      score,
      totalMarks,
      percentage,
      passed,
      certificateId,
      completedAt: new Date(),
      answers: results
    };
    
    console.log("Sample test POST: Saving user with sampleTestAttempt");
    try {
      await user.save();
      console.log("Sample test POST: User saved successfully");
    } catch (saveError: any) {
      console.error("Sample test POST: Save error:", saveError);
      return NextResponse.json({ error: "Failed to save test results: " + saveError.message }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      score,
      totalMarks,
      percentage,
      passed,
      certificateId,
      results,
      message: passed 
        ? `Congratulations! You passed with ${percentage}%!` 
        : `You scored ${percentage}%. You need 60% to pass.`
    });
  } catch (error: any) {
    console.error("Error in sample test POST:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
