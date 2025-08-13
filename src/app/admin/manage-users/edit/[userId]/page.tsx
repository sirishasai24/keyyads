'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import AdminNav from '@/components/AdminNav'; // <-- IMPORT ADDED

// --- Interfaces for Data Models ---
interface User {
    _id: string;
    username: string;
    email: string;
    role: "User" | "Buyer" | "Seller" | "Agent" | "Admin" | "Support";
    plan: "Free" | "Quarterly Plan" | "Half Yearly Plan" | "Annual Plan";
    isVerified: boolean;
    isActive: boolean;
    phone?: string;
    listings: number;
    premiumBadging: number;
    shows: number;
}

// --- Role and Plan Options for UI selectors ---
const roleOptions = ["User", "Buyer", "Seller", "Agent", "Admin", "Support"];
const planOptions = ["Free", "Quarterly Plan", "Half Yearly Plan", "Annual Plan"];

export default function EditUserPage() {
    const router = useRouter();
    const { userId } = useParams() as { userId: string };

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch user data on component mount
    useEffect(() => {
        const fetchUser = async () => {
            if (!userId) return;
            try {
                const response = await axios.get(`/api/admin/manage-users/edit/${userId}`);
                setUser(response.data.user);
            } catch (err) {
                console.error('Failed to fetch user data:', err);
                setError('Failed to load user data.');
                toast.error('Failed to load user data.');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        if (user) {
            let newValue: string | number | boolean = value;

            if (type === 'checkbox') {
                newValue = (e.target as HTMLInputElement).checked;
            } else if (type === 'number') {
                newValue = parseInt(value, 10) || 0;
            }

            setUser({ ...user, [name]: newValue });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setSubmitting(true);
        try {
            await axios.put(`/api/admin/manage-users/edit/${userId}`, user);
            toast.success('User updated successfully!');
            router.push('/admin/manage-users');
        } catch (err) {
            console.error('Failed to update user:', err);
            toast.error('Failed to update user. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen bg-gray-100">
                <AdminNav />
                <main className="flex-1 flex justify-center items-center">
                    <p>Loading user details...</p>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen bg-gray-100">
                <AdminNav />
                <main className="flex-1 flex justify-center items-center">
                    <p className="text-red-500">{error}</p>
                </main>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex h-screen bg-gray-100">
                <AdminNav />
                <main className="flex-1 flex justify-center items-center">
                    <p>User not found.</p>
                </main>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <AdminNav />
            <main className="flex-1 p-8 overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl p-8"
                >
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit User: {user.username}</h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={user.username}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={user.email}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={user.phone || ''}
                                onChange={handleChange}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                            <select
                                id="role"
                                name="role"
                                value={user.role}
                                onChange={handleChange}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                {roleOptions.map(role => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="plan" className="block text-sm font-medium text-gray-700">Plan</label>
                            <select
                                id="plan"
                                name="plan"
                                value={user.plan}
                                onChange={handleChange}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                {planOptions.map(plan => (
                                    <option key={plan} value={plan}>{plan}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="isVerified"
                                    name="isVerified"
                                    checked={user.isVerified}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="isVerified" className="text-sm font-medium text-gray-700">Is Verified?</label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    name="isActive"
                                    checked={user.isActive}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Is Active?</label>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label htmlFor="listings" className="block text-sm font-medium text-gray-700">Listings</label>
                                <input
                                    type="number"
                                    id="listings"
                                    name="listings"
                                    value={user.listings}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="premiumBadging" className="block text-sm font-medium text-gray-700">Premium Badging</label>
                                <input
                                    type="number"
                                    id="premiumBadging"
                                    name="premiumBadging"
                                    value={user.premiumBadging}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="shows" className="block text-sm font-medium text-gray-700">Shows</label>
                                <input
                                    type="number"
                                    id="shows"
                                    name="shows"
                                    value={user.shows}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                        
                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => router.push('/admin/manage-users')}
                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-6 py-2 bg-[#2180d3] hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </main>
        </div>
    );
}