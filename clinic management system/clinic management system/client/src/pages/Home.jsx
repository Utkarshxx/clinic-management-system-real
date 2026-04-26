// Import React library and hooks
import React, { useState } from 'react';
// Import useNavigate for navigation
import { useNavigate } from 'react-router-dom';

// Home component - Landing page with hero section and patient portal
const Home = () => {
    const navigate = useNavigate();

    // State for patient ID input
    const [patientId, setPatientId] = useState('');

    // Navigate to login page
    const handleGetStarted = () => {
        navigate('/login');
    };

    // Navigate to about section
    const scrollToAbout = () => {
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    };

    // Handle patient portal access
    const handlePatientPortal = (e) => {
        e.preventDefault();
        if (patientId.trim()) {
            // Navigate to patient history with the patient ID
            navigate(`/patient-portal/${patientId.toUpperCase()}`);
        } else {
            alert('Please enter your Patient ID');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-clinic-primary to-white">
            {/* Navigation Bar */}
            <nav className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <span className="text-3xl">🏥</span>
                            <h1 className="text-2xl font-bold text-clinic-blue">ClinicCare</h1>
                        </div>
                        <button
                            onClick={handleGetStarted}
                            className="btn-primary">
                            Staff Login
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column - Text Content */}
                    <div className="space-y-6">
                        <h1 className="text-5xl font-bold text-gray-800 leading-tight">
                            Modern Clinic Management Made
                            <span className="text-clinic-blue"> Simple</span>
                        </h1>
                        <p className="text-xl text-gray-600 leading-relaxed">
                            Streamline your clinic operations with our comprehensive management system.
                            Handle patient records, consultations, prescriptions, lab reports, and billing
                            all in one place.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap gap-4 pt-4">
                            <button
                                onClick={handleGetStarted}
                                className="bg-clinic-blue text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                Get Started →
                            </button>
                            <button
                                onClick={scrollToAbout}
                                className="bg-white text-clinic-blue px-8 py-4 rounded-lg text-lg font-semibold border-2 border-clinic-blue hover:bg-clinic-primary transition-all"
                            >
                                Learn More
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-6 pt-8">
                            <div className="text-center">
                                <p className="text-3xl font-bold text-clinic-blue">500+</p>
                                <p className="text-gray-600 text-sm">Patients</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-clinic-blue">50+</p>
                                <p className="text-gray-600 text-sm">Doctors</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-clinic-blue">24/7</p>
                                <p className="text-gray-600 text-sm">Support</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Image */}
                    <div className="relative">
                        <div className="bg-gradient-to-br from-clinic-blue to-blue-600 rounded-3xl p-2 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                            <img
                                src="/header_img.png"
                                alt="Clinic Management System"
                                className="rounded-2xl w-full h-auto object-cover"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.parentElement.innerHTML = '<div class="bg-white rounded-2xl h-96 flex items-center justify-center"><span class="text-6xl">🏥</span></div>';
                                }}
                            />
                        </div>
                        {/* Decorative Elements */}
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-clinic-blue rounded-full opacity-20 blur-xl"></div>
                        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-400 rounded-full opacity-20 blur-xl"></div>
                    </div>
                </div>
            </section>

            {/* Patient Portal Section */}
            <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-16">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="card bg-white shadow-2xl">
                        <div className="text-center mb-8">
                            <div className="text-6xl mb-4">🔐</div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-3">
                                Patient Portal
                            </h2>
                            <p className="text-gray-600 text-lg">
                                Access your medical records, prescriptions, lab reports, and bills
                            </p>
                        </div>

                        <form onSubmit={handlePatientPortal} className="max-w-md mx-auto">
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Enter Your Patient ID
                                </label>
                                <input
                                    type="text"
                                    value={patientId}
                                    onChange={(e) => setPatientId(e.target.value.toUpperCase())}
                                    className="input-field text-center text-2xl font-bold tracking-widest"
                                    placeholder="A1B2C3"
                                    maxLength="6"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    Your unique 6-character Patient ID was provided when you registered
                                </p>
                            </div>

                            <button
                                type="submit"
                                className="btn-primary w-full text-lg py-4"
                            >
                                View My Records →
                            </button>
                        </form>

                        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200 text-center">
                            <p className="text-sm text-blue-800 mb-2">
                                <strong>Note:</strong> Your Patient ID is a unique 6-character code (e.g., A1B2C3) given to you by the clinic staff when you were registered.
                            </p>
                            <p className="text-sm text-gray-600 mt-4 border-t border-blue-200 pt-3">
                                New Patient? <a href="/register-patient" className="text-blue-700 font-bold hover:underline">Register Yourself Here →</a>
                            </p>
                        </div>
                    </div>
                </div>
            </section>


            {/* Features Section */}
            <section id="about" className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">
                            Everything You Need to Manage Your Clinic
                        </h2>
                        <p className="text-xl text-gray-600">
                            Powerful features designed for modern healthcare management
                        </p>
                    </div>

                    {/* Feature Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Feature 1 */}
                        <div className="card hover:shadow-xl transition-shadow text-center">
                            <div className="text-5xl mb-4">👥</div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                Patient Management
                            </h3>
                            <p className="text-gray-600">
                                Register and manage patient records with ease
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="card hover:shadow-xl transition-shadow text-center">
                            <div className="text-5xl mb-4">🩺</div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                Consultations
                            </h3>
                            <p className="text-gray-600">
                                Record symptoms, diagnosis, and prescriptions
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="card hover:shadow-xl transition-shadow text-center">
                            <div className="text-5xl mb-4">🧪</div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                Lab Reports
                            </h3>
                            <p className="text-gray-600">
                                Manage and track laboratory test results
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="card hover:shadow-xl transition-shadow text-center">
                            <div className="text-5xl mb-4">💰</div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                Billing System
                            </h3>
                            <p className="text-gray-600">
                                Generate and manage patient bills efficiently
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Role-Based Access Section */}
            <section className="bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">
                            Role-Based Access Control
                        </h2>
                        <p className="text-xl text-gray-600">
                            Secure access for different user roles
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Admin */}
                        <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200">
                            <div className="text-5xl mb-4 text-center">👑</div>
                            <h3 className="text-2xl font-semibold text-gray-800 mb-3 text-center">Admin</h3>
                            <ul className="space-y-2 text-gray-700">
                                <li>✓ Manage system users</li>
                                <li>✓ View all patient records</li>
                                <li>✓ System oversight</li>
                                <li>✗ Cannot add patients</li>
                                <li>✗ Cannot create prescriptions</li>
                            </ul>
                        </div>

                        {/* Doctor */}
                        <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200">
                            <div className="text-5xl mb-4 text-center">👨‍⚕️</div>
                            <h3 className="text-2xl font-semibold text-gray-800 mb-3 text-center">Doctor</h3>
                            <ul className="space-y-2 text-gray-700">
                                <li>✓ View patients</li>
                                <li>✓ Create consultations</li>
                                <li>✓ Prescribe medicines</li>
                                <li>✓ Order lab tests</li>
                                <li>✗ Cannot manage users</li>
                            </ul>
                        </div>

                        {/* Receptionist */}
                        <div className="card bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200">
                            <div className="text-5xl mb-4 text-center">👔</div>
                            <h3 className="text-2xl font-semibold text-gray-800 mb-3 text-center">Receptionist</h3>
                            <ul className="space-y-2 text-gray-700">
                                <li>✓ Register new patients</li>
                                <li>✓ Create bills</li>
                                <li>✓ View lab reports</li>
                                <li>✗ Cannot manage users</li>
                                <li>✗ Cannot create prescriptions</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-lg mb-2">🏥 ClinicCare Management System</p>
                    <p className="text-gray-400">Modern healthcare management solution</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
