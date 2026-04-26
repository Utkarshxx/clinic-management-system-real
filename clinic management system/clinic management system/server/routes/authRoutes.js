// Import express framework
const express = require('express');
// Import User model
const User = require('../models/User');
// Import authentication helper functions
const { generateToken } = require('../middleware/auth');

// Create router instance
const router = express.Router();

// POST /api/auth/register - Register a new user
router.post('/register', async (req, res) => {
    try {
        // Extract user data from request body
        const { username, email, password, role } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ $or: [{ email }, { username }] });

        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email or username'
            });
        }

        // Create new user
        const user = await User.create({
            username,
            email,
            password, // Will be hashed automatically by pre-save middleware
            role
        });

        // Generate JWT token
        const token = generateToken(user._id);

        // Send success response with token and user data
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Error registering user',
            error: error.message
        });
    }
});

// POST /api/auth/login - Login user
router.post('/login', async (req, res) => {
    try {
        // Extract credentials from request body
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Find user by email and include password field
        const user = await User.findOne({ email }).select('+password');

        // Check if user exists
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Compare password with hashed password in database
        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate JWT token
        const token = generateToken(user._id);

        // Send success response with token and user data
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error logging in',
            error: error.message
        });
    }
});

// GET /api/auth/me - Get current logged in user
// This route requires authentication (will be protected in server.js)
router.get('/me', async (req, res) => {
    try {
        // req.user is set by protect middleware
        const user = await User.findById(req.user.id).select('-password');

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user data',
            error: error.message
        });
    }
});

// Export router
module.exports = router;
