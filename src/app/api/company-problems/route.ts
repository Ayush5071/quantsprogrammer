import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import jwt from "jsonwebtoken";

connect();

// Free companies available without purchase
const FREE_COMPANIES = ["google", "amazon", "microsoft"];

// Helper to get user from request
async function getUserFromRequest(request: NextRequest) {
  try {
    const cookieToken = request.cookies.get("token")?.value;
    if (!cookieToken) return null;

    const decoded = jwt.verify(cookieToken, process.env.TOKEN_SECRET!) as { id: string };
    const user = await User.findById(decoded.id);
    return user;
  } catch (error) {
    return null;
  }
}

// Check if company is free
function isCompanyFree(companyName: string): boolean {
  return FREE_COMPANIES.some(fc => 
    companyName.toLowerCase().includes(fc.toLowerCase())
  );
}

// GET - Fetch companies list
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyName = searchParams.get("company");

    // If no company specified, return list of companies
    if (!companyName) {
      const response = await fetch(
        "https://api.github.com/repos/liquidslr/leetcode-company-wise-problems/contents",
        { next: { revalidate: 3600 } } // Cache for 1 hour
      );
      
      if (!response.ok) {
        return NextResponse.json({ error: "Failed to fetch companies" }, { status: 500 });
      }
      
      const data = await response.json();
      
      const companies = data
        .filter((item: any) => item.type === "dir" && !item.name.startsWith("."))
        .map((item: any) => ({
          name: item.name,
          displayName: item.name.replace(/-/g, " ").replace(/_/g, " "),
          isFree: isCompanyFree(item.name)
        }));
      
      return NextResponse.json({ companies });
    }

    // Fetching problems for a specific company
    const user = await getUserFromRequest(request);
    const hasPurchased = user?.purchases?.oaQuestions?.purchased || false;
    
    // Check if user can access this company
    if (!isCompanyFree(companyName) && !hasPurchased) {
      return NextResponse.json(
        { error: "Please purchase access to view this company's problems" },
        { status: 403 }
      );
    }

    // Fetch problems from GitHub (server-side only)
    let csvText = "";
    
    try {
      const response = await fetch(
        `https://raw.githubusercontent.com/liquidslr/leetcode-company-wise-problems/main/${companyName}/5.%20All.csv`,
        { next: { revalidate: 86400 } } // Cache for 24 hours
      );
      
      if (response.ok) {
        csvText = await response.text();
      } else {
        // Try alternate file name
        const altResponse = await fetch(
          `https://raw.githubusercontent.com/liquidslr/leetcode-company-wise-problems/main/${companyName}/All.csv`,
          { next: { revalidate: 86400 } }
        );
        if (altResponse.ok) {
          csvText = await altResponse.text();
        }
      }
    } catch (err) {
      return NextResponse.json({ error: "Failed to fetch problems" }, { status: 500 });
    }

    if (!csvText) {
      return NextResponse.json({ error: "No problems found for this company" }, { status: 404 });
    }

    // Parse CSV
    const lines = csvText.trim().split("\n");
    const problems: any[] = [];
    
    for (const line of lines) {
      if (!line.trim()) continue;
      
      const parts = line.includes("\t") ? line.split("\t") : line.split(",");
      
      if (parts.length >= 4) {
        const difficulty = parts[0]?.trim().toUpperCase();
        const title = parts[1]?.trim();
        const frequency = parts[2]?.trim();
        const acceptance = parts[3]?.trim();
        const link = parts[4]?.trim() || `https://leetcode.com/problems/${title?.toLowerCase().replace(/\s+/g, "-")}`;
        
        if (difficulty === "DIFFICULTY" || !title || !["EASY", "MEDIUM", "HARD"].includes(difficulty)) {
          continue;
        }
        
        problems.push({
          difficulty,
          title,
          frequency: frequency ? `${(parseFloat(frequency) * 100).toFixed(1)}%` : "N/A",
          acceptance: acceptance ? `${(parseFloat(acceptance) * 100).toFixed(1)}%` : "N/A",
          link: link.startsWith("http") ? link : `https://leetcode.com/problems/${title.toLowerCase().replace(/\s+/g, "-")}`
        });
      }
    }

    return NextResponse.json({ problems, company: companyName });

  } catch (error: any) {
    console.error("Company problems error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
