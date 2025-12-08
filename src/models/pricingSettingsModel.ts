import mongoose from "mongoose";

export interface IPricingSettings {
  _id?: string;
  key: string;
  oaQuestions: number;
  resumeScreeningPremium: number;
  topInterviews: number;
  mockInterviews: number;
  updatedAt: Date;
  updatedBy?: string;
}

const pricingSettingsSchema = new mongoose.Schema<IPricingSettings>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "pricing",
    },
    oaQuestions: {
      type: Number,
      required: true,
      default: 10,
      min: 9, // Instamojo minimum
    },
    resumeScreeningPremium: {
      type: Number,
      required: true,
      default: 10,
      min: 9,
    },
    topInterviews: {
      type: Number,
      required: true,
      default: 10,
      min: 9,
    },
    mockInterviews: {
      type: Number,
      required: true,
      default: 10,
      min: 9,
    },
    updatedBy: {
      type: String,
    },
  },
  { timestamps: true }
);

// Ensure only one pricing document exists
pricingSettingsSchema.pre("save", async function (next) {
  const PricingSettings = mongoose.models.PricingSettings || mongoose.model("PricingSettings", pricingSettingsSchema);
  const existingDoc = await PricingSettings.findOne({ key: "pricing" });
  if (existingDoc && existingDoc._id.toString() !== this._id?.toString()) {
    throw new Error("Only one pricing settings document can exist");
  }
  next();
});

const PricingSettings =
  mongoose.models.PricingSettings ||
  mongoose.model<IPricingSettings>("PricingSettings", pricingSettingsSchema);

export default PricingSettings;
