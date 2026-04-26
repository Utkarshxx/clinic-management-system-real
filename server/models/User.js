// Import mongoose for MongoDB operations
const mongoose = require('mongoose');
// Import bcrypt for password hashing
const bcryptjs = require('bcryptjs');

// Define User Schema - structure of user data in database
const userSchema = new mongoose.Schema({
    // Username - unique identifier for login
    username: {
        type: String,
        required: [true, 'Please provide a username'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters']
    },
    // Email address
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    // Password - will be hashed before saving
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false // Don't include password in queries by default
    },
    // User role - Admin, Doctor, or Receptionist
    role: {
        type: String,
        required: [true, 'Please specify a role'],
        enum: ['Admin', 'Doctor', 'Receptionist'],
        default: 'Receptionist'
    },
    // Account creation date
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Middleware: Hash password before saving to database
// This runs automatically before save() or create()
userSchema.pre('save', async function (next) {
    // Only hash password if it has been modified (or is new)
    if (!this.isModified('password')) {
        return next();
    }

    // Generate salt (random data for hashing)
    const salt = await bcryptjs.genSalt(10);

    // Hash the password with the salt
    this.password = await bcryptjs.hash(this.password, salt);

    next();
});

// Method to compare entered password with hashed password in database
// This is used during login
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcryptjs.compare(enteredPassword, this.password);
};

// Create and export User model
const User = mongoose.model('User', userSchema);

module.exports = User;
