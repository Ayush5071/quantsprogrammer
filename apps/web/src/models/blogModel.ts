import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const blogSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: false },
  content: { type: String, required: true },
  coverImage: { type: String },
  author: { type: String, required: true },
  authorId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  link: { type: String },
  likes: [{ type: String }], // Array of user IDs who liked
  comments: [commentSchema],
});

if (mongoose.models.blogs) {
  delete mongoose.models.blogs;
}

const Blog = mongoose.models.blogs || mongoose.model("blogs", blogSchema);
export default Blog;
