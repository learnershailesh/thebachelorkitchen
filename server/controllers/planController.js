const asyncHandler = require('express-async-handler');
const Plan = require('../models/Plan');

// @desc    Get all plans
// @route   GET /api/plans
// @access  Public
const getPlans = asyncHandler(async (req, res) => {
    const plans = await Plan.find({});
    res.json(plans);
});

module.exports = {
    getPlans
};
