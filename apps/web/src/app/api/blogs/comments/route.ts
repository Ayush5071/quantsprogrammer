import { NextResponse } from "next/server";
import Blog from "@/models/blogModel";
import { connect } from "@/dbConfig/dbConfig";
import { Filter } from "bad-words";

export async function GET(req: Request) {
  await connect();
  
  try {
    const { searchParams } = new URL(req.url);
    const blogId = searchParams.get("blogId");
    
    if (!blogId) {
      return NextResponse.json({ error: "Missing blogId" }, { status: 400 });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      comments: blog.comments || [],
      count: blog.comments?.length || 0
    });
  } catch (error) {
    console.error("Get comments error:", error);
    return NextResponse.json({ error: "Failed to get comments" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await connect();
  
  try {
    const { blogId, userId, userName, content } = await req.json();
    
    if (!blogId || !userId || !userName || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (content.trim().length === 0) {
      return NextResponse.json({ error: "Comment cannot be empty" }, { status: 400 });
    }

    if (content.length > 1000) {
      return NextResponse.json({ error: "Comment is too long (max 1000 characters)" }, { status: 400 });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Initialize comments array if it doesn't exist
    if (!blog.comments) {
      blog.comments = [];
    }

    // Filter profanity
    const filter = new Filter();
    const cleanContent = filter.clean(content);

    const newComment = {
      userId,
      userName,
      content: cleanContent,
      createdAt: new Date(),
    };

    blog.comments.push(newComment);
    await blog.save();

    return NextResponse.json({ 
      success: true, 
      comment: newComment,
      commentsCount: blog.comments.length 
    });
  } catch (error) {
    console.error("Add comment error:", error);
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  await connect();
  
  try {
    const { searchParams } = new URL(req.url);
    const blogId = searchParams.get("blogId");
    const commentId = searchParams.get("commentId");
    const userId = searchParams.get("userId");
    
    if (!blogId || !commentId || !userId) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    const commentIndex = blog.comments?.findIndex(
      (c: any) => c._id.toString() === commentId && c.userId === userId
    );

    if (commentIndex === -1 || commentIndex === undefined) {
      return NextResponse.json({ error: "Comment not found or not authorized" }, { status: 404 });
    }

    blog.comments.splice(commentIndex, 1);
    await blog.save();

    return NextResponse.json({ 
      success: true, 
      commentsCount: blog.comments.length 
    });
  } catch (error) {
    console.error("Delete comment error:", error);
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
  }
}
