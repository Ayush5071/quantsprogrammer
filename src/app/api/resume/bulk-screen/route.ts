import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getToken";
import { generateContentWithConfig } from "@/lib/gemini";

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
  const prompt = `Analyze this resume against the job description. Return ONLY a JSON object.

JOB: ${jobDescription.substring(0, 1000)}

RESUME: ${resumeText.substring(0, 2500)}

Return this exact JSON structure with real values:
{"candidateInfo":{"name":"extracted name","email":"extracted email","phone":"extracted phone"},"skillMatch":75,"experienceRelevance":70,"fakeResumeProbability":"10%","cultureFit":80,"finalCandidateScore":75,"traits":{"leadership":7,"communication":8,"collaboration":7,"stability":8,"innovation":7,"ownership":8},"evidence":["reason 1","reason 2","reason 3"]}`;

  try {
    console.log(`\n=== Screening Resume: ${fileName} ===`);
    console.log(`Resume text length: ${resumeText.length} characters`);
    
    // Use the new Gemini SDK with gemini-2.5-flash
    console.log("[BulkScreen] Calling Gemini API...");
    const text = await generateContentWithConfig(prompt, {
      temperature: 0.5,
      maxOutputTokens: 8000,  // Increased to avoid MAX_TOKENS cutoff
    });
    
    console.log("[BulkScreen] Gemini response received:", text ? `${text.length} chars` : "EMPTY");
    
    if (!text) {
      console.error(`[BulkScreen] Empty response for ${fileName}`);
      throw new Error("Empty AI response");
    }
    
    console.log("[BulkScreen] Response preview:", text.substring(0, 300));

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
