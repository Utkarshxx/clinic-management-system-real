// Script to create default admin user
// Run this once: node seedAdmin.js

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/clinic_management';

// Default admin credentials
const defaultAdmin = {
    username: 'admin',
    email: 'admin@clinic.com',
    password: 'admin123', // Will be hashed automatically
    role: 'Admin'
};

// Connect to database and create admin
const createDefaultAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: defaultAdmin.email });

        if (existingAdmin) {
            console.log('ℹ️  Default admin already exists');
            console.log('📧 Email:', defaultAdmin.email);
            console.log('🔑 Password: admin123');
            process.exit(0);
        }

        // Create admin user
        const admin = await User.create(defaultAdmin);

        console.log('✅ Default admin user created successfully!');
        console.log('');
        console.log('📧 Email:', defaultAdmin.email);
        console.log('🔑 Password: admin123');
        console.log('👤 Username:', defaultAdmin.username);
        console.log('🎭 Role: Admin');
        console.log('');
        console.log('⚠️  Please change the password after first login!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin:', error.message);
        process.exit(1);
    }
};

// Run the function
createDefaultAdmin();
