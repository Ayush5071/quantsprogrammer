import mongoose, { Schema } from "mongoose";

const InterviewExperienceSchema = new Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  content: { type: String, required: true },
  rawContent: { type: String },
  // status: 'pending' | 'approved' | 'rejected'
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  rejectionReason: { type: String },
  rejectedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  rejectedAt: { type: Date },
  company: { type: String },
  author: { type: String, required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tags: { type: [String], default: [] },
  likes: { type: [String], default: [] },
  comments: [
    {
      userId: { type: String },
      userName: { type: String },
      content: { type: String },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  approved: { type: Boolean, default: false },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  approvedAt: { type: Date },
  slug: { type: String },
});

if (mongoose.models.interviewexperiences) {
  delete mongoose.models.interviewexperiences;
}

const InterviewExperience = mongoose.models.interviewexperiences || mongoose.model("interviewexperiences", InterviewExperienceSchema);

export default InterviewExperience;
