import { NextRequest, NextResponse } from "next/server";
import TopInterview from "@/models/topInterviewModel";
import TopInterviewAttempt from "@/models/topInterviewAttemptModel";
import User from "@/models/userModel";
import mongoose from "mongoose";
import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getToken";
import nodemailer from "nodemailer";

// Generate unique certificate ID
function generateCertificateId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = 'TI-';
  for (let i = 0; i < 8; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id + '-' + Date.now().toString(36).toUpperCase();
}

// Send certificate email to winners
async function sendWinnerEmail(
  email: string, 
  userName: string, 
  rank: number, 
  interviewTitle: string,
  score: number,
  certificateId: string
) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const domain = (process.env.DOMAIN || process.env.NEXT_PUBLIC_BASE_URL || "https://www.prepsutra.tech")?.replace(/\/$/, "");
  
  const rankEmojis: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };
  const rankNames: Record<number, string> = { 1: '1st Place', 2: '2nd Place', 3: '3rd Place' };

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `🏆 Congratulations! You've Won ${rankNames[rank]} in "${interviewTitle}" - PrepSutra`,
    html: `
      <div style="background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%); color: #fff; padding: 40px 20px; font-family: 'Segoe UI', Arial, sans-serif;">
        <div style="max-width: 600px; margin: auto; background: rgba(17, 17, 24, 0.95); border-radius: 20px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 30px; text-align: center;">
            <img src="${domain}/official_logo.png" alt="PrepSutra" style="width: 60px; height: 60px; border-radius: 50%; margin-bottom: 15px;" />
            <h1 style="font-size: 28px; color: #fff; margin: 0; font-weight: bold;">PrepSutra</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 5px 0 0 0; font-size: 14px;">Master the Art of Development</p>
          </div>
          
          <!-- Trophy Section -->
          <div style="padding: 40px 30px; text-align: center;">
            <div style="font-size: 80px; margin-bottom: 20px;">${rankEmojis[rank]}</div>
            <h2 style="color: #fbbf24; font-size: 32px; margin: 0 0 10px 0; font-weight: bold;">
              Congratulations, ${userName}!
            </h2>
            <p style="color: #9ca3af; font-size: 16px; margin: 0;">
              You've achieved an incredible result!
            </p>
          </div>
          
          <!-- Achievement Card -->
          <div style="margin: 0 30px 30px; padding: 25px; background: rgba(59, 130, 246, 0.1); border-radius: 16px; border: 1px solid rgba(59, 130, 246, 0.2);">
            <div style="text-align: center; margin-bottom: 20px;">
              <span style="color: #60a5fa; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Top Interview</span>
              <h3 style="color: #fff; font-size: 22px; margin: 8px 0 0 0; font-weight: bold;">${interviewTitle}</h3>
            </div>
            
            <div style="display: flex; justify-content: space-around; text-align: center; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1);">
              <div>
                <p style="color: #9ca3af; font-size: 11px; text-transform: uppercase; margin: 0 0 5px 0;">Rank</p>
                <p style="color: #fbbf24; font-size: 24px; font-weight: bold; margin: 0;">${rankNames[rank]}</p>
              </div>
              <div>
                <p style="color: #9ca3af; font-size: 11px; text-transform: uppercase; margin: 0 0 5px 0;">Score</p>
                <p style="color: #22c55e; font-size: 24px; font-weight: bold; margin: 0;">${score}/100</p>
              </div>
            </div>
          </div>
          
          <!-- Certificate Section -->
          <div style="margin: 0 30px 30px; padding: 20px; background: rgba(34, 197, 94, 0.1); border-radius: 12px; border: 1px solid rgba(34, 197, 94, 0.2); text-align: center;">
            <p style="color: #22c55e; font-size: 14px; margin: 0 0 8px 0;">🎓 Certificate Issued</p>
            <p style="color: #fff; font-size: 12px; margin: 0;">Certificate ID: <strong style="color: #fbbf24; font-family: monospace;">${certificateId}</strong></p>
          </div>
          
          <!-- CTA Button -->
          <div style="padding: 0 30px 30px; text-align: center;">
            <a href="${domain}/profile?tab=certificates" 
               style="display: inline-block; padding: 14px 35px; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: #fff; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px;">
              View Your Certificate
            </a>
          </div>
          
          <!-- Footer -->
          <div style="padding: 25px; background: rgba(0,0,0,0.3); text-align: center; border-top: 1px solid rgba(255,255,255,0.05);">
            <p style="color: #6b7280; font-size: 13px; margin: 0 0 10px 0;">Thank you for participating in PrepSutra Top Interviews!</p>
            <p style="color: #4b5563; font-size: 12px; margin: 0;">
              <a href="${domain}" style="color: #60a5fa; text-decoration: none;">www.prepsutra.tech</a>
            </p>
          </div>
          
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

// POST - End a top interview and issue certificates to top 3
export async function POST(req: NextRequest) {
  try {
    if (mongoose.connection.readyState === 0) await connect();
    
    const tokenUserId = getDataFromToken(req);
    const adminUser = await User.findById(tokenUserId).lean();
    const admin = Array.isArray(adminUser) ? adminUser[0] : adminUser;
    
    // Check admin via env variable or database flag
    const adminEmails = process.env.ADMINS ? process.env.ADMINS.split(",").map(e => e.trim().toLowerCase()) : [];
    const userEmail = (admin as any)?.email?.trim().toLowerCase() || "";
    const isAdmin = adminEmails.includes(userEmail) || (admin as any)?.isAdmin === true;
    
    if (!admin || !isAdmin) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const body = await req.json();
    const { interviewId } = body;

    if (!interviewId) {
      return NextResponse.json({ error: "Interview ID is required" }, { status: 400 });
    }

    // Find the interview
    const interview = await TopInterview.findById(interviewId);
    if (!interview) {
      return NextResponse.json({ error: "Interview not found" }, { status: 404 });
    }

    if (interview.isEnded) {
      return NextResponse.json({ error: "Interview has already ended" }, { status: 400 });
    }

    // Get all attempts for this interview, sorted by score (highest first)
    const attempts = await TopInterviewAttempt.find({ topInterview: interviewId })
      .populate('user', 'username email fullName')
      .sort({ score: -1, createdAt: 1 })
      .lean();

    // Get unique best attempts per user
    const uniqueAttempts = Object.values(
      attempts.reduce((acc: Record<string, any>, a: any) => {
        const odId = a.user?._id?.toString();
        if (odId && (!acc[odId] || a.score > acc[odId].score)) {
          acc[odId] = a;
        }
        return acc;
      }, {} as Record<string, any>)
    ).sort((a: any, b: any) => b.score - a.score || new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    // Get top 3 winners
    const top3 = uniqueAttempts.slice(0, 3);
    const winners: any[] = [];

    for (let i = 0; i < top3.length; i++) {
      const attempt = top3[i] as any;
      const rank = i + 1;
      const certificateId = generateCertificateId();
      
      winners.push({
        rank,
        userId: attempt.user._id,
        score: attempt.score,
        certificateId,
        issuedAt: new Date()
      });

      // Send email to winner
      try {
        await sendWinnerEmail(
          attempt.user.email,
          attempt.user.fullName || attempt.user.username,
          rank,
          interview.title,
          attempt.score,
          certificateId
        );
      } catch (emailErr) {
        console.error(`Failed to send email to rank ${rank}:`, emailErr);
      }
    }

    // Update interview as ended
    interview.isEnded = true;
    interview.endedAt = new Date();
    interview.endedBy = admin._id;
    interview.certificatesIssued = true;
    interview.winners = winners;
    await interview.save();

    return NextResponse.json({
      success: true,
      message: `Interview ended successfully. Certificates issued to ${winners.length} winner(s).`,
      winners: winners.map((w, i) => ({
        rank: w.rank,
        userName: (top3[i] as any).user.fullName || (top3[i] as any).user.username,
        score: w.score,
        certificateId: w.certificateId
      }))
    });

  } catch (error: any) {
    console.error("Error ending interview:", error);
    return NextResponse.json({ error: error.message || "Failed to end interview" }, { status: 500 });
  }
}

// GET - Get interview status
export async function GET(req: NextRequest) {
  try {
    if (mongoose.connection.readyState === 0) await connect();
    
    const { searchParams } = new URL(req.url);
    const interviewId = searchParams.get('id');

    if (!interviewId) {
      return NextResponse.json({ error: "Interview ID is required" }, { status: 400 });
    }

    const interview = await TopInterview.findById(interviewId)
      .select('isEnded endedAt winners certificatesIssued')
      .lean();

    if (!interview) {
      return NextResponse.json({ error: "Interview not found" }, { status: 404 });
    }

    return NextResponse.json(interview);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
