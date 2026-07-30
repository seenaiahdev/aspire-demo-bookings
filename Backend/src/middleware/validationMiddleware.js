const { body, validationResult } = require('express-validator');

// Validation rules for demo booking registration
const bookingValidationRules = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Full Name must be between 2 and 100 characters'),

  body('mobile')
    .trim()
    .notEmpty()
    .withMessage('Mobile Number is required')
    .matches(/^[0-9]{10}$/)
    .withMessage('Mobile Number must be exactly 10 digits'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email Address is required')
    .isEmail()
    .withMessage('Please provide a valid email address'),

  body('fieldOfStudy')
    .trim()
    .notEmpty()
    .withMessage('Field of Study is required'),

  body('yearOfStudy')
    .trim()
    .notEmpty()
    .withMessage('Year of Study is required'),

  body('demoSlot')
    .trim()
    .notEmpty()
    .withMessage('Demo Booking Slot is required'),
];

// Validation result handler
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = {};
  errors.array().forEach((err) => {
    if (err.path && !extractedErrors[err.path]) {
      extractedErrors[err.path] = err.msg;
    }
  });

  console.log('[Backend Validation Failed]:', extractedErrors, 'Payload:', req.body);

  return res.status(400).json({
    success: false,
    message: 'Validation failed. Please check your inputs.',
    errors: extractedErrors,
  });
};

module.exports = {
  bookingValidationRules,
  validate,
};
