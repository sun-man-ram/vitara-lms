import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true, 
  },
  studentName: {
    type: String,
    required: true,
  },
  schoolId: {
    type: mongoose.Schema.Types.String,
    ref: "School", // Reference to School model
    required: true,
  },
  classId: {
    type: mongoose.Schema.Types.String,
    ref: "Class", // Reference to Class model
    required: true,
  },
  rollNo: {
    type: Number,
    required: true,
  },
  parentName: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  }
}, { timestamps: true });

export const Student = mongoose.model("Student", studentSchema);
