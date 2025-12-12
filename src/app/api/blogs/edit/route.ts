import { NextRequest, NextResponse } from "next/server";
import Blog from "@/models/blogModel";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";
import jwt from "jsonwebtoken";

// PATCH: Edit a blog (only by author)
export async function PATCH(req: Request) {
  await connect();
  const { blogId, title, content, coverImage, link } = await req.json();
  const nextReq = req as unknown as NextRequest;
  const user = await getUserFromRequest(nextReq);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!blogId) return NextResponse.json({ error: "Missing blogId" }, { status: 400 });
  const blog = await Blog.findById(blogId);
  if (!blog) return NextResponse.json({ error: "Blog not found" }, { status: 404 });
  if (blog.authorId.toString() !== user._id.toString()) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  if (title) blog.title = title;
  if (content) blog.content = content;
  if (coverImage) blog.coverImage = coverImage;
  if (link) blog.link = link;
  blog.updatedAt = new Date();
  await blog.save();
  return NextResponse.json({ message: "Blog updated", blog });
}

// DELETE: Delete a blog (only by admin)
async function getUserFromRequest(r: NextRequest) {
  try {
    const cookieToken = r.cookies.get("token")?.value;
    if (!cookieToken) return null;
    const decoded = jwt.verify(cookieToken, process.env.TOKEN_SECRET!) as { id: string };
    const user = await User.findById(decoded.id);
    return user;
  } catch (err) {
    return null;
  }
}

export async function DELETE(req: Request) {
  await connect();
  const body = await req.json();
  const blogId = body.blogId;
  if (!blogId) return NextResponse.json({ error: "Missing blogId" }, { status: 400 });
  const nextReq = req as unknown as NextRequest;
  const user = await getUserFromRequest(nextReq);
  if (!user || !user.isAdmin) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  await Blog.findByIdAndDelete(blogId);
  return NextResponse.json({ message: "Blog deleted" });
}
