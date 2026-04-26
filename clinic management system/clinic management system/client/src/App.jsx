// Import React library
import React from 'react';
// Import BrowserRouter for routing, Routes for route definitions, Route for individual routes
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import all page components
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import PatientManagement from './pages/PatientManagement';
import Consultation from './pages/Consultation';
import Prescription from './pages/Prescription';
import LabTest from './pages/LabTest';
import Billing from './pages/Billing';
import PatientHistory from './pages/PatientHistory';
import PatientPortal from './pages/PatientPortal';
import RegisterPatient from './pages/RegisterPatient';


// Import ProtectedRoute component
import ProtectedRoute from './components/ProtectedRoute';

// Main App component
function App() {
    return (
        // BrowserRouter enables routing in the application
        <BrowserRouter>
            {/* Routes component contains all route definitions */}
            <Routes>
                {/* Public Routes - No authentication required */}

                {/* Home page - landing page with hero section */}
                <Route path="/" element={<Home />} />

                {/* Login page - JWT authentication */}
                <Route path="/login" element={<Login />} />

                {/* Patient Portal - public access for patients */}
                <Route path="/patient-portal/:patientId" element={<PatientPortal />} />

                {/* Patient Self Registration - public */}
                <Route path="/register-patient" element={<RegisterPatient />} />


                {/* Protected Routes - Require JWT authentication */}

                {/* Dashboard - shows after login */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                {/* User Management - Admin only */}
                <Route
                    path="/users"
                    element={
                        <ProtectedRoute>
                            <UserManagement />
                        </ProtectedRoute>
                    }
                />

                {/* Patient Management - add and view patients */}
                <Route
                    path="/patients"
                    element={
                        <ProtectedRoute>
                            <PatientManagement />
                        </ProtectedRoute>
                    }
                />

                {/* Consultation - doctor consultation page */}
                <Route
                    path="/consultation"
                    element={
                        <ProtectedRoute>
                            <Consultation />
                        </ProtectedRoute>
                    }
                />

                {/* Prescription - view prescriptions */}
                <Route
                    path="/prescription"
                    element={
                        <ProtectedRoute>
                            <Prescription />
                        </ProtectedRoute>
                    }
                />

                {/* Lab Test - add and view lab reports */}
                <Route
                    path="/lab-test"
                    element={
                        <ProtectedRoute>
                            <LabTest />
                        </ProtectedRoute>
                    }
                />

                {/* Billing - generate and view bills */}
                <Route
                    path="/billing"
                    element={
                        <ProtectedRoute>
                            <Billing />
                        </ProtectedRoute>
                    }
                />

                {/* Patient History - complete patient history */}
                <Route
                    path="/patient-history"
                    element={
                        <ProtectedRoute>
                            <PatientHistory />
                        </ProtectedRoute>
                    }
                />

                {/* Redirect any unknown routes to home */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
