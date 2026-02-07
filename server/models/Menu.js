const mongoose = require('mongoose');

const menuSchema = mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    planName: {
        type: String,
        required: true,
        enum: ["Focus Start Plan", "Smart Study Plan", "Peak Performance Plan"],
        default: "Focus Start Plan"
    },
    items: {
        lunch: [String],
        dinner: [String]
    },
    image: {
        type: String, // Optional URL
        default: ''
    }
}, {
    timestamps: true
});

// Unique index on date and planName to allow one menu per plan per day
menuSchema.index({ date: 1, planName: 1 }, { unique: true });

module.exports = mongoose.model('Menu', menuSchema);
