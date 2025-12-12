import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import InterviewExperience from "@/models/interviewExperienceModel";
import User from "@/models/userModel";
import { Filter } from "bad-words";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  await connect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (id) {
    const doc = await InterviewExperience.findById(id).populate("authorId", "username email");
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (doc.status !== 'approved') return NextResponse.json({ error: "Not approved" }, { status: 403 });
    return NextResponse.json({ experience: doc });
  }
  // Return all approved experiences — support filters: company, tag, query
  const company = searchParams.get("company");
  const tag = searchParams.get("tag");
  const query = searchParams.get("q");
  const filter: any = { status: "approved" };
  if (company) filter.company = { $regex: new RegExp(company, "i") };
  if (tag) filter.tags = { $in: [tag] };
  if (query) filter.$or = [
    { title: { $regex: new RegExp(query, "i") } },
    { subtitle: { $regex: new RegExp(query, "i") } },
    { content: { $regex: new RegExp(query, "i") } },
    { author: { $regex: new RegExp(query, "i") } },
    { company: { $regex: new RegExp(query, "i") } }
  ];

  const list = await InterviewExperience.find(filter).sort({ createdAt: -1 }).populate("authorId", "username email");
  return NextResponse.json({ experiences: list });
}

export async function POST(req: Request) {
  await connect();
  const { title, subtitle, content, tags, company } = await req.json();
  // derive user from signed token; prevent client spoofing of authorId
  async function getUserFromRequest(r: Request) {
    try {
      const cookieHeader = r.headers.get("cookie") || "";
      const match = cookieHeader.match(/(?:^|; )token=([^;]+)/);
      const token = match?.[1];
      if (!token) return null;
      const decoded = jwt.verify(decodeURIComponent(token), process.env.TOKEN_SECRET!) as { id: string };
      const user = await User.findById(decoded.id);
      return user;
    } catch (err) {
      return null;
    }
  }
  const sessionUser = await getUserFromRequest(req);
  if (!sessionUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!title || !content) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const user = sessionUser;
  // sanitize
  const filter = new Filter();
  const cleanTitle = filter.clean(title);
  const cleanSubtitle = subtitle ? filter.clean(subtitle) : "";
  const cleanContent = filter.clean(content);
  const rawContent = content;
  const isProfane = filter.isProfane(content);
  const cleanCompany = company ? filter.clean(company) : undefined;
  const exp = await InterviewExperience.create({
    title: cleanTitle,
    subtitle: cleanSubtitle,
    content: cleanContent,
    rawContent,
    company: cleanCompany,
    author: user.username || user.email,
    authorId: user._id,
    tags,
    status: isProfane ? 'pending' : 'pending',
    approved: false
  });
  return NextResponse.json({ message: "Submitted for approval", experience: exp });
}
