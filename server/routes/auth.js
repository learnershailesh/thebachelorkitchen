const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { registerUser, loginUser, otpLogin, updateUserProfile } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/otp-login', otpLogin);
router.put('/profile', protect, updateUserProfile);

module.exports = router;
