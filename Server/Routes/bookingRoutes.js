const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// POST create booking
router.post('/', bookingController.createBooking);

// GET all bookings (admin/user view)
router.get('/', bookingController.getBookings);

module.exports = router;
