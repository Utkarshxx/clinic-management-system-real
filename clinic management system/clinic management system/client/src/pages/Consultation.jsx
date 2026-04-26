// Import React and hooks
import React, { useState, useEffect } from 'react';
// Import useNavigate for navigation
import { useNavigate } from 'react-router-dom';
// Import Navbar component
import Navbar from '../components/Navbar';
// Import API functions
import { getAllPatients, addPrescription } from '../services/api';

// Consultation component - doctor consultation page
const Consultation = () => {
    const navigate = useNavigate();

    // Get user role from localStorage
    const userRole = localStorage.getItem('userRole');
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

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

    // State for consultation form data
    const [formData, setFormData] = useState({
        doctorName: user?.username || '',
        symptoms: '',
        diagnosis: '',
        medicines: [{ name: '', dosage: '', timing: 'Morning' }]
    });

    // State for success message
    const [successMessage, setSuccessMessage] = useState('');

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

    // Handle consultation data input changes
    const handleConsultationChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle medicine input changes
    const handleMedicineChange = (index, field, value) => {
        const updatedMedicines = [...formData.medicines];
        updatedMedicines[index][field] = value;
        setFormData({ ...formData, medicines: updatedMedicines });
    };

    // Add new medicine row
    const addMedicineRow = () => {
        setFormData({
            ...formData,
            medicines: [...formData.medicines, { name: '', dosage: '', timing: 'Morning' }]
        });
    };

    // Remove medicine row
    const removeMedicineRow = (index) => {
        const updatedMedicines = formData.medicines.filter((_, i) => i !== index);
        setFormData({ ...formData, medicines: updatedMedicines });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedPatient) {
            alert('Please select a patient');
            return;
        }

        try {
            const prescriptionData = {
                patientId: selectedPatient,
                doctorName: formData.doctorName,
                symptoms: formData.symptoms,
                diagnosis: formData.diagnosis,
                medicines: formData.medicines
            };

            await addPrescription(prescriptionData);

            setSuccessMessage('✓ Prescription created successfully!');

            // Reset form
            setFormData({
                doctorName: user?.username || '',
                symptoms: '',
                diagnosis: '',
                medicines: [{ name: '', dosage: '', timing: 'Morning' }]
            });
            setSelectedPatient('');

            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Error creating prescription:', error);
            alert('Error creating prescription. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Patient Consultation</h1>
                    <p className="text-gray-600">Create prescriptions and manage consultations</p>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6 flex items-center">
                        <span className="text-xl mr-2">✓</span>
                        {successMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Patient Selection Card */}
                    <div className="card">
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <span className="text-2xl mr-2">👤</span>
                            Patient Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Patient <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={selectedPatient}
                                    onChange={(e) => setSelectedPatient(e.target.value)}
                                    className="input-field"
                                    required
                                >
                                    <option value="">-- Select Patient --</option>
                                    {patients.map((patient) => (
                                        <option key={patient._id} value={patient._id}>
                                            {patient.name} - {patient.gender.charAt(0)} - {patient.appointmentTime ? `⏰ ${patient.appointmentTime}` : ''} ({patient.contact})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Doctor Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="doctorName"
                                    value={formData.doctorName}
                                    onChange={handleConsultationChange}
                                    className="input-field"
                                    placeholder="Dr. Name"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Consultation Details Card */}
                    <div className="card">
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <span className="text-2xl mr-2">🩺</span>
                            Consultation Details
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Symptoms <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="symptoms"
                                    value={formData.symptoms}
                                    onChange={handleConsultationChange}
                                    className="input-field"
                                    rows="3"
                                    placeholder="Describe patient symptoms..."
                                    required
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Diagnosis <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="diagnosis"
                                    value={formData.diagnosis}
                                    onChange={handleConsultationChange}
                                    className="input-field"
                                    rows="3"
                                    placeholder="Enter diagnosis..."
                                    required
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Medicines Card */}
                    <div className="card">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold flex items-center">
                                <span className="text-2xl mr-2">💊</span>
                                Medicines
                            </h2>
                            <button
                                type="button"
                                onClick={addMedicineRow}
                                className="text-sm bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                + Add Medicine
                            </button>
                        </div>

                        <div className="space-y-4">
                            {formData.medicines.map((medicine, index) => (
                                <div key={index} className="border-2 border-gray-200 rounded-lg p-4 bg-blue-50">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="font-medium text-gray-700">Medicine #{index + 1}</span>
                                        {formData.medicines.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeMedicineRow(index)}
                                                className="text-red-600 hover:text-red-800 text-sm"
                                            >
                                                ✕ Remove
                                            </button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Medicine Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={medicine.name}
                                                onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                                                className="input-field"
                                                placeholder="Medicine name"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Dosage *
                                            </label>
                                            <input
                                                type="text"
                                                value={medicine.dosage}
                                                onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                                                className="input-field"
                                                placeholder="e.g., 500mg"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Timing *
                                            </label>
                                            <select
                                                value={medicine.timing}
                                                onChange={(e) => handleMedicineChange(index, 'timing', e.target.value)}
                                                className="input-field"
                                                required
                                            >
                                                <option value="Morning">Morning</option>
                                                <option value="Afternoon">Afternoon</option>
                                                <option value="Evening">Evening</option>
                                                <option value="Night">Night</option>
                                                <option value="Morning & Night">Morning & Night</option>
                                                <option value="After Meals">After Meals</option>
                                                <option value="Before Meals">Before Meals</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="btn-primary w-full text-lg py-4">
                        ✓ Create Prescription
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Consultation;
