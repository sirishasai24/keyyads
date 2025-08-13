"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Property } from "@/types/property"; // Adjust path as needed
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import toast from "react-hot-toast";
import ConfirmationModal from "@/components/ConfirmationalModal";
import AdminNav from "@/components/AdminNav"; // <-- IMPORT ADDED
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

export default function ManagePropertiesPage() {
    const [allProperties, setAllProperties] = useState<Property[]>([]);
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>("All");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 12;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);

    const fetchAllProperties = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const propertiesResponse = await axios.get("/api/admin/manage-properties");
            setAllProperties(propertiesResponse.data.properties);
        } catch (err) {
            console.error("Error fetching data:", err);
            if (axios.isAxiosError(err) && err.response?.data?.error) {
                setError(err.response.data.error);
                toast.error(err.response.data.error);
            } else {
                setError("Failed to fetch data. Please try again.");
                toast.error("Failed to fetch data. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllProperties();
    }, [fetchAllProperties]);

    useEffect(() => {
        const filtered = allProperties.filter((property) => {
            const matchesStatus =
                filterStatus === "All" ||
                (property.transactionType === "sale" && filterStatus === "For Sale") ||
                (property.transactionType === "rent" && filterStatus === "For Rent");

            const lowerCaseSearchQuery = searchQuery.toLowerCase();
            const matchesSearch =
                property.title.toLowerCase().includes(lowerCaseSearchQuery) ||
                property.address.toLowerCase().includes(lowerCaseSearchQuery) ||
                property.location.city.toLowerCase().includes(lowerCaseSearchQuery) ||
                property._id.toLowerCase().includes(lowerCaseSearchQuery) ||
                (property.description && property.description.toLowerCase().includes(lowerCaseSearchQuery));

            return matchesStatus && matchesSearch;
        });

        const newTotalPages = Math.ceil(filtered.length / itemsPerPage);
        setTotalPages(newTotalPages);

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setProperties(filtered.slice(startIndex, endIndex));

    }, [allProperties, currentPage, searchQuery, filterStatus]);

    const confirmDelete = (property: Property) => {
        setPropertyToDelete(property);
        setIsModalOpen(true);
    };

    const executeDelete = async () => {
        if (!propertyToDelete) return;

        setIsModalOpen(false);
        try {
            await axios.delete(`/api/admin/manage-properties/edit/${propertyToDelete._id}`);
            toast.success("Property deleted successfully!");
            setAllProperties((prev) => prev.filter((p) => p._id !== propertyToDelete._id));
            setPropertyToDelete(null);
        } catch (err) {
            console.error("Error deleting property:", err);
            if (axios.isAxiosError(err) && err.response?.data?.error) {
                toast.error(err.response.data.error);
            } else {
                toast.error("Failed to delete property. Please try again.");
            }
        }
    };

    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

    const handlePageChange = (page: number) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, currentPage + 2);

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-4 py-2 rounded-md transition-colors ${
                        i === currentPage
                            ? 'bg-[#2180d3] text-white font-semibold'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    {i}
                </button>
            );
        }
        return pageNumbers;
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilterStatus(e.target.value);
        setCurrentPage(1);
    };

    // --- UPDATED LOADING AND ERROR STATES ---
    if (loading) {
        return (
            <div className="flex h-screen bg-gray-100">
                <AdminNav />
                <main className="flex-1 flex justify-center items-center">
                    <div className="flex items-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#2180d3]"></div>
                        <p className="ml-4 text-lg text-gray-700">Loading properties...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen bg-gray-100">
                <AdminNav />
                <main className="flex-1 flex flex-col justify-center items-center">
                    <div className="text-center text-red-600">
                        <p className="text-xl font-semibold mb-4">Error: {error}</p>
                        <button
                            onClick={fetchAllProperties}
                            className="px-6 py-3 bg-[#2180d3] text-white rounded-lg hover:bg-[#1a6fb0] transition-colors shadow-md"
                        >
                            Retry
                        </button>
                    </div>
                </main>
            </div>
        );
    }
    
    // --- UPDATED MAIN RETURN WITH LAYOUT ---
    return (
        <div className="flex h-screen bg-gray-100">
            <AdminNav />
            <main className="flex-1 overflow-y-auto">
                <div className="container mx-auto p-6">
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 text-center">
                        Property Listings
                    </h1>
                    <p className="text-lg text-gray-600 mb-10 text-center max-w-2xl mx-auto">
                        Effortlessly manage all posted properties. View, edit, or remove listings with ease.
                    </p>

                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0 md:space-x-6">
                        <Link href="/property/add" className="w-full md:w-auto">
                            <button className="w-full md:w-auto bg-[#2180d3] hover:bg-[#1a6fb0] text-white font-semibold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center text-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                                Add New Property
                            </button>
                        </Link>

                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
                            <input
                                type="text"
                                placeholder="Search listings..."
                                className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-[#2180d3] focus:border-[#2180d3] w-full sm:w-80 transition-all duration-200"
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                            <select
                                className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-[#2180d3] focus:border-[#2180d3] w-full sm:w-48 transition-all duration-200 bg-white"
                                value={filterStatus}
                                onChange={handleFilterChange}
                            >
                                <option value="All">All Statuses</option>
                                <option value="For Sale">For Sale</option>
                                <option value="For Rent">For Rent</option>
                            </select>
                        </div>
                    </div>

                    {properties.length === 0 && !loading && !error && (
                        <div className="text-center py-20 bg-white rounded-xl shadow-md border border-gray-100">
                            <p className="text-2xl font-semibold text-gray-700 mb-4">
                                No properties found.
                            </p>
                            <p className="text-lg text-gray-500 mb-6">
                                It looks like there are no properties matching your search or filters.
                            </p>
                            <Link href="/property/add">
                                <button className="mt-6 px-8 py-3 bg-[#2180d3] text-white font-semibold rounded-full hover:bg-[#1a6fb0] transition duration-300 shadow-md">
                                    Start Listing Your Property Now!
                                </button>
                            </Link>
                        </div>
                    )}

                    {properties.length > 0 && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {properties.map((property) => (
                                    <div
                                        key={property._id}
                                        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col group"
                                    >
                                        {property.images && property.images.length > 0 ? (
                                            <div className="relative w-full h-48 sm:h-56 bg-gray-100 overflow-hidden">
                                                <Image
                                                    src={property.images[0]}
                                                    alt={property.title}
                                                    layout="fill"
                                                    objectFit="cover"
                                                    className="rounded-t-2xl transform group-hover:scale-105 transition-transform duration-300"
                                                />
                                                {property.isPremium && (
                                                    <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">
                                                        PREMIUM
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="relative w-full h-48 sm:h-56 bg-gray-100 flex items-center justify-center text-gray-400 rounded-t-2xl text-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                No Image
                                                {property.isPremium && (
                                                    <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">
                                                        PREMIUM
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <div className="p-5 flex-grow flex flex-col">
                                            <h2 className="text-2xl font-bold text-gray-800 mb-2 truncate leading-tight">
                                                {property.title}
                                            </h2>
                                            <p className="text-gray-600 mb-3 flex items-center text-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                </svg>
                                                {property.address}, {property.location.city}, {property.location.state}
                                            </p>
                                            <p className="text-gray-900 text-2xl font-extrabold mb-4">
                                                {new Intl.NumberFormat("en-IN", {
                                                    style: "currency",
                                                    currency: "INR",
                                                }).format(property.price)}{" "}
                                                <span className="text-base font-normal text-gray-500">
                                                    {property.transactionType === "rent" ? "/month" : ""}
                                                </span>
                                            </p>

                                            <div className="grid grid-cols-2 gap-y-2 text-gray-700 text-sm mb-4">
                                                <p>
                                                    <span className="font-medium text-gray-800">Type:</span>{" "}
                                                    {capitalize(property.type)}
                                                </p>
                                                <p>
                                                    <span className="font-medium text-gray-800">Status:</span>{" "}
                                                    <span className={`font-semibold ${property.transactionType === "sale" ? "text-[#2180d3]" : "text-blue-700"}`}>
                                                        For {capitalize(property.transactionType)}
                                                    </span>
                                                </p>
                                                {property.bedrooms && ( <p><span className="font-medium text-gray-800">Beds:</span> {property.bedrooms}</p> )}
                                                {property.bathrooms && ( <p><span className="font-medium text-gray-800">Baths:</span> {property.bathrooms}</p> )}
                                                <p><span className="font-medium text-gray-800">Area:</span> {property.area} {property.areaUnit}</p>
                                                <p><span className="font-medium text-gray-800">Posted:</span> {format(new Date(property.createdAt), "MMM d, yyyy")}</p>
                                            </div>

                                            <div className="mt-auto flex space-x-3 pt-4 border-t border-gray-100">
                                                <Link href={`/property/${property._id}`} target="_blank" className="flex-1">
                                                    <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium flex items-center justify-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg> View
                                                    </button>
                                                </Link>
                                                <Link href={`/admin/manage-properties/edit/${property._id}`} className="flex-1">
                                                    <button className="w-full px-4 py-2 bg-[#2180d3] text-white rounded-md hover:bg-[#1a6fb0] transition-colors text-sm font-medium flex items-center justify-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg> Edit
                                                    </button>
                                                </Link>
                                                <button
                                                    onClick={() => confirmDelete(property)}
                                                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm font-medium flex items-center justify-center"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg> Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className="flex justify-center items-center mt-8 space-x-2">
                                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
                                        <AiOutlineLeft />
                                    </button>
                                    <div className="flex space-x-2">{renderPageNumbers()}</div>
                                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
                                        <AiOutlineRight />
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                    <ConfirmationModal
                        isOpen={isModalOpen}
                        onConfirm={executeDelete}
                        onCancel={() => {
                            setIsModalOpen(false);
                            setPropertyToDelete(null);
                        }}
                        title={propertyToDelete?.title || ""}
                    />
                </div>
            </main>
        </div>
    );
}