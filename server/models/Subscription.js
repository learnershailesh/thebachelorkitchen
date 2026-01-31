const mongoose = require('mongoose');

const subscriptionSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    planId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Plan'
    },
    status: {
        type: String,
        enum: ['active', 'expired', 'cancelled'],
        default: 'active'
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    skippedMeals: [{
        date: {
            type: Date,
            required: true
        },
        meal: {
            type: String,
            enum: ['lunch', 'dinner', 'both'],
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    skipBalance: {
        type: Number,
        default: 0
    },
    pausedDates: [{
        type: Date // Kept for backward compatibility if needed, or migration
    }]
}, {
    timestamps: true
});

subscriptionSchema.index({ userId: 1 });
subscriptionSchema.index({ status: 1 });
subscriptionSchema.index({ startDate: 1, endDate: 1 });

module.exports = mongoose.model('Subscription', subscriptionSchema);
