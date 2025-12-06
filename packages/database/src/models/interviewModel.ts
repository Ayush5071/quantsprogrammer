import mongoose from "mongoose";

const InterviewResultSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  questions: { type: [String], required: true }, // Array of all questions
  answers: { type: [String], required: true },   // Array of all answers
  feedback: { type: String, required: true },    // Overall feedback
  score: { type: Number, required: true },       // Overall score
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  createdAt: { type: Date, default: Date.now }
});

const InterviewResult = mongoose.models.InterviewResult || mongoose.model("InterviewResult", InterviewResultSchema);

export default InterviewResult;
