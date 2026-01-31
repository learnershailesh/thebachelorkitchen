const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    type: {
        type: String, // 'address', 'system', 'order'
        default: 'system'
    },
    isRead: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);
