import mongoose from 'mongoose';

const resultMBiPCAdvancedSchema = new mongoose.Schema({
  examId: {
    type: String,
    ref: 'Exam',
    required: true
  },
  studentId: {
    type: String,
    ref: 'Student',
    required: true
  },
  marks: {
    m: { type: Number, default: 0 },
    b: { type: Number, default: 0 },
    p: { type: Number, default: 0 },
    c: { type: Number, default: 0 }
  },
  maxMarks: { type: Number, default: 80 },
  status: {
    type: String,
    enum: ['yet to be conducted', 'result yet to upload', 'result updated'],
    default: 'yet to be conducted'
  },
  total: { type: Number, default: 0 },
  sectionRank: { type: Number, default: 0 },
  classRank: { type: Number, default: 0 },
  overallRank: { type: Number, default: 0 }
}, { timestamps: true });

export const ResultMBiPCAdvanced = mongoose.model("ResultMBiPCAdvanced", resultMBiPCAdvancedSchema);
