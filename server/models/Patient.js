// Import mongoose library for MongoDB operations
const mongoose = require('mongoose');

// Define Patient Schema - structure of patient data in database
const patientSchema = new mongoose.Schema({
    // Custom 6-character alphanumeric patient ID
    patientId: {
        type: String,
        unique: true,
        uppercase: true
    },
    // Patient's full name
    name: {
        type: String,
        required: true,
        trim: true
    },
    // Patient's age in years
    age: {
        type: Number,
        required: true,
        min: 0
    },
    // Patient's gender
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other']
    },
    // Contact number
    contact: {
        type: String,
        required: true,
        trim: true
    },
    // Residential address
    address: {
        type: String,
        required: true
    },
    // Registration date - automatically set to current date
    registrationDate: {
        type: Date,
        default: Date.now
    },
    // Appointment Date
    appointmentDate: {
        type: Date,
        default: Date.now
    },
    // Appointment Time
    appointmentTime: {
        type: String,
        required: true
    }
});

// Function to generate random 6-character alphanumeric ID
function generatePatientId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// Pre-save hook to generate patient ID
patientSchema.pre('save', async function (next) {
    if (!this.patientId) {
        let isUnique = false;
        while (!isUnique) {
            const newId = generatePatientId();
            const existing = await mongoose.model('Patient').findOne({ patientId: newId });
            if (!existing) {
                this.patientId = newId;
                isUnique = true;
            }
        }
    }
    next();
});

// Create and export Patient model
// This model will be used to perform CRUD operations on patients collection
const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
