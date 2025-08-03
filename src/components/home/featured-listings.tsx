'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Carousel } from './slider';
import { LocationIcon } from './emojis';
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
    const [showAd, setShowAd] = useState(true); // For ad visibility

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get<{ listings: PropertyListing[] }>('/api/property/featured');
                
                // Shuffle the listings and take up to 9
                const shuffledListings = response.data.listings.sort(() => 0.5 - Math.random());
                setFeaturedListings(shuffledListings.slice(0, 9));

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
            if (price >= 10000000) return `₹ ${(price / 10000000).toFixed(1)} Cr/month`;
            if (price >= 100000) return `₹ ${(price / 100000).toFixed(1)} Lacs/month`;
            if (price >= 1000) return `₹ ${(price / 1000).toFixed(1)}K/month`;
            return `₹ ${price}/month`;
        } else {
            if (price >= 10000000) return `₹ ${(price / 10000000).toFixed(1)} Cr`;
            if (price >= 100000) return `₹ ${(price / 100000).toFixed(1)} Lacs`;
            return `₹ ${price}`;
        }
    };

    const getListingTags = (listing: PropertyListing): string[] => {
        const tags: string[] = [];
        if (listing.isPremium) tags.push('Premium');
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        if (new Date(listing.createdAt) > thirtyDaysAgo) tags.push('New');
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
            className="py-12 relative"
        >
            <motion.h2
                variants={itemVariants}
                className="text-3xl font-bold text-center text-gray-800 mb-10"
            >
                Featured Listings
            </motion.h2>

            {/* Floating Ad Banner */}
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
                    className="rounded-xl w-full h-auto" // Keep h-auto for aspect ratio
                />
            </a>
        </div>
    </div>
)}


            <div className="relative max-w-full lg:max-w-4xl mx-auto">
                <Carousel cardWidthClass="w-full sm:w-1/2 lg:w-1/3 p-2" snapAlign="snap-start" interval={6000}>
                    {featuredListings.map((listing) => (
                        <motion.div
                            key={listing._id}
                            variants={itemVariants}
                            className="flex-shrink-0 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:scale-[1.02] cursor-pointer"
                        >
                            <Link href={`/property/${listing._id}`} passHref>
                                <div className="block">
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
                                                    className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full shadow-md"
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
                <Link href="/property" passHref>
                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-4 rounded-full font-semibold shadow-md transition-transform duration-200 transform hover:scale-105">
                        Browse All Listings
                    </button>
                </Link>
            </motion.div>
        </motion.section>
    );
};