/**
 * server.js — Express Backend Server Entrypoint
 * Initializes middleware, CORS, JSON parsing, and mounts API route handlers.
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const healthRoutes = require('./routes/health');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

app.use('/api', healthRoutes);
app.use('/api/bookings', bookingRoutes);

app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'Aspire Demo Bookings backend API is running',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      register: 'POST /api/bookings/register',
      verify: 'GET /api/bookings/verify',
    },
  });
});

app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Aspire Demo Bookings backend running on http://localhost:${PORT}`);
});
