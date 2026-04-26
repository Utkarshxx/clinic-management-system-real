// Import React and hooks
import React, { useState, useEffect } from 'react';
// Import useParams and useNavigate
import { useParams, useNavigate } from 'react-router-dom';
// Import API functions
import {
    getPatientByIdPublic,
    getPrescriptionsByPatientPublic,
    getLabReportsByPatientPublic,
    getBillsByPatientPublic
} from '../services/api';

// PatientPortal component - public page for patients to view their records
const PatientPortal = () => {
    const { patientId } = useParams();
    const navigate = useNavigate();

    // State
    const [patient, setPatient] = useState(null);
    const [prescriptions, setPrescriptions] = useState([]);
    const [labReports, setLabReports] = useState([]);
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch patient data
    useEffect(() => {
        fetchPatientData();
    }, [patientId]);

    const fetchPatientData = async () => {
        setLoading(true);
        setError('');

        try {
            // Fetch patient details by custom patientId using public API
            const patientResponse = await getPatientByIdPublic(patientId);
            const patientData = patientResponse.data;
            setPatient(patientData);

            // Use the MongoDB _id for fetching related records
            const mongoId = patientData._id;

            // Fetch prescriptions using MongoDB _id with public API
            const prescResponse = await getPrescriptionsByPatientPublic(mongoId);
            setPrescriptions(prescResponse.data || []);

            // Fetch lab reports using MongoDB _id with public API
            const labResponse = await getLabReportsByPatientPublic(mongoId);
            setLabReports(labResponse.data || []);

            // Fetch bills using MongoDB _id with public API
            const billResponse = await getBillsByPatientPublic(mongoId);
            setBills(billResponse.data || []);
        } catch (error) {
            console.error('Error fetching patient data:', error);
            setError('Invalid Patient ID or patient not found. Please check your ID and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <span className="text-3xl">🏥</span>
                            <h1 className="text-2xl font-bold text-clinic-blue">ClinicCare - Patient Portal</h1>
                        </div>
                        <button
                            onClick={() => navigate('/')}
                            className="btn-secondary"
                        >
                            ← Back to Home
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {loading ? (
                    <div className="card text-center py-12">
                        <p className="text-gray-600 text-lg">Loading your medical records...</p>
                    </div>
                ) : error ? (
                    <div className="max-w-2xl mx-auto">
                        <div className="card bg-red-50 border-2 border-red-200 text-center py-12">
                            <div className="text-6xl mb-4">❌</div>
                            <h2 className="text-2xl font-bold text-red-700 mb-4">Patient Not Found</h2>
                            <p className="text-red-700 text-lg mb-6">{error}</p>
                            <div className="space-y-3">
                                <button
                                    onClick={() => navigate('/')}
                                    className="btn-primary inline-block"
                                >
                                    ← Go Back to Home
                                </button>
                                <p className="text-sm text-gray-600">
                                    Please check your Patient ID and try again, or contact the clinic for assistance.
                                </p>
                            </div>
                        </div>
                    </div>
                ) : patient ? (
                    <>
                        {/* Patient Info Card */}
                        <div className="card bg-gradient-to-r from-blue-500 to-blue-600 text-white mb-8">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-3xl font-bold mb-3">{patient.name}</h2>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm opacity-90">
                                        <div>
                                            <p className="font-semibold">Age</p>
                                            <p>{patient.age} years</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold">Gender</p>
                                            <p>{patient.gender}</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold">Contact</p>
                                            <p>{patient.contact}</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold">Registered</p>
                                            <p>{new Date(patient.registrationDate).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-6xl">👤</div>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="card bg-purple-50 border-2 border-purple-200">
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">Prescriptions</h3>
                                <p className="text-4xl font-bold text-purple-600">{prescriptions.length}</p>
                            </div>
                            <div className="card bg-yellow-50 border-2 border-yellow-200">
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">Lab Reports</h3>
                                <p className="text-4xl font-bold text-yellow-600">{labReports.length}</p>
                            </div>
                            <div className="card bg-green-50 border-2 border-green-200">
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">Bills</h3>
                                <p className="text-4xl font-bold text-green-600">{bills.length}</p>
                            </div>
                        </div>

                        {/* Prescriptions */}
                        <div className="card mb-8">
                            <h3 className="text-2xl font-semibold mb-6 flex items-center">
                                <span className="text-3xl mr-2">💊</span>
                                Prescriptions ({prescriptions.length})
                            </h3>
                            {prescriptions.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No prescriptions found</p>
                            ) : (
                                <div className="space-y-4">
                                    {prescriptions.map((prescription, index) => (
                                        <div key={prescription._id} className="border-2 border-gray-200 rounded-lg p-6 bg-purple-50">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h4 className="font-semibold text-lg">Prescription #{prescriptions.length - index}</h4>
                                                    <p className="text-sm text-gray-600">Dr. {prescription.doctorName}</p>
                                                </div>
                                                <span className="text-xs bg-purple-200 text-purple-800 px-3 py-1 rounded-full">
                                                    {new Date(prescription.date).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                <div className="bg-white p-3 rounded">
                                                    <p className="text-sm font-medium text-gray-700">Symptoms:</p>
                                                    <p className="text-sm text-gray-800">{prescription.symptoms}</p>
                                                </div>
                                                <div className="bg-white p-3 rounded">
                                                    <p className="text-sm font-medium text-gray-700">Diagnosis:</p>
                                                    <p className="text-sm text-gray-800">{prescription.diagnosis}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-700 mb-2">Medicines:</p>
                                                <div className="space-y-2">
                                                    {prescription.medicines.map((medicine, idx) => (
                                                        <div key={idx} className="bg-white p-3 rounded flex justify-between items-center">
                                                            <div>
                                                                <span className="font-medium">{medicine.name}</span>
                                                                <span className="text-gray-600 mx-2">•</span>
                                                                <span className="text-sm text-gray-600">{medicine.dosage}</span>
                                                            </div>
                                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                                {medicine.timing}
                                                            </span>
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
                        <div className="card mb-8">
                            <h3 className="text-2xl font-semibold mb-6 flex items-center">
                                <span className="text-3xl mr-2">🧪</span>
                                Lab Reports ({labReports.length})
                            </h3>
                            {labReports.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No lab reports found</p>
                            ) : (
                                <div className="space-y-3">
                                    {labReports.map((report) => (
                                        <div key={report._id} className="border-2 border-gray-200 rounded-lg p-4 bg-yellow-50">
                                            <div className="flex justify-between items-start mb-3">
                                                <h4 className="font-semibold text-lg">{report.testName}</h4>
                                                <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">
                                                    {new Date(report.date).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="bg-white p-4 rounded">
                                                <p className="text-sm font-medium text-gray-700 mb-2">Result:</p>
                                                <p className="text-sm text-gray-800 whitespace-pre-wrap">{report.result}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Bills */}
                        <div className="card">
                            <h3 className="text-2xl font-semibold mb-6 flex items-center">
                                <span className="text-3xl mr-2">💰</span>
                                Bills ({bills.length})
                            </h3>
                            {bills.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No bills found</p>
                            ) : (
                                <div className="space-y-3">
                                    {bills.map((bill) => (
                                        <div key={bill._id} className="border-2 border-gray-200 rounded-lg p-4 bg-green-50">
                                            <div className="flex justify-between items-start mb-4">
                                                <span className="text-sm text-gray-600">
                                                    {new Date(bill.date).toLocaleDateString()}
                                                </span>
                                                <span className="text-2xl font-bold text-green-700">₹{bill.total}</span>
                                            </div>
                                            <div className="grid grid-cols-3 gap-3 text-sm">
                                                <div className="bg-white p-3 rounded">
                                                    <p className="text-gray-600">Consultation</p>
                                                    <p className="font-medium">₹{bill.consultationFee}</p>
                                                </div>
                                                <div className="bg-white p-3 rounded">
                                                    <p className="text-gray-600">Medicine</p>
                                                    <p className="font-medium">₹{bill.medicineCost}</p>
                                                </div>
                                                <div className="bg-white p-3 rounded">
                                                    <p className="text-gray-600">Lab</p>
                                                    <p className="font-medium">₹{bill.labCharges}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                ) : null}
            </div>
        </div>
    );
};

export default PatientPortal;
