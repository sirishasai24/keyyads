"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Property } from "@/types/property"; // Adjust path as needed
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { AiOutlineLeft, AiOutlineRight, AiOutlineCheckCircle, AiOutlineClose } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import AdminNav from "@/components/AdminNav";

const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
};

export default function AdminPropertyApprovalPage() {
    const [allUnapprovedProperties, setAllUnapprovedProperties] = useState<Property[]>([]);
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 12;

    // State for the custom confirmation modal
    const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
    const [propertyToApprove, setPropertyToApprove] = useState<Property | null>(null);

    const fetchAllUnapprovedProperties = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get("/api/admin/manage-properties/unapproved");
            setAllUnapprovedProperties(response.data.properties);
        } catch (err) {
            console.error("Error fetching unapproved properties:", err);
            if (axios.isAxiosError(err) && err.response?.data?.error) {
                setError(err.response.data.error);
                toast.error(err.response.data.error);
            } else {
                setError("Failed to fetch unapproved properties. Please try again.");
                toast.error("Failed to fetch unapproved properties.");
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllUnapprovedProperties();
    }, [fetchAllUnapprovedProperties]);

    useEffect(() => {
        const filtered = allUnapprovedProperties.filter((property) => {
            const lowerCaseSearchQuery = searchQuery.toLowerCase();
            const matchesSearch =
                property.title.toLowerCase().includes(lowerCaseSearchQuery) ||
                property.address.toLowerCase().includes(lowerCaseSearchQuery) ||
                property.location.city.toLowerCase().includes(lowerCaseSearchQuery) ||
                property._id.toLowerCase().includes(lowerCaseSearchQuery) ||
                (property.description && property.description.toLowerCase().includes(lowerCaseSearchQuery));
            return matchesSearch;
        });

        const newTotalPages = Math.ceil(filtered.length / itemsPerPage);
        setTotalPages(newTotalPages);

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setProperties(filtered.slice(startIndex, endIndex));
    }, [allUnapprovedProperties, currentPage, searchQuery]);

    // Function to open the confirmation modal
    const confirmApproval = (property: Property) => {
        setPropertyToApprove(property);
        setIsApprovalModalOpen(true);
    };

    // Function to handle the actual approval after confirmation
    const executeApproval = async () => {
        if (!propertyToApprove) return;

        setIsApprovalModalOpen(false);
        try {
            await axios.patch(`/api/admin/manage-properties/unapproved/${propertyToApprove._id}`);
            toast.success("Property approved successfully!");

            // Optimistically remove the approved property from the state
            setAllUnapprovedProperties((prev) => prev.filter((p) => p._id !== propertyToApprove._id));
            setPropertyToApprove(null);
        } catch (err) {
            console.error("Error approving property:", err);
            if (axios.isAxiosError(err) && err.response?.data?.error) {
                toast.error(err.response.data.error);
            } else {
                toast.error("Failed to approve property. Please try again.");
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
        setCurrentPage(1); // Reset to page 1 on new search
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-80px)] bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#2180d3]"></div>
                <p className="ml-4 text-lg text-gray-700">Loading unapproved properties...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-gray-50 text-red-600">
                <p className="text-xl font-semibold mb-4">Error: {error}</p>
                <button
                    onClick={fetchAllUnapprovedProperties}
                    className="px-6 py-3 bg-[#2180d3] text-white rounded-lg hover:bg-[#1a6fb0] transition-colors shadow-md"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-100">
                    <AdminNav />
        <div className="container mx-auto p-6 min-h-[calc(100vh-80px)] bg-gray-50">
            <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 text-center">
                Property Approval Queue
            </h1>
            <p className="text-lg text-gray-600 mb-10 text-center max-w-2xl mx-auto">
                Review and approve new property listings to make them visible on the platform.
            </p>

            <div className="flex justify-center mb-8">
                <input
                    type="text"
                    placeholder="Search unapproved listings..."
                    className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-[#2180d3] focus:border-[#2180d3] w-full max-w-md transition-all duration-200"
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </div>

            {properties.length === 0 && !loading && !error && (
                <div className="text-center py-20 bg-white rounded-xl shadow-md border border-gray-100">
                    <p className="text-2xl font-semibold text-gray-700 mb-4">
                        No unapproved properties found.
                    </p>
                    <p className="text-lg text-gray-500">
                        All properties are currently approved, or there are no new listings.
                    </p>
                </div>
            )}

            {properties.length > 0 && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {properties.map((property) => (
                            <motion.div
                                key={property._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
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
                                        <div className="absolute top-2 right-2 bg-gray-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">
                                            PENDING APPROVAL
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative w-full h-48 sm:h-56 bg-gray-100 flex items-center justify-center text-gray-400 rounded-t-2xl text-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        No Image
                                        <div className="absolute top-2 right-2 bg-gray-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">
                                            PENDING APPROVAL
                                        </div>
                                    </div>
                                )}

                                <div className="p-5 flex-grow flex flex-col">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2 truncate leading-tight">
                                        {property.title}
                                    </h2>
                                    <p className="text-gray-600 mb-3 flex items-center text-sm">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 mr-2 text-gray-500"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                                clipRule="evenodd"
                                            />
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
                                        {property.bedrooms && (
                                            <p>
                                                <span className="font-medium text-gray-800">Beds:</span>{" "}
                                                {property.bedrooms}
                                            </p>
                                        )}
                                        {property.bathrooms && (
                                            <p>
                                                <span className="font-medium text-gray-800">Baths:</span>{" "}
                                                {property.bathrooms}
                                            </p>
                                        )}
                                        <p>
                                            <span className="font-medium text-gray-800">Area:</span>{" "}
                                            {property.area} {property.areaUnit}
                                        </p>
                                        <p>
                                            <span className="font-medium text-gray-800">Posted:</span>{" "}
                                            {format(new Date(property.createdAt), "MMM d, yyyy")}
                                        </p>
                                    </div>

                                    <div className="mt-auto flex space-x-3 pt-4 border-t border-gray-100">
                                        <Link href={`/property/${property._id}`} target="_blank" className="flex-1">
                                            <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                                View
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => confirmApproval(property)}
                                            className="flex-1 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm font-medium flex items-center justify-center"
                                        >
                                            <AiOutlineCheckCircle className="h-4 w-4 mr-1" />
                                            Approve
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {totalPages > 1 && (
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
                    )}
                </>
            )}

            <AnimatePresence>
                {isApprovalModalOpen && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={modalVariants}
                        className="fixed inset-0  bg-opacity-50 flex items-center justify-center p-4 z-50"
                    >
                        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-800">Confirm Approval</h3>
                                <button
                                    onClick={() => setIsApprovalModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <AiOutlineClose size={20} />
                                </button>
                            </div>
                            <p className="text-gray-600">
                                Are you sure you want to approve this property?
                            </p>
                            <div className="flex justify-end space-x-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsApprovalModalOpen(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={executeApproval}
                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
        </div>
    );
}