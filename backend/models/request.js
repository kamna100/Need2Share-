
const mongoose = require("mongoose");
const requestSchema = new mongoose.Schema(
  {
    donationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donation",
      required: true,
    },
    requesterName: {
      type: String,
      required: true,
      trim: true,
    },
    requesterEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    message: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Approved", "Rejected", "Completed"],
    },
    otpHash: {
      type: String,
      default: null,
    },
    otpExpiresAt: {
      type: Date,
      default: null,
    },
    otpVerified: {
      type: Boolean,
      default: false,
    },
    reviewRating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
    reviewComment: {
      type: String,
      default: "",
      trim: true,
    },
    reviewSubmitted: {
      type: Boolean,
      default: false,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Request", requestSchema);
