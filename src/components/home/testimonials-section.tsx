// components/testimonials-section.tsx
'use client';

import React, { useEffect, useState } from 'react'; // Import useState explicitly
import axios from 'axios';
import { motion } from 'framer-motion';
import { Carousel } from './slider'; // Import Carousel
import { QuoteIcon, StarIcon } from './emojis'; // Import QuoteIcon and StarIcon

// Define the structure of a testimonial as received from your API
interface Testimonial {
    _id: string; // MongoDB's default ID
    username: string;
    review: string;
    rating: number;
    location: string;
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
            <section className="py-12 bg-[#1f8fff]/10 rounded-3xl shadow-inner mt-12 text-center text-gray-700">
                Loading testimonials...
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-12 bg-[#1f8fff]/10 rounded-3xl shadow-inner mt-12 text-center text-red-600">
                {error}
            </section>
        );
    }

    if (testimonials.length === 0) {
        return (
            <section className="py-12 bg-[#1f8fff]/10 rounded-3xl shadow-inner mt-12 text-center text-gray-700">
                No testimonials available at the moment.
            </section>
        );
    }

    // --- Main Render Logic (unchanged design) ---
    return (
        <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="py-12 bg-[#1f8fff]/10 rounded-3xl shadow-inner mt-12"
        >
            <motion.h2
                variants={itemVariants}
                className="text-3xl font-bold text-center text-gray-800 mb-10"
            >
                What Our Clients Say
            </motion.h2>
            <div className="relative max-w-full lg:max-w-6xl mx-auto">
                <Carousel cardWidthClass="w-full md:w-1/2 lg:w-1/3 p-4" snapAlign="snap-center" interval={5000}>
                    {testimonials.map((testimonial) => (
                        <motion.div
                            key={testimonial._id} // Using _id as the key, as it's unique from MongoDB
                            variants={itemVariants}
                            className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col text-center transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
                        >
                            <QuoteIcon />
                            <p className="text-lg text-gray-700 mb-5 italic font-light">&quot;{testimonial.review}&quot;</p>
                            <div className="text-yellow-500 mb-2">
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