import { connect } from "@/dbConfig/dbConfig";
import { RoadmapTest, TestAttempt } from "@/models/roadmapTestModel";
import Certification from "@/models/certificationModel";
import User from "@/models/userModel";
import { NextResponse, NextRequest } from "next/server";
import { getDataFromToken } from "@/helpers/getToken";
import { generateContentWithConfig } from "@/lib/gemini";

connect();

// Generate unique certificate ID
function generateCertificateId(): string {
  const prefix = "QP";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

// Evaluate short answers using Gemini
async function evaluateShortAnswers(
  questions: any[],
  userAnswers: string[],
  roadmapTitle: string
): Promise<{ scores: any[]; totalScore: number }> {
  const evaluationPrompt = `You are an exam evaluator for the "${roadmapTitle}" certification test.
Evaluate each short answer question based on the expected answer and user's response.
Each question is worth 4 marks.

QUESTIONS AND ANSWERS:
${questions
  .map(
    (q: any, idx: number) => `
Question ${idx + 1}: ${q.question}
Expected Answer: ${q.expectedAnswer}
User's Answer: ${userAnswers[idx] || "(No answer provided)"}
`
  )
  .join("\n")}

RESPOND IN THIS EXACT JSON FORMAT (no markdown, no code blocks, just pure JSON):
{
  "evaluations": [
    {
      "questionIndex": 0,
      "marksAwarded": 0,
      "feedback": "Brief feedback explaining the score"
    }
  ]
}

Scoring Guidelines:
- 4 marks: Complete and accurate answer
- 3 marks: Mostly correct with minor issues
- 2 marks: Partially correct, missing key points
- 1 mark: Shows some understanding but mostly incorrect
- 0 marks: Incorrect or no answer

Be fair but strict. Evaluate based on technical accuracy and completeness.`;

  try {
    const jsonText = await generateContentWithConfig(evaluationPrompt, {
      temperature: 0.3,
      maxOutputTokens: 4096,
    });

    if (!jsonText) {
      throw new Error("Invalid response from Gemini");
    }

    const cleanedText = jsonText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    const parsed = JSON.parse(cleanedText);

    const scores = parsed.evaluations.map((e: any) => ({
      questionIndex: e.questionIndex,
      marksAwarded: Math.min(4, Math.max(0, e.marksAwarded)),
      feedback: e.feedback,
    }));

    const totalScore = scores.reduce((sum: number, s: any) => sum + s.marksAwarded, 0);

    return { scores, totalScore };
  } catch (error: any) {
    console.error("Error evaluating with Gemini:", error);
    // Fallback: Give partial marks based on answer length
    const scores = questions.map((q: any, idx: number) => {
      const answer = userAnswers[idx] || "";
      let marks = 0;
      if (answer.length > 100) marks = 2;
      else if (answer.length > 50) marks = 1;
      return {
        questionIndex: idx,
        marksAwarded: marks,
        feedback: "Auto-evaluated due to system error",
      };
    });
    const totalScore = scores.reduce((sum: number, s: any) => sum + s.marksAwarded, 0);
    return { scores, totalScore };
  }
}

// POST: Submit test and get results
export async function POST(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { testId, roadmapId, mcqAnswers, shortAnswers } = await request.json();

    if (!testId || !roadmapId) {
      return NextResponse.json(
        { error: "testId and roadmapId are required" },
        { status: 400 }
      );
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user has full details for certificate
    if (!user.fullName) {
      return NextResponse.json(
        { error: "Please update your full name in profile before taking the test" },
        { status: 400 }
      );
    }

    // Check for existing submitted attempt
    const existingAttempt = await TestAttempt.findOne({
      userId,
      roadmapId,
      submittedAt: { $exists: true },
    });

    if (existingAttempt && !existingAttempt.canRetry) {
      return NextResponse.json(
        { error: "You have already submitted this test" },
        { status: 403 }
      );
    }

    // Get the test
    const test = await RoadmapTest.findById(testId);
    if (!test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 });
    }

    // Calculate MCQ score
    let mcqScore = 0;
    const mcqResults = test.mcqQuestions.map((q: any, idx: number) => {
      const userAnswer = mcqAnswers?.[idx];
      const isCorrect = userAnswer === q.correctAnswer;
      if (isCorrect) mcqScore += q.marks;
      return {
        questionIndex: idx,
        userAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect,
        marks: isCorrect ? q.marks : 0,
      };
    });

    // Evaluate short answers with Gemini
    const { scores: shortAnswerScores, totalScore: shortAnswerScore } =
      await evaluateShortAnswers(
        test.shortAnswerQuestions,
        shortAnswers || [],
        test.roadmapTitle
      );

    // Calculate total
    const totalScore = mcqScore + shortAnswerScore;
    const percentage = Math.round((totalScore / 100) * 100);
    const passed = percentage >= 60;

    // If there was an existing attempt that can be retried, delete it
    if (existingAttempt && existingAttempt.canRetry) {
      await TestAttempt.findByIdAndDelete(existingAttempt._id);
    }

    // Create attempt record
    const attempt = await TestAttempt.create({
      testId,
      userId,
      roadmapId,
      mcqAnswers: mcqAnswers || [],
      shortAnswers: shortAnswers || [],
      mcqScore,
      shortAnswerScore,
      totalScore,
      percentage,
      passed,
      shortAnswerScores,
      submittedAt: new Date(),
    });

    // Issue certificate if passed
    let certification = null;
    if (passed) {
      // Check if certificate already exists
      const existingCert = await Certification.findOne({ userId, roadmapId });
      
      if (!existingCert) {
        certification = await Certification.create({
          userId,
          roadmapId,
          roadmapTitle: test.roadmapTitle,
          userName: user.fullName,
          userEmail: user.email,
          testAttemptId: attempt._id,
          score: totalScore,
          percentage,
          mcqScore,
          shortAnswerScore,
          certificateId: generateCertificateId(),
        });
      } else {
        certification = existingCert;
      }
    }

    return NextResponse.json({
      success: true,
      result: {
        mcqScore,
        shortAnswerScore,
        totalScore,
        percentage,
        passed,
        mcqResults,
        shortAnswerScores,
      },
      attempt,
      certification,
      message: passed
        ? "Congratulations! You passed the test and earned your certificate!"
        : "Unfortunately, you did not pass. You need at least 60% to earn the certificate.",
    });
  } catch (error: any) {
    console.error("Error submitting test:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// GET: Get attempt details
export async function GET(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    const { searchParams } = new URL(request.url);
    const attemptId = searchParams.get("attemptId");
    const roadmapId = searchParams.get("roadmapId");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let attempt;
    if (attemptId) {
      attempt = await TestAttempt.findById(attemptId);
    } else if (roadmapId) {
      attempt = await TestAttempt.findOne({ userId, roadmapId, submittedAt: { $exists: true } });
    }

    if (!attempt) {
      return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
    }

    // Get certification if exists
    const certification = await Certification.findOne({
      userId,
      roadmapId: attempt.roadmapId,
    });

    return NextResponse.json({
      attempt,
      certification,
    });
  } catch (error: any) {
    console.error("Error getting attempt:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
