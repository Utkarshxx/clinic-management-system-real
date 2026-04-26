// Import React and hooks
import React, { useState, useEffect } from 'react';
// Import Link for navigation
import { Link } from 'react-router-dom';
// Import Navbar component
import Navbar from '../components/Navbar';
// Import API function to get all patients
import { getAllPatients } from '../services/api';

// Dashboard component - shows role-based dashboard
const Dashboard = () => {
    // Get user info from localStorage
    const userRole = localStorage.getItem('userRole');
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    // State for patient count - using useState hook
    const [patientCount, setPatientCount] = useState(0);

    // Fetch patient count when component mounts - using useEffect hook
    useEffect(() => {
        const fetchPatientCount = async () => {
            try {
                const response = await getAllPatients();
                setPatientCount(response.count || 0);
            } catch (error) {
                console.error('Error fetching patient count:', error);
            }
        };

        fetchPatientCount();
    }, []); // Empty dependency array means this runs once on mount

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Welcome Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Welcome, {user?.username || 'User'}!
                    </h1>
                    <p className="text-gray-600">Role: {userRole}</p>
                </div>

                {/* Admin Dashboard */}
                {userRole === 'Admin' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">System Users</h3>
                                        <p className="text-4xl font-bold">-</p>
                                        <p className="text-sm opacity-90">Doctors & Receptionists</p>
                                    </div>
                                    <div className="text-4xl">👥</div>
                                </div>
                            </div>
                            <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">Total Patients</h3>
                                        <p className="text-4xl font-bold">{patientCount}</p>
                                        <p className="text-sm opacity-90">Registered in system</p>
                                    </div>
                                    <div className="text-4xl">🏥</div>
                                </div>
                            </div>
                            <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">System Status</h3>
                                        <p className="text-2xl font-bold">✓ Active</p>
                                        <p className="text-sm opacity-90">All systems operational</p>
                                    </div>
                                    <div className="text-4xl">⚡</div>
                                </div>
                            </div>
                        </div>

                        <div className="card mb-6">
                            <h2 className="text-xl font-semibold mb-6">Admin Actions</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Link
                                    to="/users"
                                    className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg hover:shadow-xl transition-all border-2 border-purple-200 hover:border-purple-400"
                                >
                                    <div className="text-4xl mb-3">👥</div>
                                    <div className="font-semibold text-lg text-gray-800">Manage Users</div>
                                    <div className="text-sm text-gray-600 mt-1">Create and manage doctors & receptionists</div>
                                </Link>

                                <Link
                                    to="/patient-history"
                                    className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg hover:shadow-xl transition-all border-2 border-blue-200 hover:border-blue-400"
                                >
                                    <div className="text-4xl mb-3">📊</div>
                                    <div className="font-semibold text-lg text-gray-800">View All Records</div>
                                    <div className="text-sm text-gray-600 mt-1">Access complete patient records & history</div>
                                </Link>
                            </div>
                        </div>

                        <div className="p-5 bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 rounded-lg">
                            <div className="flex items-start">
                                <div className="text-2xl mr-3">ℹ️</div>
                                <div>
                                    <p className="font-semibold text-gray-800 mb-1">Admin Role Overview</p>
                                    <p className="text-sm text-gray-700">
                                        As an admin, you manage system users and oversee all operations.
                                        Patient registration and medical operations (consultations, prescriptions) are handled by doctors and receptionists.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Doctor Dashboard */}
                {userRole === 'Doctor' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">Total Patients</h3>
                                        <p className="text-4xl font-bold">{patientCount}</p>
                                        <p className="text-sm opacity-90">Under your care</p>
                                    </div>
                                    <div className="text-4xl">👥</div>
                                </div>
                            </div>
                            <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">Your Role</h3>
                                        <p className="text-2xl font-bold">Doctor</p>
                                        <p className="text-sm opacity-90">Medical Consultations</p>
                                    </div>
                                    <div className="text-4xl">🩺</div>
                                </div>
                            </div>
                        </div>

                        <div className="card mb-6">
                            <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Link
                                    to="/patients"
                                    className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg hover:shadow-xl transition-all border-2 border-blue-200 hover:border-blue-400"
                                >
                                    <div className="text-4xl mb-3">👥</div>
                                    <div className="font-semibold text-lg text-gray-800">View Patients</div>
                                    <div className="text-sm text-gray-600 mt-1">Access patient records</div>
                                </Link>

                                <Link
                                    to="/consultation"
                                    className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg hover:shadow-xl transition-all border-2 border-green-200 hover:border-green-400"
                                >
                                    <div className="text-4xl mb-3">🩺</div>
                                    <div className="font-semibold text-lg text-gray-800">New Consultation</div>
                                    <div className="text-sm text-gray-600 mt-1">Create prescriptions</div>
                                </Link>

                                <Link
                                    to="/lab-test"
                                    className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg hover:shadow-xl transition-all border-2 border-yellow-200 hover:border-yellow-400"
                                >
                                    <div className="text-4xl mb-3">🧪</div>
                                    <div className="font-semibold text-lg text-gray-800">Lab Tests</div>
                                    <div className="text-sm text-gray-600 mt-1">Order and view lab reports</div>
                                </Link>

                                <Link
                                    to="/patient-history"
                                    className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg hover:shadow-xl transition-all border-2 border-purple-200 hover:border-purple-400"
                                >
                                    <div className="text-4xl mb-3">📋</div>
                                    <div className="font-semibold text-lg text-gray-800">Patient History</div>
                                    <div className="text-sm text-gray-600 mt-1">View complete medical records</div>
                                </Link>
                            </div>
                        </div>

                        <div className="p-5 bg-gradient-to-r from-blue-50 to-green-50 border-l-4 border-blue-400 rounded-lg">
                            <div className="flex items-start">
                                <div className="text-2xl mr-3">ℹ️</div>
                                <div>
                                    <p className="font-semibold text-gray-800 mb-1">Doctor Responsibilities</p>
                                    <p className="text-sm text-gray-700">
                                        Manage patient consultations, create prescriptions, order lab tests, and maintain comprehensive medical records.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Receptionist Dashboard */}
                {userRole === 'Receptionist' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                                <h3 className="text-lg font-semibold mb-2">Total Patients</h3>
                                <p className="text-4xl font-bold">{patientCount}</p>
                                <p className="text-sm opacity-90">Registered in system</p>
                            </div>
                            <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                                <h3 className="text-lg font-semibold mb-2">Your Role</h3>
                                <p className="text-2xl font-bold">Receptionist</p>
                                <p className="text-sm opacity-90">Patient & Billing Management</p>
                            </div>
                        </div>

                        <div className="card mb-6">
                            <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Link
                                    to="/patients"
                                    className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg hover:shadow-lg transition-all border-2 border-blue-200 hover:border-blue-400"
                                >
                                    <div className="text-4xl mb-3">➕</div>
                                    <div className="font-semibold text-lg text-gray-800">Register New Patient</div>
                                    <div className="text-sm text-gray-600 mt-1">Add patient records to the system</div>
                                </Link>

                                <Link
                                    to="/billing"
                                    className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg hover:shadow-lg transition-all border-2 border-green-200 hover:border-green-400"
                                >
                                    <div className="text-4xl mb-3">💰</div>
                                    <div className="font-semibold text-lg text-gray-800">Create Bill</div>
                                    <div className="text-sm text-gray-600 mt-1">Generate patient bills</div>
                                </Link>

                                <Link
                                    to="/patient-history"
                                    className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg hover:shadow-lg transition-all border-2 border-purple-200 hover:border-purple-400"
                                >
                                    <div className="text-4xl mb-3">📋</div>
                                    <div className="font-semibold text-lg text-gray-800">Patient Records</div>
                                    <div className="text-sm text-gray-600 mt-1">View patient history</div>
                                </Link>

                                <Link
                                    to="/lab-test"
                                    className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg hover:shadow-lg transition-all border-2 border-yellow-200 hover:border-yellow-400"
                                >
                                    <div className="text-4xl mb-3">🧪</div>
                                    <div className="font-semibold text-lg text-gray-800">View Lab Reports</div>
                                    <div className="text-sm text-gray-600 mt-1">Check lab test results</div>
                                </Link>
                            </div>
                        </div>

                        <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
                            <p className="text-sm text-blue-800">
                                <strong>Receptionist Responsibilities:</strong> Register new patients, manage billing, and maintain patient records.
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
