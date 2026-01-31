const asyncHandler = require('express-async-handler');
const Subscription = require('../models/Subscription');
const Plan = require('../models/Plan');
const Notification = require('../models/Notification');
// const { addDays } = require('date-fns'); // Removed unused import

// Utility to add days (Native JS version to avoid extra dep for now)
const addDaysDate = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

// @desc    Buy a new subscription
// @route   POST /api/subscription
// @access  Private
const createSubscription = asyncHandler(async (req, res) => {
    const { planId, startDate } = req.body;

    if (!planId) {
        res.status(400);
        throw new Error('Please select a plan');
    }

    // Default 30 days logic
    const start = startDate ? new Date(startDate) : new Date();
    const end = addDaysDate(start, 30);

    const subscription = await Subscription.create({
        userId: req.user.id,
        planId,
        startDate: start,
        endDate: end,
        status: 'active'
    });

    res.status(201).json(subscription);
});

// @desc    Get current user subscription
// @route   GET /api/subscription/me
// @access  Private
const getMySubscription = asyncHandler(async (req, res) => {
    const sub = await Subscription.findOne({
        userId: req.user.id,
        status: 'active'
    }).populate('planId');

    if (sub) {
        // Calculate remaining credit logic here if needed
        res.json(sub);
    } else {
        res.status(404);
        throw new Error('No active subscription found');
    }
});

// @desc    Skip a specific meal (Lunch/Dinner)
// @route   POST /api/subscription/skip
// @access  Private
const skipMeal = asyncHandler(async (req, res) => {
    const { date, meal } = req.body; // e.g. date: "2025-01-22", meal: "lunch"

    if (!['lunch', 'dinner', 'both'].includes(meal)) {
        res.status(400);
        throw new Error('Invalid meal type. Choose lunch, dinner, or both.');
    }

    const sub = await Subscription.findOne({
        userId: req.user.id,
        status: 'active'
    });

    if (!sub) {
        res.status(404);
        throw new Error('No active subscription');
    }

    const skipDate = new Date(date);
    const today = new Date();

    // Check Cutoff: Must be before 10 PM previous day
    // Simple logic: If skipDate is tomorrow, now must be before 10PM today.
    // Normalized comparison:
    // skipDate (00:00) - Today (00:00) >= 1 day. 
    // IF skipDate is Tomorrow, check current hour.

    // Reset times for date comparison
    const checkDate = new Date(skipDate);
    checkDate.setHours(0, 0, 0, 0);
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    // Provide buffer? Strictly: 
    // If skipping tomorrow (T+1), allowed ONLY IF today < 22:00 (10 PM)

    // Difference in time
    const diffTime = checkDate - todayDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 1) {
        res.status(400);
        throw new Error('Cannot skip past or current day meals.');
    }

    if (diffDays === 1) {
        // It is tomorrow. Check current time.
        const currentHour = new Date().getHours();
        if (currentHour >= 22) { // 22 is 10 PM
            res.status(400);
            throw new Error('Cutoff time passed (10:00 PM). Cannot skip tomorrow\'s meal.');
        }
    }

    // Check Skip Limit (Max 5 Days or 10 Meals)
    const totalSkippedMeals = sub.skippedMeals.reduce((acc, s) => {
        return acc + (s.meal === 'both' ? 2 : 1);
    }, 0);

    const mealsToSkip = meal === 'both' ? 2 : 1;

    if (totalSkippedMeals + mealsToSkip > 10) {
        res.status(400);
        throw new Error('Limit reached. You can skip maximum 5 days (10 meals) per month.');
    }

    // Check if already skipped
    const alreadySkipped = sub.skippedMeals.find(s =>
        new Date(s.date).toDateString() === checkDate.toDateString() && s.meal === meal
    );

    if (alreadySkipped) {
        res.status(400);
        throw new Error('Meal already skipped.');
    }

    // Add Skip
    sub.skippedMeals.push({
        date: checkDate,
        meal: meal
    });

    // Handle Balance
    let creditToAdd = 0;
    if (meal === 'both') creditToAdd = 1;
    else creditToAdd = 0.5;

    sub.skipBalance += creditToAdd;

    // Check for extension
    let daysExtended = 0;
    while (sub.skipBalance >= 1) {
        sub.skipBalance -= 1;
        sub.endDate = addDaysDate(sub.endDate, 1);
        daysExtended += 1;
    }

    await sub.save();

    // Create Notification for Admin
    const user = await require('../models/User').findById(req.user.id); // Simple fetch or use req.user if populated (req.user usually from auth middleware has basic info)

    await Notification.create({
        message: `${user?.name || 'User'} skipped ${meal} for ${checkDate.toDateString()}`,
        type: 'order' // New type 'order' or reuse 'system'
    });

    res.json({
        message: `Skipped ${meal}. Balance: ${sub.skipBalance}. Extended by ${daysExtended} days.`,
        subscription: sub
    });
});

