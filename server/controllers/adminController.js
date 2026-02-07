const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const Menu = require('../models/Menu');
const Video = require('../models/Video');
const Notification = require('../models/Notification');

// @desc    Get All Users with Plan
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
    // 1. Get all customers
    const users = await User.find({ role: 'customer' }).select('-password').sort({ createdAt: -1 });

    // 2. Get all active subscriptions
    const subscriptions = await Subscription.find({ status: 'active' }).populate('planId', 'name');

    // 3. Create a Map for quick lookup: UserId -> PlanName
    const subMap = {};
    subscriptions.forEach(sub => {
        if (sub.userId && sub.planId) {
            subMap[sub.userId.toString()] = sub.planId.name;
        }
    });

    // 4. Merge Data
    const usersWithPlans = users.map(user => ({
        _id: user._id,
        name: user.name,
        phone: user.phone,
        address: user.address,
        createdAt: user.createdAt,
        currentPlan: subMap[user._id.toString()] || 'No Active Plan'
    }));

    res.json(usersWithPlans);
});

// @desc    Get Notifications
// @route   GET /api/admin/notifications
// @access  Private/Admin
const getNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({}).sort({ createdAt: -1 }).limit(20);
    res.json(notifications);
});
// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
    // 1. Total Users
    const totalUsers = await User.countDocuments({});

    // 2. Active Subscriptions
    const activeSubscription = await Subscription.countDocuments({ status: 'active' });

    // 3. Deliveries Scheduled for a specific date
    const { date } = req.query;
    const today = date ? new Date(date) : new Date();
    today.setHours(0, 0, 0, 0);

    const activeSubs = await Subscription.find({
        status: 'active',
        startDate: { $lte: new Date(today.getTime() + 24 * 60 * 60 * 1000) }, // Use next day boundary to be safe
        endDate: { $gte: today }
    }).populate('userId planId'); // Populate to filter out zombies

    let deliveriesToday = 0;
    let skippedToday = 0;

    activeSubs.forEach(sub => {
        // Safety check for deleted users/plans
        if (!sub.userId || !sub.planId) return;

        // Check Paused
        const isPaused = sub.pausedDates?.some(pd => {
            const d = new Date(pd);
            d.setHours(0, 0, 0, 0);
            return d.getTime() === today.getTime();
        });

        // Check Skipped
        const skippedEntry = sub.skippedMeals?.find(s => {
            const d = new Date(s.date);
            d.setHours(0, 0, 0, 0);
            return d.getTime() === today.getTime();
        });

        if (isPaused) {
            // Do not count as delivery
        } else if (skippedEntry) {
            if (skippedEntry.meal === 'both') {
                skippedToday++;
            } else {
                skippedToday++; // Partial skip also counts as a "skip event"
                deliveriesToday++; // Still delivering other meal?
            }
        } else {
            deliveriesToday++;
        }
    });

    res.json({
        totalUsers,
        activeSubscription,
        deliveriesToday,
        skippedToday
    });
});

// @desc    Get Daily Deliveries List
// @route   GET /api/admin/deliveries
// @access  Private/Admin
const getDailyDeliveries = asyncHandler(async (req, res) => {
    const { date } = req.query;
    const today = date ? new Date(date) : new Date();
    today.setHours(0, 0, 0, 0);

    // Find active subscriptions
    const activeSubs = await Subscription.find({
        status: 'active',
        startDate: { $lte: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
        endDate: { $gte: today }
    })
        .populate('userId', 'name address phone')
        .populate('planId', 'name');

    const deliveries = [];

    activeSubs.forEach(sub => {
        // Safety check: skip if user or plan deleted
        if (!sub.userId || !sub.planId) return;

        // Check if today is paused
        const isPaused = sub.pausedDates?.some(pd => {
            const d = new Date(pd);
            d.setHours(0, 0, 0, 0);
            return d.getTime() === today.getTime();
        });

        // Check if skipped
        const skippedEntry = sub.skippedMeals?.find(s => {
            const d = new Date(s.date);
            d.setHours(0, 0, 0, 0);
            return d.getTime() === today.getTime();
        });

        let status = 'Pending';

        if (isPaused) {
            status = 'Paused';
        } else if (skippedEntry) {
            if (skippedEntry.meal === 'both') {
                status = 'Skipped (All)';
            } else if (skippedEntry.meal === 'lunch') {
                status = 'Skipped (Lunch)';
            } else if (skippedEntry.meal === 'dinner') {
                status = 'Skipped (Dinner)';
            }
        }

        deliveries.push({
            id: sub._id,
            name: sub.userId.name,
            address: sub.userId.address,
            phone: sub.userId.phone,
            plan: sub.planId.name,
            status: status
        });
    });

    res.json(deliveries);
});



// --- MENU CONTROLLERS ---

// @desc    Get Menu for a Date (or range)
// @route   GET /api/admin/menu
// @access  Public (or Protected based on usage)
const getMenu = asyncHandler(async (req, res) => {
    const { date, planName } = req.query;
    if (date) {
        const queryDate = new Date(date);
        queryDate.setHours(0, 0, 0, 0);

        const nextDay = new Date(queryDate);
        nextDay.setDate(nextDay.getDate() + 1);

        const filter = {
            date: { $gte: queryDate, $lt: nextDay }
        };

        if (planName) {
            filter.planName = planName;
        }

        const menu = await Menu.findOne(filter);
        res.json(menu || { items: { lunch: [], dinner: [] } });
    } else {
        const menus = await Menu.find({}).sort({ date: -1 }).limit(21); // Increased limit to cover 7 days for 3 plans
        res.json(menus);
    }
});

// @desc    Update/Create Menu
// @route   POST /api/admin/menu
// @access  Private/Admin
const updateMenu = asyncHandler(async (req, res) => {
    const { date, planName, lunch, dinner } = req.body; // lunch/dinner are arrays of strings

    if (!planName) {
        res.status(400);
        throw new Error("Plan name is required");
    }

    const menuDate = new Date(date);
    menuDate.setHours(0, 0, 0, 0);

    const menu = await Menu.findOneAndUpdate(
        { date: menuDate, planName: planName },
        {
            items: { lunch, dinner },
            date: menuDate,
            planName: planName
        },
        { new: true, upsert: true } // Create if not exists
    );

    res.json(menu);
});

// --- VIDEO CONTROLLERS ---

// @desc    Get All Videos
// @route   GET /api/admin/videos
// @access  Public
const getVideos = asyncHandler(async (req, res) => {
    const videos = await Video.find({ active: true }).sort({ createdAt: -1 });
    res.json(videos);
});

// @desc    Add Video
// @route   POST /api/admin/videos
// @access  Private/Admin
const addVideo = asyncHandler(async (req, res) => {
    const { title, url, description } = req.body;

    // Simple Validation
    if (!title || !url) {
        res.status(400);
        throw new Error("Title and URL are required");
    }

    const video = await Video.create({
        title,
        url,
        description
    });

    res.json(video);
});

// @desc    Delete Video
// @route   DELETE /api/admin/videos/:id
// @access  Private/Admin
const deleteVideo = asyncHandler(async (req, res) => {
    await Video.findByIdAndDelete(req.params.id);
    res.json({ message: "Video deleted" });
});


module.exports = {
    getDashboardStats,
    getDailyDeliveries,
    getMenu,
    updateMenu,
    getVideos,
    addVideo,
    deleteVideo,
    getAllUsers,
    getNotifications
};
