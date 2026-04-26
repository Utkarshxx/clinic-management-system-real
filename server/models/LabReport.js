// Import mongoose for MongoDB operations
const mongoose = require('mongoose');

// Define Lab Report Schema
const labReportSchema = new mongoose.Schema({
    // Reference to Patient - links lab report to a patient
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    // Name of the lab test (e.g., "Blood Test", "X-Ray")
    testName: {
        type: String,
        required: true,
        trim: true
    },
    // Test result in text format
    result: {
        type: String,
        required: true
    },
    // Date when test was conducted - auto-generated
    date: {
        type: Date,
        default: Date.now
    }
});

// Create and export LabReport model
const LabReport = mongoose.model('LabReport', labReportSchema);

module.exports = LabReport;
