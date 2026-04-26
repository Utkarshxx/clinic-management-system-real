// Import express framework
const express = require('express');
// Import Bill model
const Bill = require('../models/Bill');

// Create router instance
const router = express.Router();

// POST /api/bills - Create a new bill
// This route handles bill generation for a patient
router.post('/', async (req, res) => {
    try {
        // Extract bill data from request body
        const { patientId, consultationFee, medicineCost, labCharges, total } = req.body;

        // Create new bill object
        const newBill = new Bill({
            patientId,
            consultationFee,
            medicineCost,
            labCharges,
            total
        });

        // Save bill to database
        const savedBill = await newBill.save();

        // Send success response with saved bill data
        res.status(201).json({
            success: true,
            message: 'Bill created successfully',
            data: savedBill
        });
    } catch (error) {
        // Handle errors
        res.status(500).json({
            success: false,
            message: 'Error creating bill',
            error: error.message
        });
    }
});

// GET /api/bills/:patientId - Get all bills for a patient
// This route retrieves billing history of a specific patient
router.get('/:patientId', async (req, res) => {
    try {
        // Get patient ID from URL parameter
        const patientId = req.params.patientId;

        // Find all bills for this patient, sorted by date (newest first)
        const bills = await Bill.find({ patientId }).sort({ date: -1 });

        // Send success response with bills list
        res.status(200).json({
            success: true,
            count: bills.length,
            data: bills
        });
    } catch (error) {
        // Handle errors
        res.status(500).json({
            success: false,
            message: 'Error fetching bills',
            error: error.message
        });
    }
});

// Export router
module.exports = router;
