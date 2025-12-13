const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    // Kis patient ne book kiya
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Kis doctor ke saath booking hai
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    // Appointment ka din (YYYY-MM-DD format me store karenge)
    date: {
      type: String,
      required: true,
    },

    // Kis time slot par (e.g. "10:30 AM – 10:45 AM")
    timeSlot: {
      type: String,
      required: true,
    },

    // Current status of appointment
    status: {
      type: String,
      enum: ["booked", "cancelled", "completed"],
      default: "booked",
    },

    // Optional: short note / reason
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true } // createdAt, updatedAt
);

module.exports = mongoose.model("Appointment", appointmentSchema);