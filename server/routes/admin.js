const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/adminMiddleware');
const {
    getDashboardStats,
    getDailyDeliveries,
    getMenu,
    updateMenu,
    getVideos,
    addVideo,
    deleteVideo,
    getAllUsers,
    getNotifications
} = require('../controllers/adminController');

router.get('/stats', protect, admin, getDashboardStats);
router.get('/deliveries', protect, admin, getDailyDeliveries);
router.get('/users', protect, admin, getAllUsers);
router.get('/notifications', protect, admin, getNotifications);

// Menu Routes
router.get('/menu', getMenu); // Public read? Or protect if strict. Let's keep it open for simple fetching or protect if needed. 
// Actually, for user dashboard fetching, we likely need a public route. 
// But here we are in 'admin' routes which usually imply admin access.
// Let's keep Write protected. Read we might expose here or better creates a public /api/content route.
// For now, let's allow admin read here.
router.post('/menu', protect, admin, updateMenu);

// Video Routes
router.get('/videos', getVideos);
router.post('/videos', protect, admin, addVideo);
router.delete('/videos/:id', protect, admin, deleteVideo);

module.exports = router;
