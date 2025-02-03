const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            throw new Error();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded._id });

        if (!user) {
            throw new Error();
        }

        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({
            status: 'error',
            message: 'Please authenticate'
        });
    }
};

// Middleware to check if user is admin
const adminAuth = async (req, res, next) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({
            status: 'error',
            message: 'Access denied. Admin privileges required.'
        });
    }
    next();
};

// Middleware to validate toy owner or admin
const validateToyOwner = async (req, res, next) => {
    try {
        const toy = await Toy.findById(req.params.id);
        if (!toy) {
            return res.status(404).json({
                status: 'error',
                message: 'Toy not found'
            });
        }

        if (toy.user_id.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
            return res.status(403).json({
                status: 'error',
                message: 'Access denied. You can only modify your own toys.'
            });
        }

        req.toy = toy;
        next();
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Server error while validating toy ownership'
        });
    }
};

module.exports = {
    auth,
    adminAuth,
    validateToyOwner
};