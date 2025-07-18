import mongoose from "mongoose";

const schoolSchema = new mongoose.Schema({
  schoolId: {
    type: String,
    unique: true,
  },
  schoolCode: {
    type: String,
    unique: true,
    required: true,
    length: 4,
  },
  schoolName: {
    type: String,
    required: true,
  },
  boardOfAffiliation: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  officialEmail: {
    type: String,
    unique: true,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  iitFoundationInchargeName: {
    type: String,
    required: true,
  },
  inchargeContactNumber: {
    type: String,
    required: true,
  },
  inchargeEmail: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

export const School = mongoose.model('School', schoolSchema);