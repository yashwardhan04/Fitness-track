import mongoose from "mongoose";

const PRSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    exercise: { type: String, required: true },
    metric: { type: String, enum: ["weight", "reps", "duration"], required: true },
    value: { type: Number, required: true },
    unit: { type: String, default: "" },
    workout: { type: mongoose.Schema.Types.ObjectId, ref: "Workout" },
    note: { type: String },
  },
  { timestamps: true }
);

PRSchema.index({ user: 1, exercise: 1, metric: 1, value: -1 });

export default mongoose.model("PR", PRSchema);


