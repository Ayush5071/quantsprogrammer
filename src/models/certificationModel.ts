import mongoose, { Schema } from "mongoose";

const certificationSchema = new Schema({
  userId: { type: String, required: true },
  roadmapId: { type: String, required: true },
  issuedAt: { type: Date, default: Date.now },
});

if (mongoose.models.Certification) {
  delete mongoose.models.Certification;
}

const Certification = mongoose.models.Certification || mongoose.model("Certification", certificationSchema);
export default Certification;
