
const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ["food", "animal", "clothes", "books", "household"],
    },

    itemName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    quantity: {
      type: String,
      required: true,
    },

    availability: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    latitude: {
      type: Number,
      default: null,
    },

    longitude: {
      type: Number,
      default: null,
    },

    donorName: {
      type: String,
      required: true,
      trim: true,
    },

    donorEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    imageUrl: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      default: "Active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donation", donationSchema);
