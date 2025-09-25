'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Carousel } from './slider';
import { LocationIcon } from './emojis'; // Assuming LocationIcon is custom or from a library
import axios from 'axios';
import Link from 'next/link';

interface PropertyListing {
    _id: string;
    title: string;
    price: number;
    location: {
        state: string;
        city: string;
    };
    images: string[];
    type: string;
    transactionType: string;
    isPremium: boolean;
    propertyAge?: string;
    furnishing?: string;
    landCategory?: string;
    bedrooms?: string;
    bathrooms?: string;
    createdAt: string;
    username: string;
    area: number;
    areaUnit: string;
}

const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring" as const,
            stiffness: 100,
        },
    },
};

export const FeaturedListings = () => {
    const [premiumListings, setPremiumListings] = useState<PropertyListing[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAd, setShowAd] = useState(true);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get<{ listings: PropertyListing[] }>('/api/property/featured');

                const shuffledListings = response.data.listings.sort(() => 0.5 - Math.random());
                setPremiumListings(shuffledListings.slice(0, 9));

            } catch (err) {
                console.error("Failed to fetch premium listings:", err);
                if (axios.isAxiosError(err) && err.response) {
                    setError(err.response.data.message || `Error: ${err.response.status} - Failed to fetch listings.`);
                } else {
                    setError("Failed to load listings. Please try again later.");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchProperties();
    }, []);

    const formatPriceForDisplay = (price: number): string => {
        if (price >= 10000000) {
            return `${(price / 10000000).toFixed(2)} Cr`;
        }
        if (price >= 100000) {
            return `${(price / 100000).toFixed(2)} Lacs`;
        }
        return `₹ ${price}`;
    };

    const getPropertyTypeDisplay = (listing: PropertyListing): string => {
        let typeString = "";
        if (listing.bedrooms) {
            typeString += `${listing.bedrooms} BHK `;
        }
        if (listing.type === 'building') {
            typeString += 'Apartment';
        } else if (listing.type === 'land') {
            typeString += 'Plot';
        }
        return typeString.trim();
    };

    if (loading) {
        return (
            <section className="py-12 text-center">
                <p className="text-xl text-gray-700">Loading premium listings...</p>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-12 text-center">
                <p className="text-xl text-red-600">{error}</p>
            </section>
        );
    }

    if (premiumListings.length === 0) {
        return (
            <section className="py-12 text-center">
                <p className="text-xl text-gray-700">No premium listings available at the moment.</p>
            </section>
        );
    }

    return (
        <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="py-12 relative"
        >
            <motion.h2
                variants={itemVariants}
                className="text-3xl font-bold text-left text-gray-800 mb-10 ml-8 md:ml-20 lg:ml-40 "
            >
                Premium Listings
            </motion.h2>

            {showAd && (
                <div className="fixed right-6 bottom-24 z-40 max-w-[150px] w-[150px] rounded-xl shadow-xl bg-white border border-gray-200">
                    <div className="relative">
                        <button
                            className="absolute top-1 right-1 text-white bg-black bg-opacity-50 rounded-full w-6 h-6 flex items-center justify-center hover:bg-opacity-80"
                            onClick={() => setShowAd(false)}
                        >
                            ✕
                        </button>
                        <a href="https://www.youtube.com/watch?v=U9DnQ8kfwGI" target="_blank" rel="noopener noreferrer">
                            <img
                                src="/banners/ad.jpg"
                                alt="Advertisement"
                                className="rounded-xl w-full h-auto"
                            />
                        </a>
                    </div>
                </div>
            )}

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Carousel cardWidthClass="w-full p-2" snapAlign="snap-center" interval={6000} showControls={true}>
                    {premiumListings.map((listing) => (
                        <motion.div
                            key={listing._id}
                            variants={itemVariants}
                            className="flex-shrink-0 w-full"
                        >
                            <div className="relative flex flex-col md:flex-row rounded-3xl overflow-hidden transition-all duration-300 transform hover:scale-[1.01] cursor-pointer
                                         bg-gradient-to-br from-[#5A4BF7] via-[#745BF9] to-[#874BF7] text-white
                                         sparkle-background">

                                {/* Image Section - Left Half (Adjusted) */}
                                <div className="w-full md:w-1/2 flex items-center justify-center p-4 rounded-tl-3xl md:rounded-bl-3xl md:rounded-tr-none rounded-tr-3xl"> {/* Added bg-gray-100 and p-4 */}
                                    <Link href={`/property/${listing._id}`} passHref className="block w-3/4 h-auto max-h-full"> {/* Smaller width, block display, and max-height */}
                                        <img
                                            src={listing.images[0] || '/placeholder-image.jpg'}
                                            alt={listing.title}
                                            className="w-full h-full object-contain rounded-2xl shadow-lg" // object-contain to fit, rounded-2xl
                                        />
                                        {listing.isPremium && (
                                            <span className="absolute top-8 left-8 bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 text-sm font-semibold px-4 py-2 rounded-full shadow-lg z-10">
                                                Premium
                                            </span>
                                        )}
                                    </Link>
                                </div>

                                {/* Content Section - Right Half */}
                                <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-between h-72 md:h-[400px]">
                                    {/* Builder Info */}
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="text-sm">
                                            <p className="font-semibold text-white tracking-wide">
                                                {listing.username}
                                            </p>
                                            <Link href={`/builder/${listing.username}`} passHref className="text-white text-opacity-70 text-xs mt-0.5 hover:underline">
                                                View property
                                            </Link>
                                        </div>
                                        {/* <div className="w-11 h-11 bg-white bg-opacity-20 rounded-full flex items-center justify-center border border-white border-opacity-30">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div> */}
                                    </div>

                                    {/* Main Property Details */}
                                    <Link href={`/property/${listing._id}`} passHref className="flex-grow min-h-0 overflow-hidden block">
                                        <h3 className="text-4xl font-extrabold text-white mb-2 leading-tight tracking-tight line-clamp-2">
                                            {listing.title}
                                        </h3>
                                        <p className="text-white text-opacity-80 text-lg mb-3 flex items-center gap-2">
                                            <LocationIcon className="w-5 h-5 text-white" /> {listing.location.city}, {listing.location.state}
                                        </p>
                                        <p className="text-white text-opacity-95 font-bold text-3xl mb-3">
                                            {formatPriceForDisplay(listing.price)}
                                        </p>
                                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-white text-opacity-80 text-base">
                                            {listing.bedrooms && (
                                                <span className="flex items-center gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M2 4v7h20V4c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2zM2 15v3c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-3H2zM12 11V7" />
                                                    </svg>
                                                    {listing.bedrooms} Beds
                                                </span>
                                            )}
                                            {listing.bathrooms && (
                                                <span className="flex items-center gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M11 20H5c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v2M18 8v12M15 15h6M3 6l3.5 3.5M6.5 6l-3.5 3.5" />
                                                        <circle cx="16" cy="18" r="2" />
                                                    </svg>
                                                    {listing.bathrooms} Baths
                                                </span>
                                            )}
                                            {listing.area && listing.areaUnit && (
                                                <span className="flex items-center gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                                        <line x1="12" y1="3" x2="12" y2="21" />
                                                        <line x1="3" y1="12" x2="21" y2="12" />
                                                    </svg>
                                                    {listing.area} {listing.areaUnit}
                                                </span>
                                            )}
                                            {listing.furnishing && (
                                                <span className="flex items-center gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M17 12H7c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-2c0-1.1-.9-2-2-2zM12 12V7M9 7h6M7 12H5c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-2c0-1.1-.9-2-2-2h-2" />
                                                    </svg>
                                                    {listing.furnishing}
                                                </span>
                                            )}
                                        </div>
                                    </Link>

                                    {/* Contact Button now has its own Link */}
                                    <Link href="/contact" passHref>
                                        <button className="mt-6 w-full bg-white bg-opacity-25 hover:bg-opacity-40 text-[#5A4BF7] py-4 rounded-xl font-semibold transition duration-300 ease-in-out shadow-lg text-lg">
                                            Contact Now
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </Carousel>
            </div>

            <motion.div
                variants={itemVariants}
                className="text-center mt-12"
            >
                <Link href="/property" passHref>
                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-4 rounded-full font-semibold shadow-md transition-transform duration-200 transform hover:scale-105">
                        Browse All Listings
                    </button>
                </Link>
            </motion.div>
        </motion.section>
    );
};