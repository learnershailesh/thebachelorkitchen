const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

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

    // Check if user exists (phone or email)
    const userExists = await User.findOne({ $or: [{ phone }, { email }] });

    if (userExists) {
        res.status(400);
        throw new Error('User with this phone or email already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
        name,
        phone,
        email,
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

// ... (existing imports)

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

const otpLogin = asyncHandler(async (req, res) => {
    const { phone } = req.body;

    if (!phone) {
        res.status(400);
        throw new Error('Phone number is required');
    }

    // Since Firebase verified the phone on frontend, we find the user in our DB
    const user = await User.findOne({ phone });

    if (!user) {
        res.status(404);
        throw new Error('User not found. Please sign up first.');
    }

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
    otpLogin,
    updateUserProfile
};
