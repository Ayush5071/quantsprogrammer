import { NextResponse } from "next/server";
import Blog from "@/models/blogModel";
import User from "@/models/userModel";
import { Filter } from "bad-words";
import { connect } from "@/dbConfig/dbConfig";

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
  const { title, description, content, coverImage, author, authorId, link } = await req.json();
  if (!title || !description || !content || !author || !authorId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const user = await User.findById(authorId);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  // Only allow if admin or request accepted
  if (!user.isAdmin) {
    const reqStatus = await import("@/models/blogRequestModel").then(m => m.default.findOne({ userId: authorId }));
    if (!reqStatus || reqStatus.status !== "accepted") {
      return NextResponse.json({ error: "Not allowed to create blog" }, { status: 403 });
    }
  }
  // Profanity filter
  const filter = new Filter();
  const cleanTitle = filter.clean(title);
  const cleanDescription = filter.clean(description);
  const cleanContent = filter.clean(content);
  const blog = await Blog.create({ title: cleanTitle, description: cleanDescription, content: cleanContent, coverImage, author, authorId, link });
  return NextResponse.json({ message: "Blog created", blog });
}
