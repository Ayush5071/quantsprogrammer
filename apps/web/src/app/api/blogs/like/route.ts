import { NextResponse } from "next/server";
import Blog from "@/models/blogModel";
import { connect } from "@/dbConfig/dbConfig";

export async function POST(req: Request) {
  await connect();
  
  try {
    const { blogId, userId } = await req.json();
    
    if (!blogId || !userId) {
      return NextResponse.json({ error: "Missing blogId or userId" }, { status: 400 });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Initialize likes array if it doesn't exist
    if (!blog.likes) {
      blog.likes = [];
    }

    const hasLiked = blog.likes.includes(userId);
    
    if (hasLiked) {
      // Unlike: Remove userId from likes array
      blog.likes = blog.likes.filter((id: string) => id !== userId);
    } else {
      // Like: Add userId to likes array
      blog.likes.push(userId);
    }

    await blog.save();

    return NextResponse.json({ 
      success: true, 
      liked: !hasLiked,
      likesCount: blog.likes.length 
    });
  } catch (error) {
    console.error("Like error:", error);
    return NextResponse.json({ error: "Failed to update like" }, { status: 500 });
  }
}
