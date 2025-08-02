// components/testimonials-section.tsx
'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Carousel } from './slider'; // Assuming your Carousel component path
import { QuoteIcon, StarIcon } from './emojis'; // Assuming your emojis path

// Define the updated structure of a testimonial as received from your API
interface Testimonial {
    _id: string; // MongoDB's default ID
    username: string;
    review: string;
    rating: number;
    location: string;
    profileImageURL: string; // Add the profile image URL here
}

// Define the structure of the full API response
interface ApiResponse {
    testimonials: Testimonial[];
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

export const TestimonialsSection = () => {
    // State to hold the testimonials data
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    // State to manage loading status (true initially)
    const [loading, setLoading] = useState(true);
    // State to hold any error messages (null initially)
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                // Ensure loading is true at the start of the fetch operation
                setLoading(true);
                setError(null); // Clear any previous errors

                // Make the API request, expecting the ApiResponse structure
                const response = await axios.get<ApiResponse>("/api/admin/testimonials");

                // Check if the 'testimonials' array exists in the response data
                if (response.data && Array.isArray(response.data.testimonials)) {
                    setTestimonials(response.data.testimonials);
                } else {
                    // Handle cases where the data format is unexpected
                    console.error("API response did not contain an array under 'testimonials' key:", response.data);
                    setError("Failed to load testimonials: Unexpected data format.");
                }
            } catch (err) {
                // Catch and log errors, then set the error state for display
                console.error("Error fetching testimonials:", err);
                setError("Failed to load testimonials. Please try again later.");
            } finally {
                // Ensure loading is set to false after the operation completes
                setLoading(false);
            }
        };

        fetchTestimonials();
    }, []); // Empty dependency array ensures this effect runs only once on mount

    // --- Conditional Rendering for Loading, Error, and No Data States ---

    if (loading) {
        return (
            <section className="py-8 bg-[#1f8fff]/10 rounded-3xl shadow-inner mt-12 text-center text-gray-700">
                <p>Loading testimonials...</p>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-8 bg-[#1f8fff]/10 rounded-3xl shadow-inner mt-12 text-center text-red-600">
                <p>{error}</p>
            </section>
        );
    }

    if (testimonials.length === 0) {
        return (
            <section className="py-8 bg-[#1f8fff]/10 rounded-3xl shadow-inner mt-12 text-center text-gray-700">
                <p>No testimonials available at the moment.</p>
            </section>
        );
    }

    // --- Main Render Logic ---
    return (
        <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="py-6 px-4 bg-[#1f8fff]/10 rounded-3xl shadow-inner mt-12 max-w-4xl mx-auto"
        >
            <motion.h2
                variants={itemVariants}
                className="text-2xl font-bold text-center text-gray-800 mb-6"
            >
                What Our Clients Say
            </motion.h2>
            <div className="relative max-w-full lg:max-w-6xl mx-auto">
                <Carousel cardWidthClass="w-full md:w-1/2 lg:w-1/3 p-4" snapAlign="snap-center" interval={7000}>
                    {testimonials.map((testimonial) => (
                        <motion.div
                            key={testimonial._id}
                            variants={itemVariants}
                            className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center text-center transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] min-h-[280px] sm:min-h-[260px] lg:min-h-[250px]"
                        >
                            {/* Profile Image */}
                            <div className="mb-4">
                                <img
                                    src={testimonial.profileImageURL || '/profile.png'} // Fallback image
                                    alt={testimonial.username}
                                    width={80} // Set a fixed width
                                    height={80} // Set a fixed height
                                    className="rounded-full object-cover border-2 border-[#1f8fff] shadow-md"
                                />
                            </div>

                            <QuoteIcon /> {/* Moved QuoteIcon below the image */}
                            <p className="text-base text-gray-700 mb-4 italic font-light flex-grow h-[100px] overflow-hidden">
                                &quot;{testimonial.review}&quot;
                            </p>
                            <div className="text-yellow-500 mb-2">
                                {/* Using a simple loop for stars; consider a dedicated StarRating component for more control */}
                                {[...Array(5)].map((_, i) => (
                                    <StarIcon key={i} fill={i < testimonial.rating} />
                                ))}
                            </div>
                            <p className="font-bold text-gray-800">{testimonial.username}</p>
                            <p className="text-sm text-gray-500">{testimonial.location}</p>
                        </motion.div>
                    ))}
                </Carousel>
            </div>
        </motion.section>
    );
};