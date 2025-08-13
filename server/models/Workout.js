import mongoose from "mongoose";

const WorkoutSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: String, required: true },
    workoutName: {
      type: String,
      required: true,
      // unique: true  // remove this to avoid blocking inserts across users/dates
    },
    sets: { type: Number },
    reps: { type: Number },
    weight: { type: Number },
    duration: { type: Number },
    caloriesBurned: { type: Number },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
// Helpful indexes for performance
WorkoutSchema.index({ user: 1, date: -1 });
WorkoutSchema.index({ user: 1, category: 1 });

export default mongoose.model("Workout", WorkoutSchema);