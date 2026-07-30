const express = require('express');
const { getBookings } = require('../controllers/bookingController');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'aspire-demo-bookings-backend' });
});

router.get('/bookings', getBookings);

module.exports = router;
