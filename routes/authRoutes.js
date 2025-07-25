const express = require('express');
const router = express.Router();
const { register, login , sendOtp, verifyOtp, forgotPassword, resetPassword } = require('../controllers/authController');

// Debug logs (optional)
console.log('Register function exists:', typeof register === 'function');
console.log('Login function exists:', typeof login === 'function');

router.post('/send-otp', sendOtp);

// In authRoutes.js
router.post('/verify-otp', verifyOtp);
// Define routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
// In authRoutes.js

module.exports = router;
