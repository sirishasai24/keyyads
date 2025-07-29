'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Carousel } from './slider';
import { LocationIcon } from './emojis';
import axios from 'axios';
import Link from 'next/link'; // Import Link for navigation

// Define the interface based on your Mongoose Property model
interface PropertyListing {
    _id: string; // Mongoose _id
    title: string;
    price: number; // Price is a number in your model
    location: {
        state: string;
        city: string;
    };
    images: string[]; // Array of image URLs
    type: string; // 'land' or 'building'
    transactionType: string; // 'sale' or 'rent'
    isPremium: boolean;

    propertyAge?: string; // Optional, as it's an enum in your model
    furnishing?: string; // Optional
    landCategory?: string;
    bedrooms?: string;
    bathrooms?: string;
    createdAt: string;
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
    const [featuredListings, setFeaturedListings] = useState<PropertyListing[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                setLoading(true);
                setError(null);

                // Assuming your API endpoint for featured listings is /api/property/featured
                const response = await axios.get<{ listings: PropertyListing[] }>('/api/property/featured');


                setFeaturedListings(response.data.listings);
            } catch (err) {
                console.error("Failed to fetch featured listings:", err);
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

    const formatPrice = (price: number, transactionType: string): string => {
        if (transactionType === 'rent') {
            if (price >= 10000000) { // Check for Crores (1 Crore = 10 million)
                return `₹ ${(price / 10000000).toFixed(1)} Cr/month`;
            } else if (price >= 100000) { // Check for Lacs (1 Lac = 100,000)
                return `₹ ${(price / 100000).toFixed(1)} Lacs/month`;
            } else if (price >= 1000) {
                return `₹ ${(price / 1000).toFixed(1)}K/month`;
            }
            return `₹ ${price}/month`;
        } else { // For 'sale'
            if (price >= 10000000) {
                return `₹ ${(price / 10000000).toFixed(1)} Cr`;
            } else if (price >= 100000) {
                return `₹ ${(price / 100000).toFixed(1)} Lacs`;
            }
            return `₹ ${price}`;
        }
    };

    const getListingTags = (listing: PropertyListing): string[] => {
        const tags: string[] = [];
        if (listing.isPremium) {
            tags.push('Premium');
        }
        // Calculate 'New' tag based on creation date within the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        if (new Date(listing.createdAt) > thirtyDaysAgo) {
            tags.push('New');
        }

        // Add 'Verified' if you have a verification status in your model
        // For example: if (listing.isVerified) { tags.push('Verified'); }

        return tags;
    };

    if (loading) {
        return (
            <section className="py-12 text-center">
                <p className="text-xl text-gray-700">Loading featured listings...</p>
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

    if (featuredListings.length === 0) {
        return (
            <section className="py-12 text-center">
                <p className="text-xl text-gray-700">No featured listings available at the moment.</p>
            </section>
        );
    }

    return (
        <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="py-12"
        >
            <motion.h2
                variants={itemVariants}
                className="text-3xl font-bold text-center text-gray-800 mb-10"
            >
                Featured Listings
            </motion.h2>
            <div className="relative max-w-full lg:max-w-4xl mx-auto">
                <Carousel cardWidthClass="w-full sm:w-1/2 lg:w-1/3 p-2" snapAlign="snap-start" interval={4000}>
                    {featuredListings.map((listing) => (
                        <motion.div
                            key={listing._id}
                            variants={itemVariants}
                            className="flex-shrink-0 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:scale-[1.02] cursor-pointer"
                        >
                            {/* Link to individual property page */}
                            <Link href={`/property/${listing._id}`} passHref>
                                {/* This div acts as the clickable area for the card content */}
                                <div className="block"> {/* Use block to make the link cover the card */}
                                    <div className="relative">
                                        <img
                                            src={listing.images[0] || '/placeholder-image.jpg'}
                                            alt={listing.title}
                                            className="w-full h-56 object-cover rounded-t-2xl"
                                        />
                                        <div className="absolute top-4 right-4 flex flex-wrap gap-2">
                                            {getListingTags(listing).map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-[#2180d3]/90 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">{listing.title}</h3>
                                        <p className="text-[#2180d3] font-extrabold text-lg mb-1">
                                            {formatPrice(listing.price, listing.transactionType)}
                                        </p>
                                        <p className="text-gray-600 text-sm mb-4 flex items-center gap-1">
                                            <LocationIcon /> {listing.location.city}, {listing.location.state}
                                        </p>
                                        {/* This button is now redundant if the whole card is a link,
                                            but keeping it if you want specific button styling/behavior.
                                            If the whole card is linked, you might remove this button. */}
                                        <button className="w-full bg-[#2180d3] hover:bg-[#1a6cb2] text-white py-3 rounded-xl font-medium transition duration-300 ease-in-out shadow-md">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </Carousel>
            </div>
            <motion.div
                variants={itemVariants}
                className="text-center mt-12"
            >
                {/* Link to all listings page */}
                <Link href="/property" passHref>
                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-4 rounded-full font-semibold shadow-md transition-transform duration-200 transform hover:scale-105">
                        Browse All Listings
                    </button>
                </Link>
            </motion.div>
        </motion.section>
    );
};