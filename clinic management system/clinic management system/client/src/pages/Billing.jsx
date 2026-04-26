// Import React and hooks
import React, { useState, useEffect } from 'react';
// Import Navbar component
import Navbar from '../components/Navbar';
// Import API functions
import { getAllPatients, createBill, getBillsByPatient } from '../services/api';

// Billing component - handles bill generation
const Billing = () => {
    // State for selected patient ID
    const [selectedPatientId, setSelectedPatientId] = useState('');

    // State for patients list
    const [patients, setPatients] = useState([]);

    // State for bill form data
    const [billData, setBillData] = useState({
        consultationFee: '',
        medicineCost: '',
        labCharges: ''
    });

    // State for calculated total - using JavaScript calculation
    const [total, setTotal] = useState(0);

    // State for bills list
    const [bills, setBills] = useState([]);

    // State for success message
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch all patients when component mounts
    useEffect(() => {
        fetchPatients();
    }, []);

    // Fetch bills when patient is selected
    useEffect(() => {
        if (selectedPatientId) {
            fetchBills();
        }
    }, [selectedPatientId]);

    // Auto-calculate total whenever bill data changes - using useEffect
    useEffect(() => {
        const consultation = parseFloat(billData.consultationFee) || 0;
        const medicine = parseFloat(billData.medicineCost) || 0;
        const lab = parseFloat(billData.labCharges) || 0;

        // Calculate total using JavaScript
        const calculatedTotal = consultation + medicine + lab;
        setTotal(calculatedTotal);
    }, [billData]); // Runs whenever billData changes

    // Function to fetch all patients
    const fetchPatients = async () => {
        try {
            const response = await getAllPatients();
            setPatients(response.data || []);
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
    };

    // Function to fetch bills for selected patient
    const fetchBills = async () => {
        try {
            const response = await getBillsByPatient(selectedPatientId);
            setBills(response.data || []);
        } catch (error) {
            console.error('Error fetching bills:', error);
        }
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBillData({
            ...billData,
            [name]: value
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate that patient is selected
        if (!selectedPatientId) {
            alert('Please select a patient');
            return;
        }

        try {
            // Prepare bill data
            const newBillData = {
                patientId: selectedPatientId,
                consultationFee: parseFloat(billData.consultationFee) || 0,
                medicineCost: parseFloat(billData.medicineCost) || 0,
                labCharges: parseFloat(billData.labCharges) || 0,
                total: total
            };

            // Call API to create bill
            await createBill(newBillData);

            // Show success message
            setSuccessMessage('Bill created successfully!');

            // Clear form
            setBillData({
                consultationFee: '',
                medicineCost: '',
                labCharges: ''
            });

            // Refresh bills list
            fetchBills();

            // Hide success message after 3 seconds
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Error creating bill:', error);
            alert('Error creating bill. Please try again.');
        }
    };

    return (
        <div>
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Billing Management</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Create Bill Form */}
                    <div className="card">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Bill</h2>

                        {/* Success Message */}
                        {successMessage && (
                            <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
                                {successMessage}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            {/* Patient Selection */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Patient *
                                </label>
                                <select
                                    value={selectedPatientId}
                                    onChange={(e) => setSelectedPatientId(e.target.value)}
                                    className="input-field"
                                    required
                                >
                                    <option value="">-- Select Patient --</option>
                                    {patients.map((patient) => (
                                        <option key={patient._id} value={patient._id}>
                                            {patient.name} - {patient.age}y - {patient.contact}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Consultation Fee */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Consultation Fee (₹)
                                </label>
                                <input
                                    type="number"
                                    name="consultationFee"
                                    value={billData.consultationFee}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                />
                            </div>

                            {/* Medicine Cost */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Medicine Cost (₹)
                                </label>
                                <input
                                    type="number"
                                    name="medicineCost"
                                    value={billData.medicineCost}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                />
                            </div>

                            {/* Lab Charges */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Lab Charges (₹)
                                </label>
                                <input
                                    type="number"
                                    name="labCharges"
                                    value={billData.labCharges}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                />
                            </div>

                            {/* Total - Auto-calculated */}
                            <div className="mb-6 p-4 bg-clinic-primary rounded">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold text-gray-800">Total Amount:</span>
                                    <span className="text-2xl font-bold text-clinic-blue">₹{total.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button type="submit" className="btn-primary w-full">
                                Generate Bill
                            </button>
                        </form>
                    </div>

                    {/* Bills List */}
                    <div className="card">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Billing History</h2>

                        {!selectedPatientId ? (
                            <p className="text-gray-500">Select a patient to view billing history</p>
                        ) : bills.length === 0 ? (
                            <p className="text-gray-500">No bills found for this patient.</p>
                        ) : (
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                                {/* Map through bills array */}
                                {bills.map((bill, index) => (
                                    <div key={bill._id} className="border border-gray-200 rounded p-4">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="font-semibold text-gray-800">Bill #{bills.length - index}</h3>
                                            <span className="text-xs text-gray-500">
                                                {new Date(bill.date).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Consultation Fee:</span>
                                                <span className="font-medium">₹{bill.consultationFee.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Medicine Cost:</span>
                                                <span className="font-medium">₹{bill.medicineCost.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Lab Charges:</span>
                                                <span className="font-medium">₹{bill.labCharges.toFixed(2)}</span>
                                            </div>
                                            <div className="border-t border-gray-300 pt-2 mt-2">
                                                <div className="flex justify-between">
                                                    <span className="font-semibold text-gray-800">Total:</span>
                                                    <span className="font-bold text-clinic-blue">₹{bill.total.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Billing;
