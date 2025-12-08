import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resumeText, jobDescription } = body;

    if (!resumeText) {
      return NextResponse.json({ error: "resumeText is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY not set" }, { status: 500 });
    }

    // Initialize exactly like test.js
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Analyze this resume and return a JSON object with candidate info and scores.

Resume:
${resumeText.substring(0, 2000)}

${jobDescription ? `Job Description: ${jobDescription.substring(0, 500)}` : ""}

Return ONLY a valid JSON object in this format:
{
  "candidateInfo": {
    "name": "extracted name",
    "email": "extracted email", 
    "phone": "extracted phone"
  },
  "skillMatch": 75,
  "experienceRelevance": 70,
  "fakeResumeProbability": "10%",
  "cultureFit": 80,
  "finalCandidateScore": 75,
  "traits": {
    "leadership": 7,
    "communication": 8,
    "collaboration": 7,
    "stability": 8,
    "innovation": 7,
    "ownership": 8
  },
  "evidence": ["Point 1", "Point 2", "Point 3"]
}`;

    console.log("[TestResume] Calling Gemini with prompt length:", prompt.length);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    console.log("[TestResume] Response object:", JSON.stringify(response, null, 2));
    console.log("[TestResume] Response.text:", response.text);

    if (!response.text) {
      // Check candidates
      if (response.candidates && response.candidates.length > 0) {
        const candidate = response.candidates[0];
        console.log("[TestResume] Candidate finishReason:", candidate.finishReason);
        console.log("[TestResume] Candidate safetyRatings:", JSON.stringify(candidate.safetyRatings, null, 2));
      }
      
      return NextResponse.json({
        success: false,
        error: "Empty response from Gemini",
        candidates: response.candidates,
      });
    }

    return NextResponse.json({
      success: true,
      text: response.text,
      textLength: response.text.length,
    });

  } catch (error: any) {
    console.error("[TestResume] Error:", error);
    return NextResponse.json({
      success: false,
      error: error.message,
      details: error.errorDetails,
    }, { status: 500 });
  }
}

// Also support GET for simple testing
export async function GET(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GEMINI_API_KEY not set" }, { status: 500 });
  }

  const ai = new GoogleGenAI({ apiKey });

  // Simple test
  const prompt = `Extract candidate info from this sample resume text and return JSON:

Ayush Tiwari
+91-9919400789 | ayusht9919@gmail.com
github.com/Ayush5071 | LinkedIn

Education: B.Tech in ECE from MNNIT Allahabad

Return JSON with name, email, phone, and a score from 0-100.`;

  console.log("[TestResume GET] Calling Gemini...");

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: prompt,
    });

    console.log("[TestResume GET] Response:", response.text);
    console.log("[TestResume GET] Candidates:", JSON.stringify(response.candidates, null, 2));

    return NextResponse.json({
      success: true,
      text: response.text,
      candidates: response.candidates,
    });
  } catch (error: any) {
    console.error("[TestResume GET] Error:", error);
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
