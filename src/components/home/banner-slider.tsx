'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// NOTE: The Banner interface is still useful here for type safety
interface Banner {
    id: string;
    imageUrl: string;
    altText: string;
    // linkUrl: string; // linkUrl is no longer needed
}

const BannerSlider: React.FC<{ interval?: number }> = ({ interval = 5000 }) => {
    // Define the banner data directly within the component
    const homeBanners: Banner[] = [
        {
            id: 'banner1',
            imageUrl: '/banners/web banner-1.png', // Make sure this path exists in your public folder
            altText: 'Discover Luxury Homes with Keyyards',
            // linkUrl: '/properties?category=luxury' // linkUrl still removed as per previous request
        },
        {
            id: 'banner2',
            imageUrl: '/banners/web banner-2.png', // Make sure this path exists in your public folder
            altText: 'Find Your Perfect Rental Property Today',
            // linkUrl: '/rentals' // linkUrl still removed as per previous request
        },
        {
            id: 'banner3',
            imageUrl: '/banners/web banner-3.png', // Make sure this path exists in your public folder
            altText: 'Invest in Prime Plots for Future Growth',
            // linkUrl: '/plots' // linkUrl still removed as per previous request
        },
        // Add more banners if needed
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-slide functionality
    useEffect(() => {
        if (homeBanners.length <= 1) return; // No need to auto-slide if 0 or 1 banner

        const timer = setInterval(() => {
            // We use paginate here to ensure the direction state is also updated for auto-slide animation
            paginate(1);
        }, interval);

        return () => clearInterval(timer); // Cleanup on component unmount
    }, [homeBanners.length, interval, currentIndex]); // Dependency on homeBanners.length

    // Animation variants for Framer Motion
    const sliderVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? '100%' : '-100%',
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            x: direction < 0 ? '100%' : '-100%',
            opacity: 0
        })
    };

    // To handle direction for Framer Motion animation and update current index
    const [direction, setDirection] = useState(0); // 0 for initial, 1 for next, -1 for prev
    const paginate = (newDirection: number) => {
        setDirection(newDirection);
        setCurrentIndex((prev) => {
            const newIndex = (prev + newDirection + homeBanners.length) % homeBanners.length;
            return newIndex;
        });
    };

    // To ensure the animation restarts when dot is clicked
    const handleDotPaginate = (index: number) => {
        if (index === currentIndex) return; // Do nothing if clicking on the current dot

        if (index > currentIndex) {
            setDirection(1); // Moving to a higher index means moving "next"
        } else {
            setDirection(-1); // Moving to a lower index means moving "prev"
        }
        setCurrentIndex(index);
    };


    if (!homeBanners || homeBanners.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500">
                No banners to display.
            </div>
        );
    }

    const currentBanner = homeBanners[currentIndex]; // Use homeBanners directly

    return (
        <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-lg shadow-lg mb-12" style={{ aspectRatio: '2.7 / 1' }}>
            <AnimatePresence initial={false} custom={direction}>
                {/* Changed motion.a to motion.div - no redirect links */}
                <motion.div
                    key={currentIndex} // Important for AnimatePresence to detect change and animate
                    className="absolute inset-0 block w-full h-full"
                    variants={sliderVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    custom={direction}
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 }
                    }}
                >
                    <img
                        src={currentBanner.imageUrl}
                        alt={currentBanner.altText}
                        className="w-full h-full object-contain" // w-full h-full and object-contain keep the image fitting the container
                    />
                </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            {homeBanners.length > 1 && (
                <>
                    <button
                        onClick={() => paginate(-1)} // Call paginate for previous
                        // Changed p-2 to p-1.5 for smaller padding, and w-5 h-5 for smaller icon
                        className="absolute top-1/2 left-3 -translate-y-1/2 bg-black bg-opacity-50 text-white p-1.5 rounded-full z-10 hover:bg-opacity-75 transition-colors focus:outline-none"
                        aria-label="Previous banner"
                    >
                        {/* Changed w-6 h-6 to w-5 h-5 */}
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                    </button>
                    <button
                        onClick={() => paginate(1)} // Call paginate for next
                        // Changed p-2 to p-1.5 for smaller padding, and w-5 h-5 for smaller icon
                        className="absolute top-1/2 right-3 -translate-y-1/2 bg-black bg-opacity-50 text-white p-1.5 rounded-full z-10 hover:bg-opacity-75 transition-colors focus:outline-none"
                        aria-label="Next banner"
                    >
                        {/* Changed w-6 h-6 to w-5 h-5 */}
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </button>
                </>
            )}

            {/* Dots for direct navigation */}
            {homeBanners.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                    {homeBanners.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => handleDotPaginate(index)}
                            // Changed w-3 h-3 to w-2.5 h-2.5 for smaller dots
                            className={`w-1 h-1 rounded-full ${currentIndex === index ? 'bg-white' : 'bg-gray-400 bg-opacity-70'} transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white`}
                            aria-label={`Go to slide ${index + 1}`}
                        ></button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BannerSlider;