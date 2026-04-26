// Import React and hooks
import React, { useState, useEffect } from 'react';
// Import Navbar component
import Navbar from '../components/Navbar';
// Import API functions
import { getAllPatients, addLabReport, getLabReportsByPatient } from '../services/api';

// LabTest component - handles lab test reports
const LabTest = () => {
    // Get user role from localStorage
    const userRole = localStorage.getItem('userRole');

    // Check if user can add lab reports (only Doctor)
    const canAddLabReports = userRole === 'Doctor';

    // State for selected patient ID
    const [selectedPatientId, setSelectedPatientId] = useState('');

    // State for patients list
    const [patients, setPatients] = useState([]);

    // State for lab report form data
    const [labData, setLabData] = useState({
        testName: '',
        result: ''
    });

    // State for lab reports list
    const [labReports, setLabReports] = useState([]);

    // State for success message
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch all patients when component mounts
    useEffect(() => {
        fetchPatients();
    }, []);

    // Fetch lab reports when patient is selected
    useEffect(() => {
        if (selectedPatientId) {
            fetchLabReports();
        }
    }, [selectedPatientId]);

    // Function to fetch all patients
    const fetchPatients = async () => {
        try {
            const response = await getAllPatients();
            setPatients(response.data || []);
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
    };

    // Function to fetch lab reports for selected patient
    const fetchLabReports = async () => {
        try {
            const response = await getLabReportsByPatient(selectedPatientId);
            setLabReports(response.data || []);
        } catch (error) {
            console.error('Error fetching lab reports:', error);
        }
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLabData({
            ...labData,
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
            // Prepare lab report data
            const reportData = {
                patientId: selectedPatientId,
                testName: labData.testName,
                result: labData.result
            };

            // Call API to add lab report
            await addLabReport(reportData);

            // Show success message
            setSuccessMessage('✓ Lab report added successfully!');

            // Clear form
            setLabData({
                testName: '',
                result: ''
            });

            // Refresh lab reports list
            fetchLabReports();

            // Hide success message after 3 seconds
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Error adding lab report:', error);
            alert('Error adding lab report. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Lab Test Reports</h1>
                    <p className="text-gray-600">
                        {canAddLabReports ? 'Order and manage lab tests' : 'View lab test reports'}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Add Lab Report Form - Only for Doctors */}
                    {canAddLabReports ? (
                        <div className="card">
                            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                                <span className="text-2xl mr-2">🧪</span>
                                Add Lab Report
                            </h2>

                            {/* Success Message */}
                            {successMessage && (
                                <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6 flex items-center">
                                    <span className="text-xl mr-2">✓</span>
                                    {successMessage}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Patient Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Patient <span className="text-red-500">*</span>
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

                                {/* Test Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Test Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="testName"
                                        value={labData.testName}
                                        onChange={handleInputChange}
                                        className="input-field"
                                        placeholder="e.g., Blood Test, X-Ray, CT Scan"
                                        required
                                    />
                                </div>

                                {/* Test Result */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Test Result <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        name="result"
                                        value={labData.result}
                                        onChange={handleInputChange}
                                        className="input-field"
                                        rows="6"
                                        placeholder="Enter test results in detail..."
                                        required
                                    ></textarea>
                                </div>

                                {/* Submit Button */}
                                <button type="submit" className="btn-primary w-full text-lg py-3">
                                    ✓ Add Lab Report
                                </button>
                            </form>
                        </div>
                    ) : (
                        /* View-Only Message for Admin and Receptionist */
                        <div className="card bg-yellow-50 border-2 border-yellow-200">
                            <div className="flex items-start">
                                <div className="text-4xl mr-4">ℹ️</div>
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-800 mb-3">View Only Access</h2>
                                    <p className="text-gray-700 mb-4">
                                        As a <strong>{userRole}</strong>, you can view lab reports but cannot add new ones.
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Lab reports are ordered and managed by doctors only.
                                    </p>
                                    <div className="mt-4 p-3 bg-white rounded border border-yellow-300">
                                        <p className="text-sm font-medium text-gray-700">Select a patient from the list to view their lab reports →</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Lab Reports List */}
                    <div className="card">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center justify-between">
                            <span className="flex items-center">
                                <span className="text-2xl mr-2">📋</span>
                                Lab Reports
                            </span>
                            {selectedPatientId && (
                                <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                                    {labReports.length} Reports
                                </span>
                            )}
                        </h2>

                        {/* Patient Selection for Viewing */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Patient to View Reports
                            </label>
                            <select
                                value={selectedPatientId}
                                onChange={(e) => setSelectedPatientId(e.target.value)}
                                className="input-field"
                            >
                                <option value="">-- Select Patient --</option>
                                {patients.map((patient) => (
                                    <option key={patient._id} value={patient._id}>
                                        {patient.name} - {patient.age}y - {patient.contact}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Reports Display */}
                        {!selectedPatientId ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">Select a patient to view lab reports</p>
                            </div>
                        ) : labReports.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">No lab reports found</p>
                                <p className="text-gray-400 text-sm mt-2">This patient has no lab reports yet</p>
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-[500px] overflow-y-auto">
                                {labReports.map((report) => (
                                    <div key={report._id} className="border-2 border-gray-200 rounded-lg p-4 bg-yellow-50 hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="font-semibold text-lg text-gray-800">{report.testName}</h3>
                                            <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                                                {new Date(report.date).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <div className="bg-white p-4 rounded border border-gray-300">
                                            <p className="text-sm font-medium text-gray-700 mb-2">Result:</p>
                                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{report.result}</p>
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

export default LabTest;
