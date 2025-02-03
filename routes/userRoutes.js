const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

// Debug logging
router.use((req, res, next) => {
    console.log('User Route accessed:', req.method, req.originalUrl);
    next();
});

// Public routes
router.post('/register', async (req, res) => {
    console.log('Register route hit:', req.body);
    try {
        await UserController.register(req, res);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

router.post('/login', async (req, res) => {
    try {
        await UserController.login(req, res);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

module.exports = router;