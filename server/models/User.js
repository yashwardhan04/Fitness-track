import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    img: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    goals: {
      weeklyCalories: { type: Number, default: 0 },
      weeklyWorkouts: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);