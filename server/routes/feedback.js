const express = require('express');
const router = express.Router();
const { submitFeedback, getPublicFeedback, getAllFeedback, updateFeedbackStatus } = require('../controllers/feedbackController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/adminMiddleware');

// Public routes
router.get('/public', getPublicFeedback);

// Private routes (Authenticated users)
router.post('/', protect, submitFeedback);

// Admin routes
router.get('/admin/all', protect, admin, getAllFeedback);
router.put('/admin/status/:id', protect, admin, updateFeedbackStatus);

module.exports = router;
