import mongoose, { Schema } from 'mongoose';

const roadmapSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    checkedData: {
      type: [String],
      default: [], 
    },
    topic: {
      type: String, 
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

if (mongoose.models.roadmap) {
  delete mongoose.models.roadmap;
}

const Roadmap = mongoose.models.roadmaps || mongoose.model("roadmaps", roadmapSchema);

export default Roadmap;
