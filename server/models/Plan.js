const mongoose = require('mongoose');

const planSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    features: [String], // List of features "4 Roti", "Dal"
    durationDays: {
        type: Number,
        default: 30
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Plan', planSchema);
