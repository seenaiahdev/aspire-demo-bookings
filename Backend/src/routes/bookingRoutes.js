const express = require('express');
const router = express.Router();
const { bookingValidationRules, validate } = require('../middleware/validationMiddleware');
const { verifyBookingToken } = require('../middleware/authMiddleware');
const { createBooking, verifySession } = require('../controllers/bookingController');

// POST /api/bookings/register - Submit registration form
router.post('/register', bookingValidationRules, validate, createBooking);

// GET /api/bookings/verify - Verify JWT token for protected success page
router.get('/verify', verifyBookingToken, verifySession);

module.exports = router;
