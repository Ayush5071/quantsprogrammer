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
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true }, // Fix: use "users" to match User model
  createdAt: { type: Date, default: Date.now }
});

const TopInterview = mongoose.models.TopInterview || mongoose.model("TopInterview", TopInterviewSchema);

export default TopInterview;
