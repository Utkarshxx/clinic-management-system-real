// Import mongoose for MongoDB operations
const mongoose = require('mongoose');

// Define Prescription Schema
const prescriptionSchema = new mongoose.Schema({
    // Reference to Patient - links prescription to a patient
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    // Name of the doctor who prescribed
    doctorName: {
        type: String,
        required: true,
        trim: true
    },
    // Patient's symptoms/complaints
    symptoms: {
        type: String,
        required: true
    },
    // Doctor's diagnosis
    diagnosis: {
        type: String,
        required: true
    },
    // Array of medicines prescribed
    medicines: [{
        // Medicine name
        name: {
            type: String,
            required: true
        },
        // Type: Tablet or Ointment (optional)
        type: {
            type: String,
            required: false,
            enum: ['Tablet', 'Ointment', 'Syrup', 'Injection', 'Capsule', 'Other']
        },
        // Dosage (e.g., "1 tablet", "2 spoons")
        dosage: {
            type: String,
            required: true
        },
        // Timing: when to take medicine
        timing: {
            type: String,
            required: true
        },
        // Duration in days (optional)
        duration: {
            type: Number,
            required: false,
            min: 1
        }
    }],
    // Date of prescription - auto-generated
    date: {
        type: Date,
        default: Date.now
    }
});

// Create and export Prescription model
const Prescription = mongoose.model('Prescription', prescriptionSchema);

module.exports = Prescription;
