const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'aspire_next_edu_tech_super_secret_jwt_key_2026';
const JWT_EXPIRES_IN = '24h';

/**
 * Sign a new JWT token containing user booking session data
 */
function signBookingToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verify JWT token from Authorization header or body
 */
function verifyBookingToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : req.body.token || req.query.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Authorization token missing or invalid.',
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userBooking = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired authorization token.',
      error: error.message,
    });
  }
}

module.exports = {
  signBookingToken,
  verifyBookingToken,
};
