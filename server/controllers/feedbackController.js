const asyncHandler = require('express-async-handler');
const Feedback = require('../models/Feedback');

// @desc    Submit new feedback
// @route   POST /api/feedback
// @access  Private
const submitFeedback = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;

    if (!rating || !comment) {
        res.status(400);
        throw new Error('Please provide rating and comment');
    }

    const feedback = await Feedback.create({
        userId: req.user._id,
        rating,
        comment
    });

    res.status(201).json(feedback);
});

// @desc    Get public feedback (for Landing Page)
// @route   GET /api/feedback/public
// @access  Public
const getPublicFeedback = asyncHandler(async (req, res) => {
    const feedback = await Feedback.find({ isPublic: true })
        .populate('userId', 'name')
        .sort({ createdAt: -1 })
        .limit(10);

    res.json(feedback);
});

// @desc    Get all feedback (for Admin)
// @route   GET /api/feedback/admin/all
// @access  Private/Admin
const getAllFeedback = asyncHandler(async (req, res) => {
    const feedback = await Feedback.find({})
        .populate('userId', 'name email')
        .sort({ createdAt: -1 });

    res.json(feedback);
});

// @desc    Update feedback visibility status
// @route   PUT /api/feedback/admin/status/:id
// @access  Private/Admin
const updateFeedbackStatus = asyncHandler(async (req, res) => {
    const { isPublic } = req.body;
    const feedback = await Feedback.findById(req.params.id);

    if (feedback) {
        feedback.isPublic = isPublic;
        await feedback.save();
        res.json(feedback);
    } else {
        res.status(404);
        throw new Error('Feedback not found');
    }
});

module.exports = {
    submitFeedback,
    getPublicFeedback,
    getAllFeedback,
    updateFeedbackStatus
};
