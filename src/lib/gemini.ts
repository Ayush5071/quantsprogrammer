import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini AI client - use apiKey from env or let SDK pick it up automatically
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : new GoogleGenAI({});

console.log("[Gemini] Initialized with API key:", apiKey ? `${apiKey.substring(0, 10)}...` : "auto-detect");

export async function generateContent(prompt: string): Promise<string> {
  try {
    console.log("[Gemini] generateContent called, prompt length:", prompt.length);
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    
    console.log("[Gemini] Response received, text length:", response.text?.length || 0);
    return response.text || "";
  } catch (error: any) {
    console.error("[Gemini] API error:", error.message || error);
    console.error("[Gemini] Full error:", JSON.stringify(error, null, 2));
    throw error;
  }
}

export async function generateContentWithConfig(
  prompt: string,
  config?: {
    temperature?: number;
    maxOutputTokens?: number;
  }
): Promise<string> {
  try {
    console.log("[Gemini] generateContentWithConfig called");
    console.log("[Gemini] Prompt length:", prompt.length);
    console.log("[Gemini] Config:", config);
    
    // Re-initialize client fresh each time to avoid stale state
    const freshAi = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    
    const response = await freshAi.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: config?.temperature ?? 0.7,
        maxOutputTokens: config?.maxOutputTokens ?? 4000,
      },
    });
    
    console.log("[Gemini] Response received");
    console.log("[Gemini] Response.text:", response.text ? `${response.text.length} chars` : "UNDEFINED");
    
    // Try to get text from response.text first
    let text = response.text;
    
    // If text is empty, try extracting from candidates
    if (!text && response.candidates && response.candidates.length > 0) {
      const candidate = response.candidates[0];
      console.log("[Gemini] Trying to extract from candidate...");
      console.log("[Gemini] Finish reason:", candidate.finishReason);
      
      if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
        text = candidate.content.parts.map((p: any) => p.text || "").join("");
        console.log("[Gemini] Extracted from parts:", text ? `${text.length} chars` : "EMPTY");
      }
    }
    
    // Strip markdown code blocks if present
    if (text) {
      // Remove ```json ... ``` wrapper
      const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        console.log("[Gemini] Stripped markdown code block wrapper");
        text = jsonMatch[1].trim();
      }
    }
    
    console.log("[Gemini] Final text length:", text?.length || 0);
    console.log("[Gemini] Final text preview:", text?.substring(0, 200));
    
    return text || "";
  } catch (error: any) {
    console.error("[Gemini] API error:", error.message || error);
    console.error("[Gemini] Error status:", error.status);
    console.error("[Gemini] Error details:", error.errorDetails);
    throw error;
  }
}

export { ai };
