import mongoose, { Schema } from "mongoose";

const blogSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: false },
  content: { type: String, required: true }, // HTML content
  coverImage: { type: String },
  author: { type: String, required: true },
  authorId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  link: { type: String },
});

if (mongoose.models.blogs) {
  delete mongoose.models.blogs;
}

const Blog = mongoose.models.blogs || mongoose.model("blogs", blogSchema);
export default Blog;
