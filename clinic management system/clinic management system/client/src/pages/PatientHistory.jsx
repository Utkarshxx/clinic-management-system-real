// Import React and hooks
import React, { useState, useEffect } from 'react';
// Import Navbar component
import Navbar from '../components/Navbar';
// Import API functions
import {
    getAllPatients,
    getPrescriptionsByPatient,
    getLabReportsByPatient,
    getBillsByPatient
} from '../services/api';

// PatientHistory component - displays complete patient history
const PatientHistory = () => {
    // State for patients list
    const [patients, setPatients] = useState([]);

    // State for selected patient and their history
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [prescriptions, setPrescriptions] = useState([]);
    const [labReports, setLabReports] = useState([]);
    const [bills, setBills] = useState([]);

    // State for loading
    const [loading, setLoading] = useState(false);

    // Fetch all patients when component mounts
    useEffect(() => {
        fetchPatients();
    }, []);

    // Function to fetch all patients
    const fetchPatients = async () => {
        try {
            const response = await getAllPatients();
            setPatients(response.data || []);
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
    };

    // Function to fetch complete patient history
    const fetchPatientHistory = async (patientId) => {
        setLoading(true);
        try {
            // Fetch prescriptions
            const prescResponse = await getPrescriptionsByPatient(patientId);
            setPrescriptions(prescResponse.data || []);

            // Fetch lab reports
            const labResponse = await getLabReportsByPatient(patientId);
            setLabReports(labResponse.data || []);

            // Fetch bills
            const billResponse = await getBillsByPatient(patientId);
            setBills(billResponse.data || []);
        } catch (error) {
            console.error('Error fetching patient history:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle patient selection
    const handleSelectPatient = async (patient) => {
        setSelectedPatient(patient);
        await fetchPatientHistory(patient._id);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Patient History</h1>
                    <p className="text-gray-600">View complete patient medical records</p>
                </div>

                {!selectedPatient ? (
                    /* Patient Selection Grid */
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Select a Patient</h2>
                        {patients.length === 0 ? (
                            <div className="card text-center py-12">
                                <p className="text-gray-500 text-lg">No patients registered yet</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {patients.map((patient) => (
                                    <div
                                        key={patient._id}
                                        onClick={() => handleSelectPatient(patient)}
                                        className="card hover:shadow-xl cursor-pointer transition-all border-2 border-transparent hover:border-blue-400"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="font-semibold text-lg text-gray-800">{patient.name}</h3>
                                                    {patient.patientId && (
                                                        <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full font-bold tracking-wider">
                                                            {patient.patientId}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                                                    <span>👤 {patient.age} years</span>
                                                    <span>• {patient.gender}</span>
                                                </div>
                                            </div>
                                            <div className="text-3xl">📋</div>
                                        </div>
                                        <div className="text-sm text-gray-600 mt-2">
                                            <p>📞 {patient.contact}</p>
                                            <p className="text-xs text-gray-500 mt-2">
                                                Registered: {new Date(patient.registrationDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="mt-4 pt-3 border-t border-gray-200">
                                            <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
                                                View Complete History →
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    /* Patient History Details */
                    <div>
                        {/* Back Button and Patient Info */}
                        <div className="mb-6">
                            <button
                                onClick={() => {
                                    setSelectedPatient(null);
                                    setPrescriptions([]);
                                    setLabReports([]);
                                    setBills([]);
                                }}
                                className="text-blue-600 hover:text-blue-800 mb-4 flex items-center"
                            >
                                ← Back to Patients
                            </button>

                            <div className="card bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-3 mb-3">
                                            <h2 className="text-2xl font-bold">{selectedPatient.name}</h2>
                                            {selectedPatient.patientId && (
                                                <span className="bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-bold tracking-widest">
                                                    {selectedPatient.patientId}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex gap-4 text-sm opacity-90">
                                            <span>Age: {selectedPatient.age} years</span>
                                            <span>• Gender: {selectedPatient.gender}</span>
                                            <span>• Contact: {selectedPatient.contact}</span>
                                        </div>
                                        <p className="text-sm opacity-90 mt-2">Address: {selectedPatient.address}</p>
                                    </div>
                                    <div className="text-5xl">👤</div>
                                </div>
                            </div>
                        </div>

                        {loading ? (
                            <div className="card text-center py-12">
                                <p className="text-gray-600">Loading patient history...</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Prescriptions */}
                                <div className="card">
                                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                                        <span className="text-2xl mr-2">💊</span>
                                        Prescriptions ({prescriptions.length})
                                    </h3>
                                    {prescriptions.length === 0 ? (
                                        <p className="text-gray-500 text-center py-8">No prescriptions found</p>
                                    ) : (
                                        <div className="space-y-4">
                                            {prescriptions.map((prescription, index) => (
                                                <div key={prescription._id} className="border border-gray-200 rounded-lg p-4 bg-purple-50">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div>
                                                            <p className="font-semibold text-gray-800">Dr. {prescription.doctorName}</p>
                                                            <p className="text-sm text-gray-600">
                                                                {new Date(prescription.date).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                        <span className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-xs">
                                                            Prescription #{index + 1}
                                                        </span>
                                                    </div>
                                                    <div className="mb-2">
                                                        <p className="text-sm font-medium text-gray-700">Symptoms:</p>
                                                        <p className="text-sm text-gray-600">{prescription.symptoms}</p>
                                                    </div>
                                                    <div className="mb-3">
                                                        <p className="text-sm font-medium text-gray-700">Diagnosis:</p>
                                                        <p className="text-sm text-gray-600">{prescription.diagnosis}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-700 mb-2">Medicines:</p>
                                                        <div className="space-y-2">
                                                            {prescription.medicines.map((medicine, idx) => (
                                                                <div key={idx} className="bg-white p-2 rounded text-sm">
                                                                    <span className="font-medium">{medicine.name}</span> - {medicine.dosage} ({medicine.timing})
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Lab Reports */}
                                <div className="card">
                                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                                        <span className="text-2xl mr-2">🧪</span>
                                        Lab Reports ({labReports.length})
                                    </h3>
                                    {labReports.length === 0 ? (
                                        <p className="text-gray-500 text-center py-8">No lab reports found</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {labReports.map((report) => (
                                                <div key={report._id} className="border border-gray-200 rounded-lg p-4 bg-yellow-50">
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex-1">
                                                            <p className="font-semibold text-gray-800">{report.testName}</p>
                                                            <p className="text-sm text-gray-600 mt-1">{report.result}</p>
                                                        </div>
                                                        <p className="text-xs text-gray-500">
                                                            {new Date(report.date).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Bills */}
                                <div className="card">
                                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                                        <span className="text-2xl mr-2">💰</span>
                                        Bills ({bills.length})
                                    </h3>
                                    {bills.length === 0 ? (
                                        <p className="text-gray-500 text-center py-8">No bills found</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {bills.map((bill) => (
                                                <div key={bill._id} className="border border-gray-200 rounded-lg p-4 bg-green-50">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <p className="text-sm text-gray-600">
                                                            {new Date(bill.date).toLocaleDateString()}
                                                        </p>
                                                        <p className="text-xl font-bold text-green-700">₹{bill.total}</p>
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-2 text-sm">
                                                        <div>
                                                            <p className="text-gray-600">Consultation</p>
                                                            <p className="font-medium">₹{bill.consultationFee}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-600">Medicine</p>
                                                            <p className="font-medium">₹{bill.medicineCost}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-600">Lab</p>
                                                            <p className="font-medium">₹{bill.labCharges}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientHistory;
