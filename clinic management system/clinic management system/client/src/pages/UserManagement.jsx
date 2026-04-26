// Import React and hooks
import React, { useState, useEffect } from 'react';
// Import useNavigate for navigation
import { useNavigate } from 'react-router-dom';
// Import Navbar
import Navbar from '../components/Navbar';
// Import API functions
import api from '../services/api';

// UserManagement component - Admin only page to manage users
const UserManagement = () => {
    const navigate = useNavigate();

    // Check if user is admin
    const userRole = localStorage.getItem('userRole');

    useEffect(() => {
        if (userRole !== 'Admin') {
            alert('Access denied. Admin only.');
            navigate('/dashboard');
        }
    }, [userRole, navigate]);

    // State for users list
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // State for add user form
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'Doctor'
    });

    // Fetch all users
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/users');
            if (response.data.success) {
                setUsers(response.data.users);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            alert('Error fetching users');
        } finally {
            setLoading(false);
        }
    };

    // Load users on component mount
    useEffect(() => {
        fetchUsers();
    }, []);

    // Handle input change
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Handle add user
    const handleAddUser = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post('/users', formData);

            if (response.data.success) {
                alert('✓ User added successfully!');
                setShowForm(false);
                setFormData({
                    username: '',
                    email: '',
                    password: '',
                    role: 'Doctor'
                });
                fetchUsers(); // Refresh list
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error adding user';
            alert(errorMessage);
        }
    };

    // Handle delete user
    const handleDeleteUser = async (userId, username) => {
        if (window.confirm(`Are you sure you want to delete user "${username}"?`)) {
            try {
                const response = await api.delete(`/users/${userId}`);

                if (response.data.success) {
                    alert('✓ User deleted successfully!');
                    fetchUsers(); // Refresh list
                }
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Error deleting user';
                alert(errorMessage);
            }
        }
    };

    // Get role badge color
    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'Admin':
                return 'bg-purple-100 text-purple-800 border-purple-300';
            case 'Doctor':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'Receptionist':
                return 'bg-green-100 text-green-800 border-green-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
                    <p className="text-gray-600">Manage doctors and receptionists</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                        <h3 className="text-lg font-semibold mb-2">Total Users</h3>
                        <p className="text-4xl font-bold">{users.length}</p>
                        <p className="text-sm opacity-90">System users</p>
                    </div>
                    <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        <h3 className="text-lg font-semibold mb-2">Doctors</h3>
                        <p className="text-4xl font-bold">{users.filter(u => u.role === 'Doctor').length}</p>
                        <p className="text-sm opacity-90">Active doctors</p>
                    </div>
                    <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
                        <h3 className="text-lg font-semibold mb-2">Receptionists</h3>
                        <p className="text-4xl font-bold">{users.filter(u => u.role === 'Receptionist').length}</p>
                        <p className="text-sm opacity-90">Active receptionists</p>
                    </div>
                </div>

                {/* Add User Button */}
                <div className="mb-6">
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="btn-primary"
                    >
                        {showForm ? '✕ Cancel' : '+ Add New User'}
                    </button>
                </div>

                {/* Add User Form */}
                {showForm && (
                    <div className="card mb-8 border-2 border-blue-200">
                        <h2 className="text-xl font-semibold mb-6 flex items-center">
                            <span className="text-2xl mr-2">👤</span>
                            Add New User
                        </h2>
                        <form onSubmit={handleAddUser}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Username */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Username <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="Enter username"
                                        required
                                        minLength="3"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="user@clinic.com"
                                        required
                                    />
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Password <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="Minimum 6 characters"
                                        required
                                        minLength="6"
                                    />
                                </div>

                                {/* Role */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Role <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="input-field"
                                        required
                                    >
                                        <option value="Doctor">Doctor</option>
                                        <option value="Receptionist">Receptionist</option>
                                    </select>
                                </div>
                            </div>

                            <button type="submit" className="btn-primary mt-6 text-lg py-3">
                                ✓ Create User Account
                            </button>
                        </form>
                    </div>
                )}

                {/* Users List */}
                <div className="card">
                    <h2 className="text-xl font-semibold mb-6 flex items-center justify-between">
                        <span className="flex items-center">
                            <span className="text-2xl mr-2">👥</span>
                            All Users
                        </span>
                        <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
                            {users.length} Total
                        </span>
                    </h2>

                    {loading ? (
                        <p className="text-gray-600 text-center py-8">Loading users...</p>
                    ) : users.length === 0 ? (
                        <p className="text-gray-600 text-center py-8">No users found</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {users.map((user) => (
                                <div
                                    key={user._id}
                                    className="border-2 border-gray-200 rounded-lg p-5 hover:shadow-lg transition-all bg-white"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg text-gray-800">{user.username}</h3>
                                            <p className="text-sm text-gray-600">{user.email}</p>
                                        </div>
                                        <div className="text-3xl">
                                            {user.role === 'Admin' ? '👑' : user.role === 'Doctor' ? '👨‍⚕️' : '👔'}
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getRoleBadgeColor(user.role)}`}>
                                            {user.role}
                                        </span>
                                    </div>

                                    <div className="text-xs text-gray-500 mb-4">
                                        Created: {new Date(user.createdAt).toLocaleDateString()}
                                    </div>

                                    {user.role !== 'Admin' && (
                                        <button
                                            onClick={() => handleDeleteUser(user._id, user.username)}
                                            className="w-full text-sm bg-red-50 text-red-600 px-4 py-2 rounded hover:bg-red-100 border border-red-200 transition-colors"
                                        >
                                            🗑️ Delete User
                                        </button>
                                    )}
                                    {user.role === 'Admin' && (
                                        <div className="w-full text-sm bg-purple-50 text-purple-600 px-4 py-2 rounded text-center border border-purple-200">
                                            🔒 Protected
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info Box */}
                <div className="mt-8 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
                    <p className="text-sm text-blue-800">
                        <strong>Admin Tip:</strong> Create doctor and receptionist accounts here. They will receive their credentials to login and perform their respective tasks.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
