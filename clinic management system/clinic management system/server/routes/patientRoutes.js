// Import express framework
const express = require('express');
// Import Patient model
const Patient = require('../models/Patient');

// Create router instance
const router = express.Router();

// POST /api/patients - Add a new patient
// This route handles patient registration
router.post('/', async (req, res) => {
    try {
        // Extract patient data from request body
        const { name, age, gender, contact, address, appointmentDate, appointmentTime } = req.body;

        // Create new patient object
        const newPatient = new Patient({
            name,
            age,
            gender,
            contact,
            address,
            appointmentDate,
            appointmentTime
        });

        // Save patient to database (patientId will be auto-generated)
        const savedPatient = await newPatient.save();

        // Send success response with saved patient data
        res.status(201).json({
            success: true,
            message: 'Patient registered successfully',
            data: savedPatient
        });
    } catch (error) {
        // Handle errors (validation, database errors)
        res.status(500).json({
            success: false,
            message: 'Error registering patient',
            error: error.message
        });
    }
});

// GET /api/patients - Get all patients
// This route retrieves list of all registered patients
router.get('/', async (req, res) => {
    try {
        // Fetch all patients from database, sorted by registration date (newest first)
        const patients = await Patient.find().sort({ registrationDate: -1 });

        // Send success response with patients list
        res.status(200).json({
            success: true,
            count: patients.length,
            data: patients
        });
    } catch (error) {
        // Handle errors
        res.status(500).json({
            success: false,
            message: 'Error fetching patients',
            error: error.message
        });
    }
});

// GET /api/patients/:id - Get single patient by ID
// This route retrieves details of a specific patient
// Supports both custom 6-character patientId and MongoDB _id
router.get('/:id', async (req, res) => {
    try {
        // Get patient ID from URL parameter
        const patientId = req.params.id;

        // Try to find by custom patientId first (6-character), then by MongoDB _id
        let patient;
        if (patientId.length === 6) {
            // Search by custom patientId
            patient = await Patient.findOne({ patientId: patientId.toUpperCase() });
        } else {
            // Search by MongoDB _id
            patient = await Patient.findById(patientId);
        }

        // Check if patient exists
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }

        // Send success response with patient data
        res.status(200).json({
            success: true,
            data: patient
        });
    } catch (error) {
        // Handle errors
        res.status(500).json({
            success: false,
            message: 'Error fetching patient',
            error: error.message
        });
    }
});

// Export router to use in main server file
module.exports = router;
