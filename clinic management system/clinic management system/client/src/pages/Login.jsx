import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState('');

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        // Real-time email validation
        if (e.target.name === 'email') {
            if (e.target.value && !validateEmail(e.target.value)) {
                setEmailError('Please enter a valid email address');
            } else {
                setEmailError('');
            }
        }

        // Clear main error on input
        if (error) setError('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!validateEmail(formData.email)) {
            setEmailError('Invalid email format');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const response = await login({
                email: formData.email,
                password: formData.password
            });

            if (response.success) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
                localStorage.setItem('userRole', response.user.role);
                navigate('/dashboard');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="card w-full max-w-md shadow-2xl relative overflow-hidden animate-fade-in border-0">

                {/* Decorative background element */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

                <div className="text-center mb-10 mt-4">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-sm">
                        <span className="text-4xl">🏥</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2 tracking-tight">
                        Welcome Back
                    </h1>
                    <p className="text-gray-500">Sign in to your account</p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 flex items-start">
                        <span className="mr-2 mt-0.5">⚠️</span>
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`input-field ${emailError ? 'border-red-500 ring-4 ring-red-50' : ''}`}
                            required
                            placeholder="admin@example.com"
                        />
                        {emailError && <p className="text-xs text-red-500 mt-1 ml-1">{emailError}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="input-field"
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary w-full py-3.5 text-lg shadow-lg hover:shadow-xl mt-2"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                                Signing in...
                            </span>
                        ) : 'Sign In'}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                    <p className="text-sm text-gray-600 mb-4">Patient? Don't have an account?</p>
                    <Link
                        to="/register-patient"
                        className="inline-block w-full py-3 rounded-lg border border-blue-200 text-blue-700 font-medium hover:bg-blue-50 transition-colors"
                    >
                        Register as a New Patient
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
