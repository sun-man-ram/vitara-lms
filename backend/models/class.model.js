import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
  classId: {
    type: String,
    unique: true,
    required: true,
  },
  schoolId: {
    type: mongoose.Schema.Types.String,
    required: true,
    ref: "School", // 🔗 this makes the reference
  },
  className: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  course: {
    type: String,
    required: true,
    enum: [
      "Integrated MPC",
      "Integrated MBiPC",
      "Olympiad MPC",
      "Olympiad MBiPC",
      "Advanced MPC",
      "Advanced MBiPC",
      "Revised Advanced MPC",
      "Revised Advanced MBiPC",
    ],
  },
}, { timestamps: true });

export const Class = mongoose.model("Class", classSchema);
