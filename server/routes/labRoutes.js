// Import express framework
const express = require('express');
// Import LabReport model
const LabReport = require('../models/LabReport');

// Create router instance
const router = express.Router();

// POST /api/labs - Add a new lab report
// This route handles adding lab test results for a patient
router.post('/', async (req, res) => {
    try {
        // Extract lab report data from request body
        const { patientId, testName, result } = req.body;

        // Create new lab report object
        const newLabReport = new LabReport({
            patientId,
            testName,
            result
        });

        // Save lab report to database
        const savedLabReport = await newLabReport.save();

        // Send success response with saved lab report data
        res.status(201).json({
            success: true,
            message: 'Lab report added successfully',
            data: savedLabReport
        });
    } catch (error) {
        // Handle errors
        res.status(500).json({
            success: false,
            message: 'Error adding lab report',
            error: error.message
        });
    }
});

// GET /api/labs/:patientId - Get all lab reports for a patient
// This route retrieves lab test history of a specific patient
router.get('/:patientId', async (req, res) => {
    try {
        // Get patient ID from URL parameter
        const patientId = req.params.patientId;

        // Find all lab reports for this patient, sorted by date (newest first)
        const labReports = await LabReport.find({ patientId }).sort({ date: -1 });

        // Send success response with lab reports list
        res.status(200).json({
            success: true,
            count: labReports.length,
            data: labReports
        });
    } catch (error) {
        // Handle errors
        res.status(500).json({
            success: false,
            message: 'Error fetching lab reports',
            error: error.message
        });
    }
});

// Export router
module.exports = router;
