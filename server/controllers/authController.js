const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const nodemailer = require('nodemailer');

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

// @desc    Send OTP to email
// @route   POST /api/auth/send-otp
// @access  Public
const sendEmailOTP = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        res.status(400);
        throw new Error('Please enter an email address');
    }

    const user = await User.findOne({ email });

    if (!user) {
        res.status(404);
        throw new Error('No account found with this email');
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Reset attempts on new OTP request
    user.otp = otp;
    user.otpExpire = otpExpire;
    user.otpAttempts = 0;
    user.otpLockedUntil = null;
    await user.save();

    // Send Email
    const mailOptions = {
        from: `"The Bachelor's Kitchen" <${process.env.SMTP_FROM_EMAIL}>`,
        to: email,
        subject: 'Your Login OTP - The Bachelor\'s Kitchen',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #f59e0b;">Welcome Back!</h2>
                <p>Use the following OTP to log in to your account. This code is valid for 10 minutes.</p>
                <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
                    ${otp}
                </div>
                <p>If you didn't request this, please ignore this email.</p>
                <p>Best regards,<br>The Bachelor's Kitchen Team</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'OTP sent to email' });
    } catch (error) {
        console.error('Email sending failed details:', error);
        res.status(500);
        throw new Error(`Failed to send OTP email: ${error.message}`);
    }
});

// @desc    Verify Email OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyEmailOTP = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        res.status(400);
        throw new Error('Email and OTP are required');
    }

    // Brute-force protection
    if (user.otpLockedUntil && user.otpLockedUntil > new Date()) {
        res.status(429);
        throw new Error('Account locked due to too many failed attempts. Please try again later.');
    }

    if (!user.otp || user.otp !== otp || user.otpExpire < new Date()) {
        user.otpAttempts += 1;
        if (user.otpAttempts >= 5) {
            user.otpLockedUntil = new Date(Date.now() + 30 * 60 * 1000); // Lock for 30 mins
            await user.save();
            res.status(401);
            throw new Error('Too many failed attempts. Account locked for 30 minutes.');
        }
        await user.save();
        res.status(400);
        throw new Error('Invalid or expired OTP');
    }

    // Clear OTP and attempts after successful login
    user.otp = null;
    user.otpExpire = null;
    user.otpAttempts = 0;
    user.otpLockedUntil = null;
    await user.save();

    res.json({
        _id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        address: user.address,
        token: generateToken(user._id)
    });
});


module.exports = {
    registerUser,
    loginUser,
    sendEmailOTP,
    verifyEmailOTP,
    updateUserProfile
};
