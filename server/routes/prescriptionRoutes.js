// Import express framework
const express = require('express');
// Import Prescription model
const Prescription = require('../models/Prescription');

// Create router instance
const router = express.Router();

// POST /api/prescriptions - Add a new prescription
// This route handles creating prescription for a patient
router.post('/', async (req, res) => {
    try {
        // Extract prescription data from request body
        const { patientId, doctorName, symptoms, diagnosis, medicines } = req.body;

        // Create new prescription object
        const newPrescription = new Prescription({
            patientId,
            doctorName,
            symptoms,
            diagnosis,
            medicines
        });

        // Save prescription to database
        const savedPrescription = await newPrescription.save();

        // Send success response with saved prescription data
        res.status(201).json({
            success: true,
            message: 'Prescription created successfully',
            data: savedPrescription
        });
    } catch (error) {
        // Handle errors
        res.status(500).json({
            success: false,
            message: 'Error creating prescription',
            error: error.message
        });
    }
});

// GET /api/prescriptions/:patientId - Get all prescriptions for a patient
// This route retrieves prescription history of a specific patient
router.get('/:patientId', async (req, res) => {
    try {
        // Get patient ID from URL parameter
        const patientId = req.params.patientId;

        // Find all prescriptions for this patient, sorted by date (newest first)
        const prescriptions = await Prescription.find({ patientId }).sort({ date: -1 });

        // Send success response with prescriptions list
        res.status(200).json({
            success: true,
            count: prescriptions.length,
            data: prescriptions
        });
    } catch (error) {
        // Handle errors
        res.status(500).json({
            success: false,
            message: 'Error fetching prescriptions',
            error: error.message
        });
    }
});

// Export router
module.exports = router;
