const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { registerUser, loginUser, otpLogin, updateUserProfile } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/send-otp', sendEmailOTP);
router.post('/verify-otp', verifyEmailOTP);
router.put('/profile', protect, updateUserProfile);

module.exports = router;
