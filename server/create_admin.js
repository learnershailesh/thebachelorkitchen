require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const connectDB = require('./config/db');

const createAdmin = async () => {
    try {
        await connectDB();

        const phone = '9999999999';
        const rawPassword = 'admin';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(rawPassword, salt);

        const user = await User.findOne({ phone });

        if (user) {
            user.password = hashedPassword;
            user.role = 'admin';
            user.name = user.name || 'Admin User';
            await user.save();
            console.log('Admin user updated successfully.');
        } else {
            await User.create({
                name: 'Admin User',
                phone: phone,
                password: hashedPassword,
                role: 'admin',
                address: 'Admin HQ'
            });
            console.log('Admin user created successfully.');
        }

        console.log(`Credentials -> Phone: ${phone}, Password: ${rawPassword}`);
        process.exit();
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
