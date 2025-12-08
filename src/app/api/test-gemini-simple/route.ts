import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    console.log("[TestGemini] API Key exists:", !!apiKey);
    console.log("[TestGemini] API Key preview:", apiKey ? `${apiKey.substring(0, 15)}...` : "NOT SET");
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: "GEMINI_API_KEY not set in environment",
      }, { status: 500 });
    }

    // Initialize directly like in test.js
    const ai = new GoogleGenAI({ apiKey });
    
    console.log("[TestGemini] Calling Gemini API...");
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Say 'Hello, the API is working!' in exactly those words.",
    });
    
    console.log("[TestGemini] Response:", response.text);
    
    return NextResponse.json({
      success: true,
      message: "Gemini API is working!",
      response: response.text,
      apiKeyPreview: `${apiKey.substring(0, 15)}...`,
    });
    
  } catch (error: any) {
    console.error("[TestGemini] Error:", error);
    console.error("[TestGemini] Error message:", error.message);
    console.error("[TestGemini] Error status:", error.status);
    
    return NextResponse.json({
      success: false,
      error: error.message || "Unknown error",
      status: error.status,
      details: error.errorDetails || null,
    }, { status: 500 });
  }
}
