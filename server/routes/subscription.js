const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/adminMiddleware');
const {
    createSubscription,
    getMySubscription,
    skipMeal,
    unskipMeal,
    getAllSubscriptions,
    verifySubscription
} = require('../controllers/subscriptionController');

router.post('/', protect, createSubscription);
router.get('/me', protect, getMySubscription);
router.post('/skip', protect, skipMeal);
router.post('/undo-skip', protect, unskipMeal);

// Admin Routes
router.get('/admin/all', protect, admin, getAllSubscriptions);
router.put('/verify/:id', protect, admin, verifySubscription);

module.exports = router;
