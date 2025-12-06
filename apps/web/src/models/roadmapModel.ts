import mongoose, { Schema } from 'mongoose';

const assignmentSchema = new Schema({
  title: { type: String, required: true },
  link: { type: String, required: true },
});

const taskSchema = new Schema({
  title: { type: String, required: true },
  link: { type: String, required: true },
});

const phaseSchema = new Schema({
  title: { type: String, required: true },
  tasks: [taskSchema],
  assignments: [assignmentSchema],
});

const roadmapSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    createdBy: { type: String, required: true },//admin user id
    phases: [phaseSchema],
  },
  {
    timestamps: true,
  }
);

if (mongoose.models.Roadmap) {
  delete mongoose.models.Roadmap;
}

const Roadmap = mongoose.models.Roadmap || mongoose.model('Roadmap', roadmapSchema);

export default Roadmap;
