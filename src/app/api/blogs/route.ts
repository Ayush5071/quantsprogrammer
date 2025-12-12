import { NextRequest, NextResponse } from "next/server";
import Blog from "@/models/blogModel";
import User from "@/models/userModel";
import { Filter } from "bad-words";
import { connect } from "@/dbConfig/dbConfig";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  await connect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (id) {
    const blog = await Blog.findById(id);
    if (!blog) return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    return NextResponse.json({ blog });
  }
  const blogs = await Blog.find({}).sort({ createdAt: -1 });
  return NextResponse.json({ blogs });
}

export async function POST(req: Request) {
  await connect();
  const { title, description, content, coverImage, link } = await req.json();
  if (!title || !description || !content) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
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
  // Only allow if admin or request accepted
  if (!sessionUser.isAdmin) {
    const reqStatus = await import("@/models/blogRequestModel").then(m => m.default.findOne({ userId: sessionUser._id }));
    if (!reqStatus || reqStatus.status !== "accepted") {
      return NextResponse.json({ error: "Not allowed to create blog" }, { status: 403 });
    }
  }
  // Profanity filter
  const filter = new Filter();
  const cleanTitle = filter.clean(title);
  const cleanDescription = filter.clean(description);
  const cleanContent = filter.clean(content);
  const blog = await Blog.create({ title: cleanTitle, description: cleanDescription, content: cleanContent, coverImage, author: sessionUser.fullName || sessionUser.username, authorId: sessionUser._id, link });
  return NextResponse.json({ message: "Blog created", blog });
}
