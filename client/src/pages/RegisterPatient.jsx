import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { addPatient } from '../services/api';

const RegisterPatient = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        age: '',
        gender: 'Male',
        contact: '',
        address: '',
        appointmentDate: new Date().toISOString().split('T')[0],
        appointmentTime: ''
    });

    const [loading, setLoading] = useState(false);
    const [successData, setSuccessData] = useState(null);
    const [errors, setErrors] = useState({});

    // Icons
    const Icons = {
        User: () => <span className="text-gray-400">👤</span>,
        Phone: () => <span className="text-gray-400">📞</span>,
        Calendar: () => <span className="text-gray-400">📅</span>,
        Location: () => <span className="text-gray-400">📍</span>,
        Clock: () => <span className="text-gray-400">⏰</span>
    };

    const validateForm = () => {
        const newErrors = {};

        // Name Validation
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        else if (formData.name.length < 3) newErrors.name = 'Name must be at least 3 characters';

        // Age Validation
        if (!formData.age) newErrors.age = 'Age is required';
        else if (formData.age < 0 || formData.age > 120) newErrors.age = 'Please enter a valid age (0-120)';

        // Contact Validation
        if (!formData.contact) newErrors.contact = 'Contact number is required';
        else if (!/^\d{10}$/.test(formData.contact)) newErrors.contact = 'Please enter a valid 10-digit mobile number';

        // Address Validation
        if (!formData.address.trim()) newErrors.address = 'Address is required';

        // Time Validation
        if (!formData.appointmentTime) newErrors.appointmentTime = 'Please select a time';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        // Clear error when user types
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        try {
            const response = await addPatient(formData);
            if (response.success) {
                setSuccessData(response.data);
                window.scrollTo(0, 0);
            }
        } catch (err) {
            setErrors({ submit: 'Registration failed. Please try again or contact support.' });
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (successData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
                <div className="card max-w-lg w-full text-center animate-fade-in border-t-4 border-green-500">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl">🎉</span>
                    </div>

                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Registration Successful!</h2>
                    <p className="text-gray-600 mb-8">Welcome to ClinicCare. Your account has been created.</p>

                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8 relative overflow-hidden group hover:shadow-md transition-all">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100 rounded-bl-full opacity-50 z-0"></div>
                        <p className="text-xs text-blue-600 font-bold uppercase tracking-widest mb-2 relative z-10">Your Patient ID</p>
                        <div className="text-5xl font-bold text-blue-900 tracking-widest bg-white py-4 rounded-lg shadow-sm border border-blue-100 relative z-10 font-mono">
                            {successData.patientId}
                        </div>
                        <p className="text-xs text-blue-600 mt-4 relative z-10 flex items-center justify-center gap-1">
                            <span>ℹ️</span> Please save this ID to access your records
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        <button
                            onClick={() => window.print()}
                            className="btn-secondary w-full"
                        >
                            🖨️ Print Details
                        </button>
                        <Link to="/" className="btn-primary w-full block text-center py-3 no-underline">
                            Go to Patient Portal →
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <Link to="/" className="inline-block hover:scale-110 transition-transform duration-200">
                        <span className="text-5xl drop-shadow-md">🏥</span>
                    </Link>
                    <h1 className="text-4xl font-bold text-gray-900 mt-4 mb-2 tracking-tight">Patient Registration</h1>
                    <p className="text-lg text-gray-600 font-light">Join our clinic in just a few steps</p>
                </div>

                <div className="card shadow-xl border-t-4 border-blue-500 animate-fade-in relative z-10">
                    {errors.submit && (
                        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-200 flex items-center">
                            <span className="text-xl mr-2">⚠️</span> {errors.submit}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Personal Details Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                                <span className="text-xl bg-blue-100 p-2 rounded-lg">👤</span>
                                <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Full Name <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Icons.User />
                                        </div>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className={`input-field pl-10 ${errors.name ? 'border-red-500 ring-4 ring-red-50' : ''}`}
                                            placeholder="e.g. John Doe"
                                        />
                                    </div>
                                    {errors.name && <p className="mt-1 text-sm text-red-600 ml-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Age <span className="text-red-500">*</span></label>
                                    <input
                                        type="number"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        className={`input-field ${errors.age ? 'border-red-500 ring-4 ring-red-50' : ''}`}
                                        placeholder="Age"
                                    />
                                    {errors.age && <p className="mt-1 text-sm text-red-600 ml-1">{errors.age}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Gender <span className="text-red-500">*</span></label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="input-field cursor-pointer"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Mobile Number <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Icons.Phone />
                                        </div>
                                        <input
                                            type="tel"
                                            name="contact"
                                            value={formData.contact}
                                            onChange={handleChange}
                                            className={`input-field pl-10 ${errors.contact ? 'border-red-500 ring-4 ring-red-50' : ''}`}
                                            placeholder="10-digit mobile number"
                                            maxLength="10"
                                        />
                                    </div>
                                    {errors.contact && <p className="mt-1 text-sm text-red-600 ml-1">{errors.contact}</p>}
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Address <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <div className="absolute top-3 left-3 pointer-events-none">
                                            <Icons.Location />
                                        </div>
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            className={`input-field pl-10 resize-none ${errors.address ? 'border-red-500 ring-4 ring-red-50' : ''}`}
                                            rows="3"
                                            placeholder="Your residential address"
                                        ></textarea>
                                    </div>
                                    {errors.address && <p className="mt-1 text-sm text-red-600 ml-1">{errors.address}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Appointment Details Section */}
                        <div className="space-y-6 pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                                <span className="text-xl bg-purple-100 p-2 rounded-lg">🗓️</span>
                                <h3 className="text-lg font-semibold text-gray-800">Appointment Preference</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Preferred Date</label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            name="appointmentDate"
                                            value={formData.appointmentDate}
                                            onChange={handleChange}
                                            className="input-field cursor-pointer"
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Preferred Time <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <input
                                            type="time"
                                            name="appointmentTime"
                                            value={formData.appointmentTime}
                                            onChange={handleChange}
                                            className={`input-field cursor-pointer ${errors.appointmentTime ? 'border-red-500 ring-4 ring-red-50' : ''}`}
                                        />
                                    </div>
                                    {errors.appointmentTime && <p className="mt-1 text-sm text-red-600 ml-1">{errors.appointmentTime}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-6 border-t border-gray-100">
                            <Link to="/" className="btn-secondary flex-1 text-center py-3.5 text-lg font-medium">
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                className="btn-primary flex-[2] py-3.5 text-lg shadow-xl hover:shadow-2xl transition-all"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                                        Registering...
                                    </span>
                                ) : 'Register Now →'}
                            </button>
                        </div>
                    </form>
                </div>

                <p className="text-center text-gray-500 mt-8 text-sm">
                    Protected by medical data privacy standards. Your information is secure.
                </p>
            </div>
        </div>
    );
};

export default RegisterPatient;
