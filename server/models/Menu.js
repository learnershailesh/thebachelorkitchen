const mongoose = require('mongoose');

const menuSchema = mongoose.Schema({
    date: {
        type: Date,
        required: true,
        unique: true
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

module.exports = mongoose.model('Menu', menuSchema);
