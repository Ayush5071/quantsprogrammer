import { NextResponse } from "next/server";
import Blog from "@/models/blogModel";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";

// PATCH: Edit a blog (only by author)
export async function PATCH(req: Request) {
  await connect();
  const { blogId, authorId, title, content, coverImage, link } = await req.json();
  if (!blogId || !authorId) return NextResponse.json({ error: "Missing blogId or authorId" }, { status: 400 });
  const blog = await Blog.findById(blogId);
  if (!blog) return NextResponse.json({ error: "Blog not found" }, { status: 404 });
  if (blog.authorId !== authorId) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  if (title) blog.title = title;
  if (content) blog.content = content;
  if (coverImage) blog.coverImage = coverImage;
  if (link) blog.link = link;
  blog.updatedAt = new Date();
  await blog.save();
  return NextResponse.json({ message: "Blog updated", blog });
}

// DELETE: Delete a blog (only by admin)
export async function DELETE(req: Request) {
  await connect();
  const { blogId, adminId } = await req.json();
  if (!blogId || !adminId) return NextResponse.json({ error: "Missing blogId or adminId" }, { status: 400 });
  const user = await User.findById(adminId);
  if (!user || !user.isAdmin) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  await Blog.findByIdAndDelete(blogId);
  return NextResponse.json({ message: "Blog deleted" });
}
