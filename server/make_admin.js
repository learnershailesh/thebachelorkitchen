require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');

const makeAdmin = async () => {
    // Get phone from command line arg
    const phone = process.argv[2];

    if (!phone) {
        console.error('Please provide a phone number: node make_admin.js <phone>');
        process.exit(1);
    }

    await connectDB();

    const user = await User.findOne({ phone });

    if (user) {
        user.role = 'admin';
        await user.save();
        console.log(`Success! User ${user.name} (${user.phone}) is now an ADMIN.`);
    } else {
        console.error(`User with phone ${phone} not found.`);
    }

    process.exit();
};

makeAdmin();
