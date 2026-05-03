// Load environment variables from .env file
require('dotenv').config();

// Import required packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import route files
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const patientRoutes = require('./routes/patientRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const labRoutes = require('./routes/labRoutes');
const billRoutes = require('./routes/billRoutes');

// Import authentication middleware
const { protect } = require('./middleware/auth');

// Create Express application
const app = express();

// Define port number from environment variable or default to 5000
const PORT = process.env.PORT || 5000;

// MongoDB connection string from environment variable
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/clinic_management';

// ============================================
// MIDDLEWARE SETUP
// ============================================

// Enable CORS - allows frontend to communicate with backend
app.use(cors({
    origin: process.env.FRONTEND_URL || "*", // Fallback to allow all during setup
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

// Body parser middleware - parses incoming JSON requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Simple logging middleware - logs every request
// This is a custom middleware using app.use()
app.use((req, res, next) => {
    // Log request method and URL
    console.log(`${req.method} ${req.url} - ${new Date().toLocaleString()}`);
    // Call next() to pass control to next middleware
    next();
});

// ============================================
// DATABASE CONNECTION
// ============================================

// Connect to MongoDB database
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB successfully');
        console.log('📊 Database: clinic_management');
    })
    .catch((error) => {
        console.error('❌ MongoDB connection error:', error.message);
    });

// ============================================
// ROUTES SETUP
// ============================================

// Test route - check if server is running
app.get('/', (req, res) => {
    res.json({
        message: 'Clinic Management System API',
        status: 'Server is running',
        endpoints: {
            auth: '/api/auth',
            patients: '/api/patients',
            prescriptions: '/api/prescriptions',
            labs: '/api/labs',
            bills: '/api/bills'
        }
    });
});

// Authentication routes (public - no protection needed)
app.use('/api/auth', authRoutes);

// Protected routes - require JWT token
// All routes below require valid JWT token in Authorization header
app.use('/api/users', protect, userRoutes); // Admin only - user management

// Public routes - no authentication required (for patient portal)
app.use('/api/patients', patientRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/labs', labRoutes);
app.use('/api/bills', billRoutes);

// ============================================
// START SERVER
// ============================================

// Start Express server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
    console.log(`🔐 JWT authentication enabled`);
});
