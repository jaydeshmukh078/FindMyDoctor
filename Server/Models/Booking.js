const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  patientName: { type: String, required: true },
  phone: { type: String, required: true },
  date: { type: String, required: true },   // could be Date, but string simpler for demo
  time: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Booking', bookingSchema);