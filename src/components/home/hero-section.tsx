// components/hero-section.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { LocationIcon, KeyIcon, BuildingIcon, FilterIcon } from './emojis';

const advancedFiltersVariants = {
    hidden: { height: 0, opacity: 0, y: -20 },
    visible: {
        height: 'auto',
        opacity: 1,
        y: 0,
        transition: {
            type: 'spring',
            stiffness: 100,
            damping: 20,
        },
    },
} as const; // Added 'as const' here

export const HeroSection = () => {
    const [showMoreFilters, setShowMoreFilters] = useState(false);
    const router = useRouter();

    const [location, setLocation] = useState('');
    const [transactionType, setTransactionType] = useState('');
    const [propertyType, setPropertyType] = useState('');
    const [bedrooms, setBedrooms] = useState('');
    const [bathrooms, setBathrooms] = useState('');
    const [furnishing, setFurnishing] = useState('');
    const [propertyAge, setPropertyAge] = useState('');
    const [facing, setFacing] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (location) params.set('location', location);
        if (transactionType) params.set('transactionType', transactionType);
        if (propertyType) params.set('type', propertyType);
        if (bedrooms) params.set('bedrooms', bedrooms);
        if (bathrooms) params.set('bathrooms', bathrooms);
        if (furnishing) params.set('furnishing', furnishing);
        if (propertyAge) params.set('propertyAge', propertyAge);
        if (facing) params.set('facing', facing);
        if (maxPrice) params.set('maxPrice', maxPrice);

        router.push(`/property?${params.toString()}`);
    };

    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative bg-cover bg-center h-[60vh] md:h-[70vh] flex items-center justify-center text-white px-4 py-8 md:p-4 overflow-hidden rounded-b-[2rem] md:rounded-b-[4rem] shadow-2xl"
            style={{
                backgroundImage:
                    "url('https://images.unsplash.com/photo-1580587771525-78b9dba3825f?q=80&w=1974&auto=format&fit=crop')",
            }}
        >
            <div className="absolute inset-0 bg-gradient-to-t from-[#2180d3] to-[#2180d3]"></div> {/* Adjusted opacity for background */}
            <div className="relative z-10 text-center max-w-5xl mx-auto px-4 sm:px-6"> {/* Removed lg:px-4 to let main container handle */}
                <motion.h1
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-3 md:mb-4 drop-shadow-md leading-tight"
                >
                    Find Your Future Home.
                </motion.h1>
                <motion.p
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 font-light drop-shadow-sm"
                >
                    Explore verified properties for sale and rent from trusted sellers across India.
                </motion.p>

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.9 }}
                    className="bg-white p-4 sm:p-6 md:p-10 rounded-2xl sm:rounded-3xl shadow-2xl max-w-5xl mx-auto" 
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 items-center"> {/* Adjusted gap */}
                        <div className="relative flex items-center bg-gray-100 rounded-lg sm:rounded-xl px-4 py-3 sm:px-5 sm:py-4 text-gray-800 col-span-full md:col-span-1 focus-within:ring-2 focus-within:ring-[#2180d3]"> {/* Adjusted padding, rounded */}
                            <LocationIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mr-2" /> {/* Adjusted icon size */}
                            <input
                                type="text"
                                placeholder="Location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full bg-transparent outline-none text-sm sm:text-base text-gray-700 placeholder-gray-700"
                            />
                        </div>

                        <div className="relative bg-gray-100 rounded-lg sm:rounded-xl px-4 py-3 sm:px-5 sm:py-4 text-gray-800 flex items-center focus-within:ring-2 focus-within:ring-[#2180d3]"> {/* Adjusted padding, rounded */}
                            <KeyIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mr-2" /> {/* Adjusted icon size */}
                            <select
                                value={transactionType}
                                onChange={(e) => setTransactionType(e.target.value)}
                                className="w-full bg-transparent outline-none text-sm sm:text-base text-gray-700 appearance-none"
                            >
                                <option value="">Transaction Type</option>
                                <option value="sale">For Sale</option>
                                <option value="rent">For Rent</option>
                            </select>
                        </div>

                        <div className="relative bg-gray-100 rounded-lg sm:rounded-xl px-4 py-3 sm:px-5 sm:py-4 text-gray-800 flex items-center focus-within:ring-2 focus-within:ring-[#2180d3]"> {/* Adjusted padding, rounded */}
                            <BuildingIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mr-2" /> {/* Adjusted icon size */}
                            <select
                                value={propertyType}
                                onChange={(e) => setPropertyType(e.target.value)}
                                className="w-full bg-transparent outline-none text-sm sm:text-base text-gray-700 appearance-none"
                            >
                                <option value="">Property Type</option>
                                <option value="land">Land</option>
                                <option value="building">Building</option>
                            </select>
                        </div>

                        <button
                            onClick={handleSearch}
                            className="w-full bg-[#2180d3] hover:bg-[#1a6cb2] text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg sm:rounded-xl transition-all duration-200 transform hover:scale-105 shadow-md col-span-full lg:col-span-1" 
                        >
                            Search
                        </button>
                    </div>

                    <div className="flex justify-end mt-4 sm:mt-5"> {/* Adjusted margin-top */}
                        <button
                            onClick={() => setShowMoreFilters(!showMoreFilters)}
                            className="text-xs sm:text-sm text-[#2180d3] bg-gray-100 hover:bg-gray-200 px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-semibold flex items-center gap-1 sm:gap-2" 
                        >
                            <FilterIcon className="w-3 h-3 sm:w-4 sm:h-4" /> {/* Adjusted icon size */}
                            {showMoreFilters ? 'Less Filters' : 'More Filters'}
                        </button>
                    </div>

                    <AnimatePresence>
                        {showMoreFilters && (
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                variants={advancedFiltersVariants}
                                className="mt-4" 
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4"> {/* Adjusted gap */}
                                    <select
                                        value={bedrooms}
                                        onChange={(e) => setBedrooms(e.target.value)}
                                        className="w-full px-4 py-3 sm:px-5 sm:py-4 rounded-lg sm:rounded-xl bg-gray-100 text-sm sm:text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2180d3]"
                                    >
                                        <option value="">Bedrooms</option>
                                        <option>1 BHK</option>
                                        <option>2 BHK</option>
                                        <option>3 BHK</option>
                                        <option>4+ BHK</option>
                                    </select>

                                    <select
                                        value={bathrooms}
                                        onChange={(e) => setBathrooms(e.target.value)}
                                        className="w-full px-4 py-3 sm:px-5 sm:py-4 rounded-lg sm:rounded-xl bg-gray-100 text-sm sm:text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2180d3]"
                                    >
                                        <option value="">Bathrooms</option>
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4+</option>
                                    </select>

                                    <select
                                        value={furnishing}
                                        onChange={(e) => setFurnishing(e.target.value)}
                                        className="w-full px-4 py-3 sm:px-5 sm:py-4 rounded-lg sm:rounded-xl bg-gray-100 text-sm sm:text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2180d3]"
                                    >
                                        <option value="">Furnishing</option>
                                        <option value="unfurnished">Unfurnished</option>
                                        <option value="semi-furnished">Semi-furnished</option>
                                        <option value="fully-furnished">Fully-furnished</option>
                                    </select>

                                    <select
                                        value={propertyAge}
                                        onChange={(e) => setPropertyAge(e.target.value)}
                                        className="w-full px-4 py-3 sm:px-5 sm:py-4 rounded-lg sm:rounded-xl bg-gray-100 text-sm sm:text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2180d3]"
                                    >
                                        <option value="">Property Age</option>
                                        <option value="new">New</option>
                                        <option value="<5 Years">&lt;5 Years</option>
                                        <option value="5-10 Years">5-10 Years</option>
                                        <option value=">10 Years">&gt;10 Years</option>
                                    </select>

                                    <select
                                        value={facing}
                                        onChange={(e) => setFacing(e.target.value)}
                                        className="w-full px-4 py-3 sm:px-5 sm:py-4 rounded-lg sm:rounded-xl bg-gray-100 text-sm sm:text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2180d3]"
                                    >
                                        <option value="">Facing</option>
                                        <option value="north">North</option>
                                        <option value="south">South</option>
                                        <option value="east">East</option>
                                        <option value="west">West</option>
                                        <option value="north-east">North-East</option>
                                        <option value="north-west">North-West</option>
                                        <option value="south-east">South-East</option>
                                        <option value="south-west">South-West</option>
                                    </select>

                                    <input
                                        type="number"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        placeholder="Max Price (₹)"
                                        className="w-full px-4 py-3 sm:px-5 sm:py-4 rounded-lg sm:rounded-xl bg-gray-100 text-sm sm:text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2180d3]"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </motion.section>
    );
};