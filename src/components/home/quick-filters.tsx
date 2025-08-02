// components/quick-filters.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { HouseIcon, BuildingIcon, KeyIcon } from './emojis'; // Import icons
import { useRouter } from 'next/navigation';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

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

export const QuickFilters = () => {
    const router=useRouter();
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="flex flex-wrap justify-center gap-3 sm:gap-6 mb-12 -mt-20 relative z-20"
        >
            <motion.button variants={itemVariants} onClick={()=>router.push('/property?type=building')} className="bg-white text-gray-800 px-6 py-3 rounded-full font-semibold shadow-xl transition-transform duration-200 hover:scale-105 hover:shadow-2xl flex items-center gap-2">
                <HouseIcon /> Plots
            </motion.button>
            <motion.button variants={itemVariants} onClick={()=>router.push('/property?type=land')} className="bg-white text-gray-800 px-6 py-3 rounded-full font-semibold shadow-xl transition-transform duration-200 hover:scale-105 hover:shadow-2xl flex items-center gap-2">
                <BuildingIcon /> Apartments
            </motion.button>
            <motion.button variants={itemVariants} onClick={()=>router.push('/property?transactionType=rent')} className="bg-white text-gray-800 px-6 py-3 rounded-full font-semibold shadow-xl transition-transform duration-200 hover:scale-105 hover:shadow-2xl flex items-center gap-2">
                <KeyIcon /> Rentals
            </motion.button>
        </motion.div>
    );
};