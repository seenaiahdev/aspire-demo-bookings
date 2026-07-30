/**
 * bookingRoutes.js — Express Router for Booking Endpoints
 * Maps API routes to controller functions with validation and authentication middlewares.
 */

const express = require('express');
const router = express.Router();
const { bookingValidationRules, validate } = require('../middleware/validationMiddleware');
const { verifyBookingToken } = require('../middleware/authMiddleware');
const { createBooking, verifySession } = require('../controllers/bookingController');

router.post('/register', bookingValidationRules, validate, createBooking);
router.get('/verify', verifyBookingToken, verifySession);

module.exports = router;
