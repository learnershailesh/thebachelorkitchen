const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const admin = asyncHandler(async (req, res, next) => {
    // protect middleware should run before this to set req.user
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as an admin');
    }
});

module.exports = { admin };
