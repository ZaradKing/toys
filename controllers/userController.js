const User = require('../models/User');
const jwt = require('jsonwebtoken');

class UserController {
    // Register new user
    static async register(req, res) {
        try {
            const { name, email, password } = req.body;
            console.log('Attempting to register user:', { name, email });

            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Email already registered'
                });
            }

            // Create new user
            const user = new User({
                name,
                email,
                password
            });

            await user.save();
            console.log('User registered successfully:', user._id);

            // Generate JWT token
            const token = jwt.sign(
                { _id: user._id.toString() },
                process.env.JWT_SECRET || 'default_secret',
                { expiresIn: '24h' }
            );

            res.status(201).json({
                status: 'success',
                data: {
                    user,
                    token
                }
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    }

    // Login user
    static async login(req, res) {
        try {
            const { email, password } = req.body;

            // Find user by email
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Invalid login credentials'
                });
            }

            // Check password
            const isValidPassword = await user.comparePassword(password);
            if (!isValidPassword) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Invalid login credentials'
                });
            }

            // Generate JWT token
            const token = jwt.sign(
                { _id: user._id.toString() },
                process.env.JWT_SECRET || 'default_secret',
                { expiresIn: '24h' }
            );

            res.json({
                status: 'success',
                data: {
                    user,
                    token
                }
            });
        } catch (error) {
            res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    }
}

module.exports = UserController;