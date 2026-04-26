import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { addPatient, getAllPatients, getPatientById } from '../services/api';

const PatientManagement = () => {
    const navigate = useNavigate();
    const userRole = localStorage.getItem('userRole');

    useEffect(() => {
        if (userRole !== 'Receptionist' && userRole !== 'Doctor') {
            alert('Access denied. This page is for Receptionists and Doctors only.');
            navigate('/dashboard');
        }
    }, [userRole, navigate]);

    const [formData, setFormData] = useState({
        name: '',
        age: '',
        gender: 'Male',
        contact: '',
        address: '',
        appointmentDate: new Date().toISOString().split('T')[0],
        appointmentTime: ''
    });

    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const response = await getAllPatients();
            setPatients(response.data || []);
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Name is required';
        else if (formData.name.length < 3) newErrors.name = 'Name must be at least 3 characters';

        if (!formData.age) newErrors.age = 'Age is required';
        else if (formData.age < 0 || formData.age > 120) newErrors.age = 'Enter valid age (0-120)';

        if (!formData.contact) newErrors.contact = 'Contact required';
        else if (!/^\d{10}$/.test(formData.contact)) newErrors.contact = 'Enter valid 10-digit number';

        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.appointmentTime) newErrors.appointmentTime = 'Time is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        try {
            await addPatient(formData);
            setSuccessMessage('✓ Patient registered successfully!');
            setFormData({
                name: '',
                age: '',
                gender: 'Male',
                contact: '',
                address: '',
                appointmentDate: new Date().toISOString().split('T')[0],
                appointmentTime: ''
            });
            fetchPatients();
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Error adding patient:', error);
            alert('Error registering patient. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleViewPatient = async (patientId) => {
        try {
            const response = await getPatientById(patientId);
            setSelectedPatient(response.data);
        } catch (error) {
            console.error('Error fetching patient details:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Patient Management</h1>
                        <p className="text-gray-500 mt-1">Register new patients and manage records</p>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 hidden md:block">
                        <span className="text-sm font-medium text-gray-500">Total Patients</span>
                        <p className="text-2xl font-bold text-blue-600">{patients.length}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Register New Patient Form */}
                    <div className="lg:col-span-5">
                        <div className="card sticky top-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                                <span className="p-2 bg-blue-50 rounded-lg text-blue-600 text-lg">➕</span>
                                New Registration
                            </h2>

                            {successMessage && (
                                <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 flex items-center border border-green-100 animate-fade-in">
                                    <span className="text-xl mr-2">✓</span>
                                    {successMessage}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Patient Name <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className={`input-field ${errors.name ? 'border-red-500 ring-2 ring-red-50' : ''}`}
                                        placeholder="Full Name"
                                    />
                                    {errors.name && <p className="text-xs text-red-500 mt-1 ml-1">{errors.name}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Age <span className="text-red-500">*</span></label>
                                        <input
                                            type="number"
                                            name="age"
                                            value={formData.age}
                                            onChange={handleInputChange}
                                            className={`input-field ${errors.age ? 'border-red-500 ring-2 ring-red-50' : ''}`}
                                            placeholder="yy"
                                        />
                                        {errors.age && <p className="text-xs text-red-500 mt-1 ml-1">{errors.age}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Gender <span className="text-red-500">*</span></label>
                                        <select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleInputChange}
                                            className="input-field cursor-pointer"
                                        >
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Contact <span className="text-red-500">*</span></label>
                                    <input
                                        type="tel"
                                        name="contact"
                                        value={formData.contact}
                                        onChange={handleInputChange}
                                        className={`input-field ${errors.contact ? 'border-red-500 ring-2 ring-red-50' : ''}`}
                                        placeholder="Mobile Number"
                                        maxLength="10"
                                    />
                                    {errors.contact && <p className="text-xs text-red-500 mt-1 ml-1">{errors.contact}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Appointment Details</div>
                                    <div>
                                        <input
                                            type="date"
                                            name="appointmentDate"
                                            value={formData.appointmentDate}
                                            onChange={handleInputChange}
                                            className="input-field bg-white text-sm py-2"
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="time"
                                            name="appointmentTime"
                                            value={formData.appointmentTime}
                                            onChange={handleInputChange}
                                            className={`input-field bg-white text-sm py-2 ${errors.appointmentTime ? 'border-red-500' : ''}`}
                                        />
                                    </div>
                                    {errors.appointmentTime && <p className="col-span-2 text-xs text-red-500 ml-1">{errors.appointmentTime}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Address <span className="text-red-500">*</span></label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className={`input-field resize-none ${errors.address ? 'border-red-500 ring-2 ring-red-50' : ''}`}
                                        rows="2"
                                        placeholder="Residential Address"
                                    ></textarea>
                                    {errors.address && <p className="text-xs text-red-500 mt-1 ml-1">{errors.address}</p>}
                                </div>

                                <button
                                    type="submit"
                                    className="btn-primary w-full py-3 shadow-md hover:shadow-lg mt-2"
                                    disabled={loading}
                                >
                                    {loading ? 'Registering...' : 'Register Patient'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Patients List */}
                    <div className="lg:col-span-7">
                        <div className="card h-full flex flex-col">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
                                <span className="flex items-center gap-2">
                                    <span className="p-2 bg-purple-50 rounded-lg text-purple-600 text-lg">👥</span>
                                    Recent Patients
                                </span>
                            </h2>

                            {patients.length === 0 ? (
                                <div className="text-center py-20 flex flex-col items-center justify-center opacity-60">
                                    <span className="text-6xl mb-4">📭</span>
                                    <p className="text-gray-500 text-lg font-medium">No patients found</p>
                                    <p className="text-gray-400 text-sm mt-1">Newly registered patients will appear here</p>
                                </div>
                            ) : (
                                <div className="flex-1 overflow-y-auto pr-2 space-y-3 max-h-[calc(100vh-250px)]">
                                    {patients.map((patient) => (
                                        <div
                                            key={patient._id}
                                            onClick={() => handleViewPatient(patient._id)}
                                            className="group bg-white border border-gray-100 rounded-xl p-4 hover:border-blue-300 hover:shadow-md cursor-pointer transition-all duration-200 flex items-start gap-4"
                                        >
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 font-bold text-lg shadow-inner">
                                                {patient.name.charAt(0)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-bold text-gray-800 text-lg truncate group-hover:text-blue-600 transition-colors">{patient.name}</h3>
                                                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                                            <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium">{patient.age} yrs</span>
                                                            <span>{patient.gender}</span>
                                                            <span className="flex items-center gap-1">📞 {patient.contact}</span>
                                                        </div>
                                                    </div>
                                                    {patient.patientId && (
                                                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-xs font-bold tracking-wide border border-blue-100">
                                                            {patient.patientId}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="mt-3 pt-3 border-t border-gray-50 flex justify-between items-center text-xs text-gray-400">
                                                    <span>Reg: {new Date(patient.registrationDate).toLocaleDateString()}</span>
                                                    <span className="text-blue-500 font-medium group-hover:translate-x-1 transition-transform">View Details →</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Patient Details Modal */}
                {selectedPatient && (
                    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
                        <div className="card max-w-lg w-full p-0 overflow-hidden shadow-2xl transform transition-all scale-100">
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white relative">
                                <button
                                    onClick={() => setSelectedPatient(null)}
                                    className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1 transition-colors"
                                >
                                    ✕
                                </button>
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-3xl font-bold border-2 border-white/30">
                                        {selectedPatient.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold">{selectedPatient.name}</h2>
                                        <p className="opacity-90 flex items-center gap-2 text-sm mt-1">
                                            <span>{selectedPatient.age} years</span> • <span>{selectedPatient.gender}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                                {selectedPatient.patientId && (
                                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
                                        <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Patient ID</p>
                                        <p className="text-3xl font-mono font-bold text-gray-800 tracking-wider">{selectedPatient.patientId}</p>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold text-gray-500 uppercase">Contact</p>
                                        <p className="font-medium text-gray-800">{selectedPatient.contact}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold text-gray-500 uppercase">Registered</p>
                                        <p className="font-medium text-gray-800">{new Date(selectedPatient.registrationDate).toLocaleDateString()}</p>
                                    </div>
                                    <div className="col-span-2 space-y-1">
                                        <p className="text-xs font-semibold text-gray-500 uppercase">Address</p>
                                        <p className="font-medium text-gray-800 leading-relaxed">{selectedPatient.address}</p>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="p-1.5 bg-purple-100 text-purple-600 rounded">🗓️</span>
                                        <span className="font-semibold text-gray-800">Appointment</span>
                                    </div>
                                    <div className="flex justify-between bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        <div>
                                            <p className="text-xs text-gray-500">Date</p>
                                            <p className="font-medium">{selectedPatient.appointmentDate ? new Date(selectedPatient.appointmentDate).toLocaleDateString() : 'N/A'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500">Time</p>
                                            <p className="font-medium">{selectedPatient.appointmentTime || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                                <button
                                    onClick={() => setSelectedPatient(null)}
                                    className="btn-secondary px-6"
                                >
                                    Close Details
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientManagement;
