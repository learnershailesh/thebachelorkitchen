const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { createSubscription, getMySubscription, skipMeal, unskipMeal } = require('../controllers/subscriptionController');

router.post('/', protect, createSubscription);
router.get('/me', protect, getMySubscription);
router.post('/skip', protect, skipMeal);
router.post('/undo-skip', protect, unskipMeal);

module.exports = router;
