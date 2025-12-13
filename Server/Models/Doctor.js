// server/models/Doctor.js

const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    // Basic info
    name: {
      type: String,
      required: true,
      trim: true,
    },

    specialization: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    // Professional info
    fees: {
      type: Number,
      required: true,
    },

    experience: {
      type: Number,
      default: 1, // years
    },

    about: {
      type: String,
      default: "",
    },

    imageUrl: {
      type: String,
      default: "",
    },

    // Contact / clinic info
    contactNumber: {
      type: String,
      default: "",
    },

    clinicAddress: {
      type: String,
      default: "",
    },

    // Ratings system
    ratingAverage: {
      type: Number,
      default: 4.5,
      min: 1,
      max: 5,
    },

    ratingCount: {
      type: Number,
      default: 0,
    },

    // Timings (general clinic timings)
    timings: {
      start: { type: String, default: "10:00 AM" },
      end: { type: String, default: "06:00 PM" },
    },

    // Availability: date-wise time slots
    availableSlots: [
      {
        date: { type: String, required: true }, // "YYYY-MM-DD"
        slots: [{ type: String }],             // ["10:00 AM", "10:30 AM"]
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);
