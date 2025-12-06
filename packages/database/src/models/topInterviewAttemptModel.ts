import mongoose from "mongoose";

const TopInterviewAttemptSchema = new mongoose.Schema({
  topInterview: { type: mongoose.Schema.Types.ObjectId, ref: "TopInterview", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true }, // Fix: use "users" to match User model
  answers: { type: [String], required: true },
  feedback: { type: String, required: true },
  score: { type: Number, required: true }, // Out of 100
  createdAt: { type: Date, default: Date.now }
});

const TopInterviewAttempt = mongoose.models.TopInterviewAttempt || mongoose.model("TopInterviewAttempt", TopInterviewAttemptSchema);

export default TopInterviewAttempt;
