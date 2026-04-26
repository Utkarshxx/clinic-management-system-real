// Import jwt library for creating tokens
const jwt = require('jsonwebtoken');
// Import User model
const User = require('../models/User');

// Middleware to protect routes - verify JWT token
const protect = async (req, res, next) => {
    let token;

    // Check if Authorization header exists and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract token from header
            // Format: "Bearer <token>"
            token = req.headers.authorization.split(' ')[1];

            // Verify token using JWT secret
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from database using ID from token
            // Exclude password field
            req.user = await User.findById(decoded.id).select('-password');

            // Check if user exists
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Continue to next middleware or route handler
            next();
        } catch (error) {
            console.error('Token verification error:', error.message);
            return res.status(401).json({
                success: false,
                message: 'Not authorized, token failed'
            });
        }
    }

    // If no token found in header
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, no token'
        });
    }
};

// Middleware to restrict access based on user role
// Usage: authorize('Admin', 'Doctor')
const authorize = (...roles) => {
    return (req, res, next) => {
        // Check if user's role is in the allowed roles
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role '${req.user.role}' is not authorized to access this route`
            });
        }
        next();
    };
};

// Helper function to generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

module.exports = { protect, authorize, generateToken };
