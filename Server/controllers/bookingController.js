const Booking = require('../Models/Booking');

exports.createBooking = async (req, res) => {
  try {
    const { doctor, patientName, phone, date, time } = req.body;
    if (!doctor || !patientName || !phone || !date || !time) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const booking = new Booking({ doctor, patientName, phone, date, time });
    const saved = await booking.save();
    return res.status(201).json(saved);
  } catch (err) {
    console.error('Create booking error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('doctor', 'name speciality hospital fee');
    res.json(bookings);
  } catch (err) {
    console.error('Get bookings error', err);
    res.status(500).json({ message: 'Server error' });
  }
};
