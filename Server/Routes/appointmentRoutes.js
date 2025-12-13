// server/routes/appointmentRoutes.js

const express = require("express");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const auth = require("../middleware/auth");

const router = express.Router();

/*
  POST /appointments/book
  Body:
    - doctorId
    - date (YYYY-MM-DD)
    - timeSlot (string)
*/
router.post("/book", auth, async (req, res) => {
  try {
    const { doctorId, date, timeSlot, notes } = req.body;

    // 1. Basic validation
    if (!doctorId || !date || !timeSlot) {
      return res.status(400).json({ message: "doctorId, date and timeSlot are required" });
    }

    // 2. Doctor exist check
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // 3. Double booking check (same doctor + same date + same timeSlot + booked)
    const existing = await Appointment.findOne({
      doctor: doctorId,
      date,
      timeSlot,
      status: "booked",
    });

    if (existing) {
      return res.status(400).json({
        message: "This slot is already booked for this doctor. Please choose another slot.",
      });
    }

    // 4. Create appointment
    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctorId,
      date,
      timeSlot,
      notes: notes || "",
    });

    return res.status(201).json({
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (err) {
    console.error("POST /appointments/book error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

/*
  GET /appointments/mine
  Logged in user ke saare appointments
*/
router.get("/mine", auth, async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate("doctor", "name specialization location fees")
      .sort({ date: 1 });

    res.json(appointments);
  } catch (err) {
    console.error("GET /appointments/mine error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

/*
  DELETE /appointments/cancel/:id
  Sirf wohi user cancel kar sakta hai jisne book kiya
*/
router.delete("/cancel/:id", auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Check ownership
    if (appointment.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not allowed to cancel this appointment" });
    }

    // Mark as cancelled
    appointment.status = "cancelled";
    await appointment.save();

    res.json({ message: "Appointment cancelled successfully" });
  } catch (err) {
    console.error("DELETE /appointments/cancel/:id error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;