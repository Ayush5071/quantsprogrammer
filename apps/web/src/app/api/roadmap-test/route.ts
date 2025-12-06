import { connect } from "@/dbConfig/dbConfig";
import { RoadmapTest, TestAttempt } from "@/models/roadmapTestModel";
import Roadmap from "@/models/roadmapModel";
import User from "@/models/userModel";
import { NextResponse, NextRequest } from "next/server";
import { getDataFromToken } from "@/helpers/getToken";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

connect();

// Generate test questions using Gemini
async function generateTestWithGemini(roadmap: any): Promise<{
  mcqQuestions: any[];
  shortAnswerQuestions: any[];
}> {
  const roadmapContent = roadmap.phases
    .map((phase: any, idx: number) => {
      const tasks = phase.tasks.map((t: any) => t.title).join(", ");
      const assignments = phase.assignments.map((a: any) => a.title).join(", ");
      return `Phase ${idx + 1}: ${phase.title}\nTopics: ${tasks}\nAssignments: ${assignments}`;
    })
    .join("\n\n");

  const prompt = `You are a technical exam generator. Based on the following roadmap for "${roadmap.title}", generate a comprehensive certification test.

ROADMAP CONTENT:
${roadmapContent}

Generate exactly:
1. 30 Multiple Choice Questions (MCQ) - each worth 2 marks
2. 10 Short Answer Questions - each worth 4 marks

For MCQs:
- Cover all phases proportionally
- 4 options each (A, B, C, D)
- Mix difficulty levels (easy, medium, hard)
- Questions should test understanding, not just memorization

For Short Answer Questions:
- Questions should require 2-4 sentence answers
- Test conceptual understanding and application
- Provide expected answer for evaluation

RESPOND IN THIS EXACT JSON FORMAT (no markdown, no code blocks, just pure JSON):
{
  "mcqQuestions": [
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0
    }
  ],
  "shortAnswerQuestions": [
    {
      "question": "Question text here?",
      "expectedAnswer": "Expected answer that covers the key points..."
    }
  ]
}

Important:
- correctAnswer is the index (0-3) of the correct option
- Ensure all 30 MCQs and 10 short answer questions are included
- Questions should be relevant to the roadmap topics
- Make questions challenging but fair`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8192,
          },
        }),
      }
    );

    const data = await response.json();
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error("Invalid response from Gemini");
    }

    let jsonText = data.candidates[0].content.parts[0].text;
    
    // Clean up the response - remove markdown code blocks if present
    jsonText = jsonText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    
    const parsed = JSON.parse(jsonText);
    
    // Validate the response
    if (!parsed.mcqQuestions || parsed.mcqQuestions.length < 30) {
      throw new Error("Not enough MCQ questions generated");
    }
    if (!parsed.shortAnswerQuestions || parsed.shortAnswerQuestions.length < 10) {
      throw new Error("Not enough short answer questions generated");
    }

    // Add marks to questions
    const mcqQuestions = parsed.mcqQuestions.slice(0, 30).map((q: any) => ({
      ...q,
      marks: 2,
    }));

    const shortAnswerQuestions = parsed.shortAnswerQuestions.slice(0, 10).map((q: any) => ({
      ...q,
      marks: 4,
    }));

    return { mcqQuestions, shortAnswerQuestions };
  } catch (error: any) {
    console.error("Error generating test with Gemini:", error);
    throw new Error(`Failed to generate test: ${error.message}`);
  }
}

