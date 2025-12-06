import mongoose from "mongoose";

const TopInterviewSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  company: { type: String, required: true },
  field: { type: String, required: true },
  topics: { type: String, required: true },
  level: { type: String, required: true },
  skills: { type: String, required: true },
  questions: { type: [String], required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  createdAt: { type: Date, default: Date.now },
  // Interview status
  isEnded: { type: Boolean, default: false },
  endedAt: { type: Date },
  endedBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  // Certificate issued to top 3
  certificatesIssued: { type: Boolean, default: false },
  winners: [{
    rank: { type: Number },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    score: { type: Number },
    certificateId: { type: String },
    issuedAt: { type: Date }
  }],
  // Retry control - by default only 1 attempt allowed
  allowRetryForAll: { type: Boolean, default: false }, // If true, everyone can retry
  retryAllowedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }] // Specific users allowed to retry
});

const TopInterview = mongoose.models.TopInterview || mongoose.model("TopInterview", TopInterviewSchema);

export default TopInterview;
