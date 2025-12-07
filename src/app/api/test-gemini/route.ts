import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function GET(request: NextRequest) {
  try {
    console.log("Testing Gemini API...");
    console.log("API Key exists:", !!GEMINI_API_KEY);
    console.log("API Key (first 10 chars):", GEMINI_API_KEY?.substring(0, 10) + "...");

    if (!GEMINI_API_KEY) {
      return NextResponse.json({ 
        success: false, 
        error: "GEMINI_API_KEY not configured in environment" 
      }, { status: 500 });
    }

    const testPrompt = `You are a test assistant. Simply respond with: "Hello, Gemini is working!"`;

    // Try multiple models - gemini-1.5-flash has better free tier support
    const models = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-pro"];
    let successData = null;
    let lastError = "";
    let workingModel = "";

    for (const model of models) {
      console.log(`Trying model: ${model}`);
      
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: testPrompt }] }],
              generationConfig: {
                temperature: 0.1,
                maxOutputTokens: 100,
              },
            }),
          }
        );

        console.log(`Model ${model} response status: ${response.status}`);

        if (response.ok) {
          successData = await response.json();
          workingModel = model;
          console.log(`Model ${model} worked!`);
          break;
        } else {
          lastError = await response.text();
          console.log(`Model ${model} failed: ${response.status}`);
        }
      } catch (e: any) {
        console.log(`Model ${model} error: ${e.message}`);
        lastError = e.message;
      }
    }

    if (!successData) {
      return NextResponse.json({ 
        success: false, 
        error: "All Gemini models failed - quota may be exhausted",
        details: lastError,
        triedModels: models
      }, { status: 500 });
    }

    const text = successData.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return NextResponse.json({
      success: true,
      message: "Gemini API is working!",
      model: workingModel,
      geminiResponse: text
    });

  } catch (error: any) {
    console.error("Test Gemini Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