// POST: Generate or get test for a roadmap
export async function POST(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { roadmapId, regenerate } = await request.json();
    
    if (!roadmapId) {
      return NextResponse.json({ error: "roadmapId is required" }, { status: 400 });
    }

    // Check if user has completed the roadmap
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get the roadmap
    const roadmap = await Roadmap.findById(roadmapId);
    if (!roadmap) {
      return NextResponse.json({ error: "Roadmap not found" }, { status: 404 });
    }

    // Check if roadmap is 100% completed
    const userProgress = user.completedRoadmaps?.find(
      (r: any) => r.roadmapId === roadmapId
    );
    
    const totalItems = roadmap.phases.reduce(
      (acc: number, phase: any) => 
        acc + (phase.tasks?.length || 0) + (phase.assignments?.length || 0),
      0
    );
    
    const completedItems = userProgress
      ? (userProgress.completedTasks?.length || 0) + (userProgress.completedAssignments?.length || 0)
      : 0;

    const progressPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    if (progressPercent < 100 && !user.isAdmin) {
      return NextResponse.json(
        { error: "You must complete the roadmap 100% before taking the test" },
        { status: 403 }
      );
    }

    // Check if user already attempted the test
    const existingAttempt = await TestAttempt.findOne({
      userId,
      roadmapId,
      submittedAt: { $exists: true },
    });

    if (existingAttempt && !existingAttempt.canRetry) {
      return NextResponse.json(
        { 
          error: "You have already taken this test",
          attempt: existingAttempt,
          canRetry: false
        },
        { status: 403 }
      );
    }

    // Check for existing test
    let test = await RoadmapTest.findOne({ roadmapId });

    // Generate new test if doesn't exist or admin requested regeneration
    if (!test || (regenerate && user.isAdmin)) {
      const { mcqQuestions, shortAnswerQuestions } = await generateTestWithGemini(roadmap);
      
      if (test && regenerate) {
        // Update existing test
        test.mcqQuestions = mcqQuestions;
        test.shortAnswerQuestions = shortAnswerQuestions;
        test.lastRegeneratedBy = userId;
        test.lastRegeneratedAt = new Date();
        await test.save();
      } else {
        // Create new test
        test = await RoadmapTest.create({
          roadmapId,
          roadmapTitle: roadmap.title,
          mcqQuestions,
          shortAnswerQuestions,
        });
      }
    }

    // Return test without correct answers for taking
    const testForUser = {
      _id: test._id,
      roadmapId: test.roadmapId,
      roadmapTitle: test.roadmapTitle,
      duration: test.duration,
      totalMarks: test.totalMarks,
      passingPercentage: test.passingPercentage,
      mcqQuestions: test.mcqQuestions.map((q: any) => ({
        question: q.question,
        options: q.options,
        marks: q.marks,
      })),
      shortAnswerQuestions: test.shortAnswerQuestions.map((q: any) => ({
        question: q.question,
        marks: q.marks,
      })),
    };

    return NextResponse.json({
      test: testForUser,
      message: regenerate ? "Test regenerated successfully" : "Test retrieved successfully",
    });
  } catch (error: any) {
    console.error("Error in test generation:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// GET: Check if user can take test for a roadmap
export async function GET(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    const { searchParams } = new URL(request.url);
    const roadmapId = searchParams.get("roadmapId");

    if (!roadmapId) {
      return NextResponse.json({ error: "roadmapId is required" }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({
        canTakeTest: false,
        reason: "Not logged in",
        hasAttempted: false,
      });
    }

    // Get user and check roadmap completion
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({
        canTakeTest: false,
        reason: "User not found",
        hasAttempted: false,
      });
    }

    // Get roadmap
    const roadmap = await Roadmap.findById(roadmapId);
    if (!roadmap) {
      return NextResponse.json({
        canTakeTest: false,
        reason: "Roadmap not found",
        hasAttempted: false,
      });
    }

    // Calculate completion percentage
    const userProgress = user.completedRoadmaps?.find(
      (r: any) => r.roadmapId === roadmapId
    );
    
    const totalItems = roadmap.phases.reduce(
      (acc: number, phase: any) => 
        acc + (phase.tasks?.length || 0) + (phase.assignments?.length || 0),
      0
    );
    
    const completedItems = userProgress
      ? (userProgress.completedTasks?.length || 0) + (userProgress.completedAssignments?.length || 0)
      : 0;

    const progressPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    // Check for existing attempt
    const existingAttempt = await TestAttempt.findOne({
      userId,
      roadmapId,
      submittedAt: { $exists: true },
    });

    // Check if test exists
    const testExists = await RoadmapTest.exists({ roadmapId });

    // Check if user has all required profile details (full name, age, gender)
    const hasFullDetails = !!(user.fullName && user.age && user.gender);

    return NextResponse.json({
      canTakeTest: progressPercent >= 100 && !existingAttempt && hasFullDetails,
      progressPercent,
      hasAttempted: !!existingAttempt,
      attempt: existingAttempt,
      testExists: !!testExists,
      hasFullDetails,
      userDetails: {
        fullName: user.fullName || null,
        age: user.age || null,
        gender: user.gender || null,
      },
      missingDetails: !hasFullDetails ? "Please update your profile (full name, age, gender)" : null,
      canRetry: existingAttempt?.canRetry || false,
    });
  } catch (error: any) {
    console.error("Error checking test eligibility:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
