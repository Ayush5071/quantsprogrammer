import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getToken";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

interface CandidateInfo {
  name: string;
  email: string;
  phone: string;
}

interface ScreeningResult {
  fileName: string;
  pageCount: number;
  isDisqualified: boolean;
  disqualificationReason?: string;
  candidateInfo: CandidateInfo;
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

interface BulkScreeningResponse {
  totalResumes: number;
  screenedResumes: number;
  disqualifiedResumes: number;
  results: ScreeningResult[];
  topPerformers: {
    name: string;
    email: string;
    phone: string;
    score: number;
  }[];
  analytics: {
    averageScore: number;
    averageSkillMatch: number;
    averageExperience: number;
    averageCultureFit: number;
    scoreDistribution: {
      excellent: number; // 80-100
      good: number; // 60-79
      average: number; // 40-59
      poor: number; // 0-39
    };
  };
}

// Helper function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function screenResumeWithGemini(
  jobDescription: string,
  resumeText: string,
  fileName: string
): Promise<Omit<ScreeningResult, 'fileName' | 'pageCount' | 'isDisqualified' | 'disqualificationReason'>> {
  const prompt = `You are an expert HR Intelligence System that evaluates resumes for job fit, detects fake claims, and analyzes personality traits. You must return structured, unbiased, and evidence-based results.

### JOB DESCRIPTION:
${jobDescription}

### CANDIDATE RESUME:
${resumeText}

### OBJECTIVE:
Analyze this resume and extract:

1. **Candidate Information** - Extract name, email, and phone number from resume
2. **Skill Match Score (0–100)** – based on overlap and relevance of skills with the JD.
3. **Experience Relevance Score (0–100)** – based on role similarity, industry, seniority.
4. **Fake Resume Probability (0–100%)** – detect exaggerated or unrealistic claims.
5. **Culture Fit Score (0–100)** – infer personality traits from resume language.
6. **Final Candidate Score (0–100)** – weighted aggregation of all metrics.
7. **Personality Traits (0–10 each)**: Leadership, Communication, Collaboration, Stability, Innovation, Ownership
8. **Evidence** – 3–5 bullet points justifying the scores.

### OUTPUT FORMAT (MANDATORY - Return ONLY valid JSON, no markdown):
{
  "candidateInfo": {
    "name": "Full Name or 'Not Found'",
    "email": "email@example.com or 'Not Found'",
    "phone": "Phone Number or 'Not Found'"
  },
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
    "Point 1",
    "Point 2",
    "Point 3"
  ]
}

Return ONLY the JSON object, nothing else.`;

  try {
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY not configured");
    }
    
    console.log(`\n=== Screening Resume: ${fileName} ===`);
    console.log(`Resume text (first 500 chars): ${resumeText.substring(0, 500)}...`);
    console.log(`Resume text length: ${resumeText.length} characters`);
    
    // Retry logic for rate limiting
    let response;
    let retryCount = 0;
    const maxRetries = 3;
    const models = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-pro"]; // Try different models
    let modelIndex = 0;
    
    while (retryCount < maxRetries) {
      const currentModel = models[modelIndex % models.length];
      console.log(`Trying model: ${currentModel}`);
      
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${GEMINI_API_KEY}`,
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
      
      // If rate limited (429), wait and retry
      if (response.status === 429) {
        retryCount++;
        const waitTime = 15000 * retryCount; // 15s, 30s, 45s
        console.log(`Rate limited for ${fileName}. Waiting ${waitTime/1000}s before retry ${retryCount}/${maxRetries}...`);
        await delay(waitTime);
        continue;
      }
      
      break; // Success or other error, exit loop
    }

    if (!response || !response.ok) {
      const errorData = response ? await response.text() : "No response";
      console.error(`Gemini API error for ${fileName}:`, response?.status, errorData);
      throw new Error(`Gemini API error: ${response?.status || "unknown"}`);
    }

    const data = await response.json();
    
    // Check for blocked content or empty response
    if (data.candidates?.[0]?.finishReason === "SAFETY") {
      console.warn(`Content blocked for ${fileName}`);
      throw new Error("Content blocked by safety filters");
    }
    
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    if (!text) {
      console.error(`Empty response for ${fileName}:`, JSON.stringify(data));
      throw new Error("Empty AI response");
    }

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid AI response format");
    }

    const result = JSON.parse(jsonMatch[0]);
    return result;
  } catch (error: any) {
    console.error(`Error screening resume ${fileName}:`, error.message || error);
    // Return default values on error - but mark as processed, not disqualified
    return {
      candidateInfo: { name: "Processing Error", email: "Not Found", phone: "Not Found" },
      skillMatch: 50,
      experienceRelevance: 50,
      fakeResumeProbability: "N/A",
      cultureFit: 50,
      finalCandidateScore: 50,
      traits: {
        leadership: 5,
        communication: 5,
        collaboration: 5,
        stability: 5,
        innovation: 5,
        ownership: 5,
      },
      evidence: [`Unable to analyze: ${error.message || "AI processing error"}. Please try again or check the PDF content.`],
    };
  }
}

// POST - Screen multiple resumes
export async function POST(request: NextRequest) {
  try {
    // Verify user is authenticated
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { jobDescription, resumes } = body;
    // resumes: Array<{ fileName: string, text: string, pageCount: number }>

    if (!jobDescription || !resumes || !Array.isArray(resumes)) {
      return NextResponse.json(
        { error: "Job description and resumes array are required" },
        { status: 400 }
      );
    }

    const results: ScreeningResult[] = [];
    let disqualifiedCount = 0;

    // Process each resume
    for (const resume of resumes) {
      const { fileName, text, pageCount } = resume;

      // Check page count - disqualify if > 2 pages
      if (pageCount > 2) {
        results.push({
          fileName,
          pageCount,
          isDisqualified: true,
          disqualificationReason: `Resume exceeds 2-page limit (${pageCount} pages)`,
          candidateInfo: { name: "N/A", email: "N/A", phone: "N/A" },
          skillMatch: 0,
          experienceRelevance: 0,
          fakeResumeProbability: "N/A",
          cultureFit: 0,
          finalCandidateScore: 0,
          traits: {
            leadership: 0,
            communication: 0,
            collaboration: 0,
            stability: 0,
            innovation: 0,
            ownership: 0,
          },
          evidence: ["Disqualified: Resume exceeds 2-page maximum limit"],
        });
        disqualifiedCount++;
        continue;
      }

      // Screen the resume with AI
      const aiResult = await screenResumeWithGemini(jobDescription, text, fileName);

      results.push({
        fileName,
        pageCount,
        isDisqualified: false,
        ...aiResult,
      });
      
      // Add delay between resumes to avoid rate limiting (2 seconds)
      if (resumes.indexOf(resume) < resumes.length - 1) {
        console.log("Waiting 2s before next resume to avoid rate limits...");
        await delay(2000);
      }
    }

    // Calculate analytics
    const qualifiedResults = results.filter(r => !r.isDisqualified);
    const scores = qualifiedResults.map(r => r.finalCandidateScore);
    
    const analytics = {
      averageScore: scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
      averageSkillMatch: qualifiedResults.length > 0 
        ? Math.round(qualifiedResults.reduce((a, b) => a + b.skillMatch, 0) / qualifiedResults.length) 
        : 0,
      averageExperience: qualifiedResults.length > 0 
        ? Math.round(qualifiedResults.reduce((a, b) => a + b.experienceRelevance, 0) / qualifiedResults.length) 
        : 0,
      averageCultureFit: qualifiedResults.length > 0 
        ? Math.round(qualifiedResults.reduce((a, b) => a + b.cultureFit, 0) / qualifiedResults.length) 
        : 0,
      scoreDistribution: {
        excellent: qualifiedResults.filter(r => r.finalCandidateScore >= 80).length,
        good: qualifiedResults.filter(r => r.finalCandidateScore >= 60 && r.finalCandidateScore < 80).length,
        average: qualifiedResults.filter(r => r.finalCandidateScore >= 40 && r.finalCandidateScore < 60).length,
        poor: qualifiedResults.filter(r => r.finalCandidateScore < 40).length,
      },
    };

    // Get top performers (score >= 60, sorted by score)
    const topPerformers = qualifiedResults
      .filter(r => r.finalCandidateScore >= 60)
      .sort((a, b) => b.finalCandidateScore - a.finalCandidateScore)
      .slice(0, 10)
      .map(r => ({
        name: r.candidateInfo.name,
        email: r.candidateInfo.email,
        phone: r.candidateInfo.phone,
        score: r.finalCandidateScore,
      }));

    const response: BulkScreeningResponse = {
      totalResumes: resumes.length,
      screenedResumes: qualifiedResults.length,
      disqualifiedResumes: disqualifiedCount,
      results,
      topPerformers,
      analytics,
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Bulk screening error:", error);
    return NextResponse.json(
      { error: "Failed to screen resumes" },
      { status: 500 }
    );
  }
}
