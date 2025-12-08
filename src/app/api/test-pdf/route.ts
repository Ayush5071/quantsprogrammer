import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { extractText } from "unpdf";

export async function GET(request: NextRequest) {
  try {
    // Read the resume.pdf from public folder
    const pdfPath = path.join(process.cwd(), "public", "resume.pdf");
    
    console.log("Looking for PDF at:", pdfPath);
    
    if (!fs.existsSync(pdfPath)) {
      return NextResponse.json({
        success: false,
        error: "resume.pdf not found in public folder",
        path: pdfPath
      }, { status: 404 });
    }

    const dataBuffer = fs.readFileSync(pdfPath);
    const uint8Array = new Uint8Array(dataBuffer);
    console.log("PDF file size:", dataBuffer.length, "bytes");

    // Using unpdf (modern library that works with Next.js)
    const result = await extractText(uint8Array, { mergePages: true });
    
    // Handle both array and string response
    const textContent: string = Array.isArray(result.text) 
      ? result.text.join("\n") 
      : String(result.text || "");
    
    console.log("PDF parsed successfully!");
    console.log("Number of pages:", result.totalPages);
    console.log("Text length:", textContent.length);
    console.log("First 500 chars:", textContent.substring(0, 500));

    return NextResponse.json({
      success: true,
      fileInfo: {
        path: pdfPath,
        size: dataBuffer.length,
      },
      extraction: {
        library: "unpdf",
        numPages: result.totalPages,
        textLength: textContent.length,
        text: textContent,
      },
    });

  } catch (error: any) {
    console.error("PDF Test Error:", error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack?.substring(0, 1000),
    }, { status: 500 });
  }
}
