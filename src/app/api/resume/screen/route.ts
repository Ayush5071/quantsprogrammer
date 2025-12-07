import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getToken";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

interface ScreeningResult {
  skillMatch: number;
  experienceRelevance: number;
  fakeResumeProbability: string;
  cultureFit: number;
  finalCandidateScore: number;
  traits: {
    leadership: number;
    communication: number;
    collaboration: number;
    stability: number;
    innovation: number;
    ownership: number;
  };
  evidence: string[];
}

async function screenResumeWithGemini(
  jobDescription: string,
  resumeText: string
): Promise<ScreeningResult> {
  const prompt = `You are an expert HR Intelligence System that evaluates resumes for job fit, detects fake claims, and analyzes personality traits to predict culture fit. You must return structured, unbiased, and evidence-based results.

### JOB DESCRIPTION:
${jobDescription}

### CANDIDATE RESUME:
${resumeText}

### OBJECTIVE:
From the JD and Resume, compute the following:

1. **Skill Match Score (0–100)** – based on overlap and relevance of skills & experience with the JD.
2. **Experience Relevance Score (0–100)** – based on role similarity, industry/domain, seniority, and tech stack.
3. **Fake Resume Probability (0–100%)** – detect exaggerated or unrealistic claims.
4. **Culture Fit Score (0–100)** – infer personality traits from resume language and compare them to JD/company preferences.
5. **Final Candidate Score (0–100)** – weighted aggregation of all metrics.
6. **Short Explanation** – 3–6 bullet points justifying each score.

### FAKE RESUME DETECTION LOGIC:
Evaluate and flag suspicious claims using:
* Skill–project coherence (e.g., claiming tech without project evidence)
* Unrealistic experience timelines
* Company legitimacy
* Missing portfolio/LinkedIn/GitHub signals (if referenced)
* Job title inflation or contradictory role history

### CULTURE FIT ANALYSIS:
Infer candidate traits based on wording, achievements, and tone:
Traits to analyze (0–10 scale each):
* Leadership
* Communication clarity
* Collaboration
* Stability/Loyalty
* Innovation mindset
* Initiative/Ownership

### RULES:
* DO NOT invent skills not present in the resume.
* Always justify conclusions with resume text evidence.
* Be strict with fraud/fake detection.
* If information is missing, penalize scores accordingly.
* Maintain professional and neutral tone.

### OUTPUT FORMAT (MANDATORY - Return ONLY valid JSON, no markdown, no extra text):
{
  "skillMatch": 0-100,
  "experienceRelevance": 0-100,
  "fakeResumeProbability": "0-100%",
  "cultureFit": 0-100,
  "finalCandidateScore": 0-100,
  "traits": {
    "leadership": 0-10,
    "communication": 0-10,
    "collaboration": 0-10,
    "stability": 0-10,
    "innovation": 0-10,
    "ownership": 0-10
  },
  "evidence": [
    "Bullet point justification #1",
    "Bullet point justification #2",
    "Bullet point justification #3",
    "Bullet point justification #4",
    "Bullet point justification #5"
  ]
}

Return ONLY the JSON object, nothing else.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 2000,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", errorText);
      throw new Error(`Gemini API error: ${errorText}`);
    }

    const data = await response.json();
    const textContent = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textContent) {
      throw new Error("Invalid response from Gemini");
    }

    // Parse the JSON from response
    const cleanedText = textContent
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const result = JSON.parse(cleanedText);
    return result as ScreeningResult;
  } catch (error) {
    console.error("Error screening resume with Gemini:", error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify user is logged in
    const userId = getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { jobDescription, resumeText } = body;

    if (!jobDescription || !resumeText) {
      return NextResponse.json(
        { error: "Job description and resume text are required" },
        { status: 400 }
      );
    }

    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    const result = await screenResumeWithGemini(jobDescription, resumeText);

    return NextResponse.json({ result }, { status: 200 });
  } catch (error: any) {
    console.error("Resume screening error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to screen resume" },
      { status: 500 }
    );
  }
}
