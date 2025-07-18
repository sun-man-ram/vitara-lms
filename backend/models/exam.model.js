import mongoose from "mongoose";

const examSchema = new mongoose.Schema({
  examId: {
    type: String,
    required: true,
    unique: true
  },
  date: {
    type: Date,
    required: true
  },
  course: {
    type: String,
    required: true,
    enum: [
      "Integrated MPC", "Integrated MBiPC",
      "Olympiad MPC", "Olympiad MBiPC",
      "Advanced MPC", "Advanced MBiPC",
      "Revised Advanced MPC", "Revised Advanced MBiPC"
    ]
  },
  type: {
    type: String,
    required: true,
    enum: ['mains', 'advanced']
  }

}, { timestamps: true });

export const Exam = mongoose.model("Exam", examSchema);
