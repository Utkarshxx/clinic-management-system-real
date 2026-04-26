// Import React
import React from 'react';
// Import Navigate for redirecting
import { Navigate } from 'react-router-dom';

// ProtectedRoute component - protects routes that require authentication
// Usage: <ProtectedRoute><YourComponent /></ProtectedRoute>
const ProtectedRoute = ({ children }) => {
    // Check if user has a valid token in localStorage
    const token = localStorage.getItem('token');

    // If no token, redirect to login page
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // If token exists, render the protected component
    return children;
};

export default ProtectedRoute;
