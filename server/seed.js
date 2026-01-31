require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Plan = require('./models/Plan');

const seedPlans = async () => {
    await connectDB();

    const plans = [
        {
            name: "Focus Start Plan",
            price: 2899,
            description: "Basic Plan",
            features: ["Homestyle Comfort Meals", "Freshly Prepared Daily", "Perfect Portion Sizes", "Lunch & Dinner Included"],
            durationDays: 30
        },
        {
            name: "Smart Study Plan",
            price: 3299,
            description: "Standard Plan",
            features: ["Includes Focus Start Benefits", "Weekend Special Treats", "Daily Sweet & Savory Sides", "Brain-Boosting Nutrition"],
            durationDays: 30
        },
        {
            name: "Peak Performance Plan",
            price: 3699,
            description: "Premium Plan",
            features: ["High-Protein Power Meals", "Chef-Curated Healthy Menu", "Low-Oil & Wholesome", "Customized for Performance"],
            durationDays: 30
        },
        {
            name: "Focus Start - Trial Pack",
            price: 750,
            description: "7-Day Trial",
            features: ["Homestyle Comfort Meals", "Freshly Prepared Daily", "Perfect Portion Sizes", "Full focus start benefits"],
            durationDays: 7
        },
        {
            name: "Smart Study - Trial Pack",
            price: 850,
            description: "7-Day Trial",
            features: ["Includes Focus Start Benefits", "Daily Sweet & Savory Sides", "Perfect for busy students"],
            durationDays: 7
        },
        {
            name: "Peak Performance - Trial Pack",
            price: 950,
            description: "7-Day Trial",
            features: ["High-Protein Power Meals", "Low-Oil & Wholesome", "Premium diet menu"],
            durationDays: 7
        }
    ];

    await Plan.deleteMany({});
    await Plan.insertMany(plans);

    console.log('Plans Seeded Successfully!');
    process.exit();
};

seedPlans();
