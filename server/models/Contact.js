import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String },
    email: { type: String },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["new", "read", "closed"], default: "new" },
  },
  { timestamps: true }
);

export default mongoose.model("Contact", ContactSchema);
