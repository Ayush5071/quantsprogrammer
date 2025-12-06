import mongoose, { Schema } from "mongoose";

const certificationSchema = new Schema({
  userId: { type: String, required: true },
  roadmapId: { type: String, required: true },
  roadmapTitle: { type: String, required: true },
  
  // User details (captured at time of certification)
  userName: { type: String, required: true },
  userEmail: { type: String },
  
  // Test results
  testAttemptId: { type: Schema.Types.ObjectId, ref: "TestAttempt" },
  score: { type: Number, required: true }, // Total score out of 100
  percentage: { type: Number, required: true },
  mcqScore: { type: Number }, // Out of 60
  shortAnswerScore: { type: Number }, // Out of 40
  
  // Certificate details
  certificateId: { type: String, required: true, unique: true }, // Unique certificate ID
  issuedAt: { type: Date, default: Date.now },
  
  // Verification
  isValid: { type: Boolean, default: true },
});

// Index for efficient queries
certificationSchema.index({ userId: 1, roadmapId: 1 }, { unique: true });
certificationSchema.index({ certificateId: 1 });

if (mongoose.models.Certification) {
  delete mongoose.models.Certification;
}

const Certification = mongoose.models.Certification || mongoose.model("Certification", certificationSchema);
export default Certification;
