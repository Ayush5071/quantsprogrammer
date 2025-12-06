import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Resume from "@/models/resumeModel";
import { getDataFromToken } from "@/helpers/getToken";

connect();

// GET - Fetch user's resume
export async function GET(request: NextRequest) {
  try {
    const userId = getDataFromToken(request);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resume = await Resume.findOne({ user: userId });
    
    if (!resume) {
      return NextResponse.json({ resume: null, message: "No resume found" }, { status: 200 });
    }

    return NextResponse.json({ resume }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Create or Update resume
export async function POST(request: NextRequest) {
  try {
    const userId = getDataFromToken(request);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body.fullName || !body.email || !body.phone) {
      return NextResponse.json(
        { error: "Full name, email, and phone are required" },
        { status: 400 }
      );
    }

    // Check if resume exists for user
    const existingResume = await Resume.findOne({ user: userId });

    if (existingResume) {
      // Update existing resume
      const updatedResume = await Resume.findByIdAndUpdate(
        existingResume._id,
        {
          ...body,
          lastUpdated: new Date()
        },
        { new: true }
      );
      return NextResponse.json({ 
        resume: updatedResume, 
        message: "Resume updated successfully" 
      }, { status: 200 });
    } else {
      // Create new resume
      const newResume = new Resume({
        user: userId,
        ...body
      });
      await newResume.save();
      return NextResponse.json({ 
        resume: newResume, 
        message: "Resume created successfully" 
      }, { status: 201 });
    }
  } catch (error: any) {
    console.error("Resume save error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Delete user's resume
export async function DELETE(request: NextRequest) {
  try {
    const userId = getDataFromToken(request);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await Resume.findOneAndDelete({ user: userId });
    
    if (!result) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Resume deleted successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
