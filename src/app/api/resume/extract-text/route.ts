import { NextRequest, NextResponse } from "next/server";
import { extractText } from "unpdf";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Check file type
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json({ error: "File must be a PDF" }, { status: 400 });
    }

    // Convert File to Uint8Array
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    console.log(`Extracting text from: ${file.name}, size: ${uint8Array.length} bytes`);

    // Extract text using unpdf
    const result = await extractText(uint8Array, { mergePages: true });
    
    // Handle both array and string response
    const textContent = Array.isArray(result.text) 
      ? result.text.join("\n") 
      : String(result.text || "");
    
    console.log(`Extracted ${textContent.length} characters from ${result.totalPages} pages`);

    return NextResponse.json({
      success: true,
      fileName: file.name,
      pageCount: result.totalPages,
      textLength: textContent.length,
      text: textContent,
    });

  } catch (error: any) {
    console.error("PDF extraction error:", error);
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to extract text from PDF",
    }, { status: 500 });
  }
}
