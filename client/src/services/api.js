// Import axios library for making HTTP requests
import axios from 'axios';

// Base URL for backend API
// const API_BASE_URL = 'http://localhost:5000/api';
const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

// Create axios instance with base configuration
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor - automatically attach JWT token to requests
api.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        const token = localStorage.getItem('token');

        // If token exists, add it to Authorization header
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle token expiration
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // If token is invalid or expired, clear localStorage and redirect to login
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('userRole');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// ============================================
// AUTHENTICATION API FUNCTIONS
// ============================================

// Register a new user
export const register = async (userData) => {
    try {
        const response = await api.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
};

// Login user
export const login = async (credentials) => {
    try {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
};

// Get current user info
export const getCurrentUser = async () => {
    try {
        const response = await api.get('/auth/me');
        return response.data;
    } catch (error) {
        console.error('Error fetching current user:', error);
        throw error;
    }
};

// ============================================
// PATIENT API FUNCTIONS
// ============================================

// Add a new patient
export const addPatient = async (patientData) => {
    try {
        const response = await api.post('/patients', patientData);
        return response.data;
    } catch (error) {
        console.error('Error adding patient:', error);
        throw error;
    }
};

// Get all patients
export const getAllPatients = async () => {
    try {
        const response = await api.get('/patients');
        return response.data;
    } catch (error) {
        console.error('Error fetching patients:', error);
        throw error;
    }
};

// Get single patient by ID
export const getPatientById = async (patientId) => {
    try {
        const response = await api.get(`/patients/${patientId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching patient:', error);
        throw error;
    }
};

// ============================================
// PRESCRIPTION API FUNCTIONS
// ============================================

// Add a new prescription
export const addPrescription = async (prescriptionData) => {
    try {
        const response = await api.post('/prescriptions', prescriptionData);
        return response.data;
    } catch (error) {
        console.error('Error adding prescription:', error);
        throw error;
    }
};

// Get prescriptions for a patient
export const getPrescriptionsByPatient = async (patientId) => {
    try {
        const response = await api.get(`/prescriptions/${patientId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching prescriptions:', error);
        throw error;
    }
};

// ============================================
// LAB REPORT API FUNCTIONS
// ============================================

// Add a new lab report
export const addLabReport = async (labData) => {
    try {
        const response = await api.post('/labs', labData);
        return response.data;
    } catch (error) {
        console.error('Error adding lab report:', error);
        throw error;
    }
};

// Get lab reports for a patient
export const getLabReportsByPatient = async (patientId) => {
    try {
        const response = await api.get(`/labs/${patientId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching lab reports:', error);
        throw error;
    }
};

// ============================================
// BILL API FUNCTIONS
// ============================================

// Create a new bill
export const createBill = async (billData) => {
    try {
        const response = await api.post('/bills', billData);
        return response.data;
    } catch (error) {
        console.error('Error creating bill:', error);
        throw error;
    }
};

// Get bills for a patient
export const getBillsByPatient = async (patientId) => {
    try {
        const response = await api.get(`/bills/${patientId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching bills:', error);
        throw error;
    }
};

// ============================================
// PUBLIC API FUNCTIONS (No authentication required)
// ============================================

// Create a separate axios instance for public endpoints (no auth required)
const publicApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Public function to get patient by ID (for patient portal)
export const getPatientByIdPublic = async (patientId) => {
    try {
        const response = await publicApi.get(`/patients/${patientId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching patient:', error);
        throw error;
    }
};

// Public function to get prescriptions (for patient portal)
export const getPrescriptionsByPatientPublic = async (patientId) => {
    try {
        const response = await publicApi.get(`/prescriptions/${patientId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching prescriptions:', error);
        throw error;
    }
};

// Public function to get lab reports (for patient portal)
export const getLabReportsByPatientPublic = async (patientId) => {
    try {
        const response = await publicApi.get(`/labs/${patientId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching lab reports:', error);
        throw error;
    }
};

// Public function to get bills (for patient portal)
export const getBillsByPatientPublic = async (patientId) => {
    try {
        const response = await publicApi.get(`/bills/${patientId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching bills:', error);
        throw error;
    }
};

// Export the axios instance for custom requests if needed
export default api;
