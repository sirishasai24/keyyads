'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    AiOutlinePlus,
    AiOutlineEdit,
    AiOutlineDelete,
    AiOutlinePoweroff,
    AiOutlineSearch,
    AiOutlineLeft,
    AiOutlineRight,
    AiOutlineClose
} from 'react-icons/ai';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

// --- Interfaces for Data Models ---
interface Plan {
    _id: string;
    planTitle: "Quarterly Plan" | "Half Yearly Plan" | "Annual Plan";
    expiryDate: string;
    listings: number;
    premiumBadging: number;
    shows: number;
    pricePaid: string;
    transactionId: string;
}

interface User {
    _id: string;
    username: string;
    email: string;
    role: "User" | "Buyer" | "Seller" | "Agent" | "Admin" | "Support";
    plan: "Free" | "Quarterly Plan" | "Half Yearly Plan" | "Annual Plan";
    isVerified: boolean;
    isActive: boolean;
    createdAt: string;
    phone?: string;
    profileImageURL?: string;
    planDetails?: Plan;
}

const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
};

export default function AdminDashboard() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showBanModal, setShowBanModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const itemsPerPage = 10;
    const router = useRouter();

    // --- Data Fetching Logic with Pagination and Search ---
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `/api/admin/manage-users?page=${currentPage}&limit=${itemsPerPage}&search=${searchQuery}`
                );
                if (response.data && Array.isArray(response.data.users)) {
                    setUsers(response.data.users);
                    setTotalPages(response.data.totalPages);
                } else {
                    setError('Invalid data format from server.');
                }
            } catch (err) {
                console.error('Failed to fetch users:', err);
                setError('Failed to load users. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [currentPage, searchQuery]);

    // --- Helper Functions ---
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const handleEditClick = (userId: string) => {
        router.push(`/admin/manage-users/edit/${userId}`);
    };

    const handleAddUserClick = () => {
        router.push('/admin/manage-users/add');
    };

    // Modal Handlers
    const handleDeleteClick = (user: User) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    const handleBanClick = (user: User) => {
        setSelectedUser(user);
        setShowBanModal(true);
    };

    const confirmDeleteUser = async () => {
        if (!selectedUser) return;
        try {
            await axios.delete(`/api/admin/manage-users/${selectedUser._id}`);
            setUsers(users.filter(user => user._id !== selectedUser._id));
            toast.success('User deleted successfully!');
        } catch (err) {
            console.error('Failed to delete user:', err);
            toast.error('Failed to delete user. Please try again.');
        } finally {
            setShowDeleteModal(false);
            setSelectedUser(null);
        }
    };

    const confirmBanToggle = async () => {
        if (!selectedUser) return;
        try {
            const newStatus = !selectedUser.isActive;
            await axios.patch(`/api/admin/manage-users/${selectedUser._id}`, { isActive: newStatus });
            const updatedUsers = users.map(u =>
                u._id === selectedUser._id ? { ...u, isActive: newStatus } : u
            );
            setUsers(updatedUsers);
            toast.success(newStatus ? 'User reactivated.' : 'User deactivated.');
        } catch (err) {
            console.error('Failed to toggle user status:', err);
            toast.error('Failed to update user status. Please try again.');
        } finally {
            setShowBanModal(false);
            setSelectedUser(null);
        }
    };

    const handlePageChange = (page: number) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-3 py-1 rounded-md ${
                        i === currentPage
                            ? 'bg-[#2180d3] text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    {i}
                </button>
            );
        }
        return pageNumbers;
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-7xl mx-auto bg-white rounded-3xl shadow-xl p-8"
            >
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
                    <button
                        onClick={handleAddUserClick}
                        className="flex items-center gap-2 bg-[#2180d3] hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
                    >
                        <AiOutlinePlus className="text-lg" />
                        Add User
                    </button>
                </div>

                <div className="relative mb-6">
                    <input
                        type="text"
                        placeholder="Search by ID, username, or email..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>

                {loading && (
                    <div className="text-center py-12 text-gray-500">
                        <p>Loading users...</p>
                    </div>
                )}

                {error && (
                    <div className="text-center py-12 text-red-500">
                        <p>{error}</p>
                    </div>
                )}

                {!loading && !error && users.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <p>No users found.</p>
                    </div>
                )}

                {!loading && !error && users.length > 0 && (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    <AnimatePresence>
                                        {users.map(user => (
                                            <motion.tr
                                                key={user._id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.2 }}
                                                className={`${!user.isActive ? 'bg-red-50 text-gray-400' : ''}`}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <img className="h-10 w-10 rounded-full object-cover" src={user.profileImageURL || '/profile.png'} alt={`${user.username}'s profile`} />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">{user.username}</div>
                                                            <div className="text-sm text-gray-500">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-[#2180d3]">
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {user.isActive ? (
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                            Active
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                            Deactivated
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{user.plan}</div>
                                                    {user.planDetails && (
                                                        <div className="text-xs text-gray-500">Expires: {formatDate(user.planDetails.expiryDate)}</div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex items-center space-x-2">
                                                        <button onClick={() => handleEditClick(user._id)} title="Edit User" className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                                                            <AiOutlineEdit className="text-gray-600" />
                                                        </button>
                                                        <button onClick={() => handleDeleteClick(user)} title="Delete User" className="p-2 rounded-full hover:bg-red-100 transition-colors">
                                                            <AiOutlineDelete className="text-red-500" />
                                                        </button>
                                                        <button onClick={() => handleBanClick(user)} title={user.isActive ? "Deactivate User" : "Reactivate User"} className="p-2 rounded-full hover:bg-yellow-100 transition-colors">
                                                            <AiOutlinePoweroff className={user.isActive ? "text-yellow-500" : "text-green-500"} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Controls */}
                        <div className="flex justify-center items-center mt-8 space-x-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <AiOutlineLeft />
                            </button>
                            <div className="flex space-x-2">
                                {renderPageNumbers()}
                            </div>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <AiOutlineRight />
                            </button>
                        </div>
                    </>
                )}
            </motion.div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={modalVariants}
                        className="fixed inset-0  bg-opacity-50 flex items-center justify-center p-4 z-50"
                    >
                        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-800">Confirm Deletion</h3>
                                <button onClick={() => setShowDeleteModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <AiOutlineClose size={20} />
                                </button>
                            </div>
                            <p className="text-gray-600">
                                Are you sure you want to delete user "{selectedUser?.username}"? This action cannot be undone.
                            </p>
                            <div className="flex justify-end space-x-4 mt-6">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDeleteUser}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                                >
                                    Confirm Delete
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Ban/Deactivate Confirmation Modal */}
            <AnimatePresence>
                {showBanModal && selectedUser && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={modalVariants}
                        className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50"
                    >
                        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-800">
                                    {selectedUser.isActive ? 'Deactivate User' : 'Reactivate User'}
                                </h3>
                                <button onClick={() => setShowBanModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <AiOutlineClose size={20} />
                                </button>
                            </div>
                            <p className="text-gray-600">
                                Are you sure you want to {selectedUser.isActive ? 'deactivate' : 'reactivate'} user "{selectedUser.username}"?
                            </p>
                            <div className="flex justify-end space-x-4 mt-6">
                                <button
                                    onClick={() => setShowBanModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmBanToggle}
                                    className={`px-4 py-2 text-white font-semibold rounded-lg transition-colors ${
                                        selectedUser.isActive ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-600 hover:bg-green-700'
                                    }`}
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}