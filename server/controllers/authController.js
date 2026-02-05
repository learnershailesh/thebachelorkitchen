const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const admin = require('../config/firebaseAdmin');

// Nodemailer Transporter Configuration
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, phone, email, password, address } = req.body;

    if (!name || !phone || !email || !password) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    // Email Regex Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        res.status(400);
        throw new Error('Please enter a valid email address');
    }

    // Phone Regex Validation (10 digits Indian)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
        res.status(400);
        throw new Error('Please enter a valid 10-digit mobile number');
    }

    if (password.length < 6) {
        res.status(400);
        throw new Error('Password must be at least 6 characters long');
    }

    // Check if user exists (phone or email) - Specific checks for better error messages
    const emailExists = await User.findOne({ email: email.toLowerCase() });
    if (emailExists) {
        res.status(400);
        throw new Error('An account with this email already exists');
    }

    const phoneExists = await User.findOne({ phone });
    if (phoneExists) {
        res.status(400);
        throw new Error('An account with this mobile number already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
        name,
        phone,
        email: email.toLowerCase(),
        password: hashedPassword,
        address
    });

    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            phone: user.phone,
            email: user.email,
            role: user.role,
            address: user.address,
            token: generateToken(user._id)
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { phone, password } = req.body;

    // Check for user phone
    const user = await User.findOne({ phone });

    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            name: user.name,
            phone: user.phone,
            email: user.email,
            role: user.role,
            address: user.address,
            token: generateToken(user._id)
        });
    } else {
        res.status(400);
        throw new Error('Invalid credentials');
    }
});

const Notification = require('../models/Notification');

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    if (user) {
        // Check for Address Change
        if (req.body.address && req.body.address !== user.address) {
            await Notification.create({
                message: `User ${user.name} updated their address to: ${req.body.address}`,
                type: 'address'
            });
        }

        user.name = req.body.name || user.name;
        user.address = req.body.address || user.address;
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            phone: updatedUser.phone,
            email: updatedUser.email,
            role: updatedUser.role,
            address: updatedUser.address,
            token: generateToken(updatedUser._id),
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Verify Firebase ID Token and Login/Register
// @route   POST /api/auth/firebase-login
// @access  Public
const firebaseLogin = asyncHandler(async (req, res) => {
    const { idToken } = req.body;

    if (!idToken) {
        res.status(400);
        throw new Error('Firebase ID Token is required');
    }

    try {
        // Verify the ID token
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { phone_number, name, email } = decodedToken;

        if (!phone_number) {
            res.status(400);
            throw new Error('Phone number not found in Firebase token');
        }

        // Find or create user
        let user = await User.findOne({ phone: phone_number });

        if (!user) {
            // New user registration via Firebase
            user = await User.create({
                name: name || 'Firebase User',
                phone: phone_number,
                email: email || `${phone_number}@temp.com`, // Fallback email
                password: await bcrypt.hash(Math.random().toString(36), 10), // Random password for new users
                role: 'customer'
            });
        }

        res.status(200).json({
            _id: user.id,
            name: user.name,
            phone: user.phone,
            email: user.email,
            role: user.role,
            address: user.address,
            token: generateToken(user._id)
        });
    } catch (error) {
        console.error('Firebase token verification failed:', error.message);
        res.status(401);
        throw new Error('Invalid Firebase token');
    }
});



module.exports = {
    registerUser,
    loginUser,
    firebaseLogin,
    updateUserProfile
};