// @desc    Undo a skip
// @route   POST /api/subscription/undo-skip
// @access  Private
const unskipMeal = asyncHandler(async (req, res) => {
    const { date, meal } = req.body;

    const sub = await Subscription.findOne({
        userId: req.user.id,
        status: 'active'
    });

    if (!sub) {
        res.status(404);
        throw new Error('No active subscription');
    }

    const skipDate = new Date(date);
    // Reset times
    const checkDate = new Date(skipDate);
    checkDate.setHours(0, 0, 0, 0);

    // 1. Check if actually skipped
    const skipIndex = sub.skippedMeals.findIndex(s =>
        new Date(s.date).toDateString() === checkDate.toDateString() && (s.meal === meal || s.meal === 'both')
    );

    if (skipIndex === -1) {
        res.status(400);
        throw new Error('Meal is not skipped currently.');
    }

    // 2. Check Time Cutoff (Same rules as skipping)
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    const diffTime = checkDate - todayDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 1) {
        // Cannot undo skip for today if it's already today (Assuming preparation started)
        // But maybe we allow undo? Let's stick to safe cutoff: 10 PM Previous Day
        if (diffDays <= 0) {
            res.status(400);
            throw new Error('Cannot undo skip for past/current days.');
        }
    }

    if (diffDays === 1) {
        const currentHour = new Date().getHours();
        if (currentHour >= 22) {
            res.status(400);
            throw new Error('Cutoff time passed. Cannot undo skip for tomorrow.');
        }
    }

    // 3. Remove from Skipped Meals
    // Handle 'both' case separation might be complex if they skip 'both' then want to unskip strictly 'lunch'.
    // For simplicity, we assume one-to-one mapping or simple removal.

    const skippedItem = sub.skippedMeals[skipIndex];

    // If they selected 'both' to skip, and now want to unskip 'lunch', we should split or convert?
    // Current design: user sends 'lunch' or 'dinner' or 'both' to skip.
    // If they skipped 'both', the record shows 'both'.
    // If they try to undo 'lunch' on a 'both' record -> Convert 'both' to 'dinner'.

    let creditToDeduct = 0;

    if (skippedItem.meal === 'both') {
        if (meal === 'both') {
            // Unskip both
            sub.skippedMeals.splice(skipIndex, 1);
            creditToDeduct = 1;
        } else if (meal === 'lunch') {
            // Unskip lunch -> keeps dinner
            skippedItem.meal = 'dinner';
            creditToDeduct = 0.5;
        } else if (meal === 'dinner') {
            // Unskip dinner -> keeps lunch
            skippedItem.meal = 'lunch';
            creditToDeduct = 0.5;
        }
    } else {
        // They skipped 'lunch' and want to undo 'lunch'
        if (skippedItem.meal === meal) {
            sub.skippedMeals.splice(skipIndex, 1);
            creditToDeduct = 0.5;
        } else {
            res.status(400);
            throw new Error(`Cannot undo ${meal} on a ${skippedItem.meal} skip.`);
        }
    }

    // 4. Reverse Balance
    // We add deduct logic. We might need to reduce endDate if balance goes negative.
    // But balance logic here: 
    // We used credit to extend date. 
    // Current Balance = Remainder. 
    // If we deduct 0.5, and Current Balance is 0.5 -> Balance 0. OK.
    // If Current Balance is 0 -> Balance -0.5. We need to shrink endDate by 1 day and add +1 to Balance -> Balance 0.5.

    sub.skipBalance -= creditToDeduct;

    while (sub.skipBalance < 0) {
        // Shrink subscription
        // Inverse of: sub.endDate = addDaysDate(sub.endDate, 1);
        sub.endDate = addDaysDate(sub.endDate, -1);
        sub.skipBalance += 1;
    }

    await sub.save();

    res.json({
        message: `Unskipped ${meal}. Subscription updated.`,
        subscription: sub
    });
});

// @desc    Pause subscription (Placeholder)
// @route   POST /api/subscription/pause
// @access  Private
const pauseSubscription = asyncHandler(async (req, res) => {
    res.status(501);
    throw new Error('Pause subscription service not implemented yet.');
});

module.exports = {
    createSubscription,
    getMySubscription,
    skipMeal,
    unskipMeal,
    pauseSubscription
};
