// Import React and hooks
import React, { useState, useEffect } from 'react';
// Import useNavigate for navigation
import { useNavigate } from 'react-router-dom';
// Import Navbar component
import Navbar from '../components/Navbar';
// Import API functions
import { getAllPatients, getPrescriptionsByPatient } from '../services/api';

// Prescription component - view prescriptions
const Prescription = () => {
    const navigate = useNavigate();

    // Get user role from localStorage
    const userRole = localStorage.getItem('userRole');

    // Redirect if not a doctor
    useEffect(() => {
        if (userRole !== 'Doctor') {
            alert('Access denied. This page is only for doctors.');
            navigate('/dashboard');
        }
    }, [userRole, navigate]);

    // State for patients list
    const [patients, setPatients] = useState([]);

    // State for selected patient
    const [selectedPatient, setSelectedPatient] = useState('');
    const [selectedPatientName, setSelectedPatientName] = useState('');

    // State for prescriptions
    const [prescriptions, setPrescriptions] = useState([]);

    // State for loading
    const [loading, setLoading] = useState(false);

    // Fetch all patients when component mounts
    useEffect(() => {
        fetchPatients();
    }, []);

    // Fetch prescriptions when patient is selected
    useEffect(() => {
        if (selectedPatient) {
            fetchPrescriptions();
        }
    }, [selectedPatient]);

    // Function to fetch all patients
    const fetchPatients = async () => {
        try {
            const response = await getAllPatients();
            setPatients(response.data || []);
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
    };

    // Function to fetch prescriptions for selected patient
    const fetchPrescriptions = async () => {
        setLoading(true);
        try {
            const response = await getPrescriptionsByPatient(selectedPatient);
            setPrescriptions(response.data || []);
        } catch (error) {
            console.error('Error fetching prescriptions:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle patient selection
    const handlePatientChange = (e) => {
        const patientId = e.target.value;
        setSelectedPatient(patientId);

        const patient = patients.find(p => p._id === patientId);
        setSelectedPatientName(patient ? patient.name : '');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Prescriptions</h1>
                    <p className="text-gray-600">View patient prescriptions and medical history</p>
                </div>

                {/* Patient Selection */}
                <div className="card mb-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <span className="text-2xl mr-2">👤</span>
                        Select Patient
                    </h2>
                    <select
                        value={selectedPatient}
                        onChange={handlePatientChange}
                        className="input-field max-w-md"
                    >
                        <option value="">-- Select Patient --</option>
                        {patients.map((patient) => (
                            <option key={patient._id} value={patient._id}>
                                {patient.name} - {patient.age}y - {patient.contact}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Prescriptions Display */}
                {selectedPatient && (
                    <div className="card">
                        <h2 className="text-xl font-semibold mb-6 flex items-center justify-between">
                            <span className="flex items-center">
                                <span className="text-2xl mr-2">💊</span>
                                Prescriptions for {selectedPatientName}
                            </span>
                            <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                                {prescriptions.length} Total
                            </span>
                        </h2>

                        {loading ? (
                            <div className="text-center py-12">
                                <p className="text-gray-600">Loading prescriptions...</p>
                            </div>
                        ) : prescriptions.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">No prescriptions found</p>
                                <p className="text-gray-400 text-sm mt-2">This patient has no prescriptions yet</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {prescriptions.map((prescription, index) => (
                                    <div key={prescription._id} className="border-2 border-gray-200 rounded-lg p-6 bg-white hover:shadow-lg transition-shadow">
                                        {/* Prescription Header */}
                                        <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-200">
                                            <div>
                                                <h3 className="font-semibold text-lg text-gray-800">
                                                    Prescription #{prescriptions.length - index}
                                                </h3>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Dr. {prescription.doctorName}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                                                    {new Date(prescription.date).toLocaleDateString('en-IN', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Symptoms & Diagnosis */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div className="bg-red-50 p-4 rounded-lg">
                                                <p className="text-sm font-medium text-gray-700 mb-2">Symptoms:</p>
                                                <p className="text-sm text-gray-800">{prescription.symptoms}</p>
                                            </div>
                                            <div className="bg-green-50 p-4 rounded-lg">
                                                <p className="text-sm font-medium text-gray-700 mb-2">Diagnosis:</p>
                                                <p className="text-sm text-gray-800">{prescription.diagnosis}</p>
                                            </div>
                                        </div>

                                        {/* Medicines */}
                                        <div>
                                            <p className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                                                <span className="text-lg mr-2">💊</span>
                                                Prescribed Medicines ({prescription.medicines.length})
                                            </p>
                                            <div className="space-y-2">
                                                {prescription.medicines.map((medicine, idx) => (
                                                    <div key={idx} className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                                        <div className="flex justify-between items-center">
                                                            <div className="flex-1">
                                                                <span className="font-medium text-gray-800">{medicine.name}</span>
                                                                <span className="text-gray-600 mx-2">•</span>
                                                                <span className="text-sm text-gray-600">{medicine.dosage}</span>
                                                            </div>
                                                            <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                                                                {medicine.timing}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* No Patient Selected */}
                {!selectedPatient && (
                    <div className="card text-center py-12">
                        <div className="text-6xl mb-4">💊</div>
                        <p className="text-gray-500 text-lg">Select a patient to view their prescriptions</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Prescription;
