import mongoose, { Schema } from "mongoose";

const blogRequestSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  requestedAt: { type: Date, default: Date.now },
  respondedAt: { type: Date },
});

if (mongoose.models.blogrequests) {
  delete mongoose.models.blogrequests;
}

const BlogRequest = mongoose.models.blogrequests || mongoose.model("blogrequests", blogRequestSchema);
export default BlogRequest;
