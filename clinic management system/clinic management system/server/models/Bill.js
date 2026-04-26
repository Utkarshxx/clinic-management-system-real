// Import mongoose for MongoDB operations
const mongoose = require('mongoose');

// Define Bill Schema
const billSchema = new mongoose.Schema({
    // Reference to Patient - links bill to a patient
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    // Consultation fee charged by doctor
    consultationFee: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    // Cost of medicines
    medicineCost: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    // Laboratory test charges
    labCharges: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    // Total amount - sum of all charges
    total: {
        type: Number,
        required: true,
        min: 0
    },
    // Date of bill generation - auto-generated
    date: {
        type: Date,
        default: Date.now
    }
});

// Create and export Bill model
const Bill = mongoose.model('Bill', billSchema);

module.exports = Bill;
