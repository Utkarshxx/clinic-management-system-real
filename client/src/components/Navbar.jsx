// Import React library
import React from 'react';
// Import Link component from react-router-dom for navigation
import { Link, useNavigate } from 'react-router-dom';

// Navbar component - displays navigation menu
const Navbar = () => {
    // Get navigate function for programmatic navigation
    const navigate = useNavigate();

    // Get user info from localStorage
    const userRole = localStorage.getItem('userRole');
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    // Handle logout - clear token and user data, redirect to home
    const handleLogout = () => {
        // Clear all authentication data from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');

        // Redirect to home page
        navigate('/');
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo/Brand */}
                    <div className="flex items-center">
                        <Link to="/dashboard" className="text-xl font-bold text-clinic-blue">
                            🏥 Clinic Management
                        </Link>
                    </div>

                    {/* Navigation Links - Role-based */}
                    <div className="flex items-center space-x-6">
                        <Link to="/dashboard" className="text-gray-700 hover:text-clinic-blue">
                            Dashboard
                        </Link>

                        {/* Admin Only - User Management */}
                        {userRole === 'Admin' && (
                            <Link to="/users" className="text-gray-700 hover:text-clinic-blue">
                                Users
                            </Link>
                        )}

                        {/* Doctor & Receptionist - Patient Management */}
                        {(userRole === 'Doctor' || userRole === 'Receptionist') && (
                            <Link to="/patients" className="text-gray-700 hover:text-clinic-blue">
                                Patients
                            </Link>
                        )}

                        {/* Doctor Only - Consultation */}
                        {userRole === 'Doctor' && (
                            <Link to="/consultation" className="text-gray-700 hover:text-clinic-blue">
                                Consultation
                            </Link>
                        )}

                        {/* Doctor & Receptionist - Lab Tests */}
                        {(userRole === 'Doctor' || userRole === 'Receptionist') && (
                            <Link to="/lab-test" className="text-gray-700 hover:text-clinic-blue">
                                Lab Tests
                            </Link>
                        )}

                        {/* Receptionist Only - Billing */}
                        {userRole === 'Receptionist' && (
                            <Link to="/billing" className="text-gray-700 hover:text-clinic-blue">
                                Billing
                            </Link>
                        )}

                        {/* All Roles - Patient History */}
                        <Link to="/patient-history" className="text-gray-700 hover:text-clinic-blue">
                            History
                        </Link>
                    </div>

                    {/* User Info and Logout */}
                    <div className="flex items-center space-x-4">
                        {user && (
                            <div className="text-sm">
                                <p className="font-semibold text-gray-800">{user.username}</p>
                                <p className="text-xs bg-clinic-primary px-2 py-1 rounded-full text-center">
                                    {userRole}
                                </p>
                            </div>
                        )}
                        <button
                            onClick={handleLogout}
                            className="text-sm bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
