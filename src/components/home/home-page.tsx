'use client';

import React from 'react';
import { HeroSection } from './hero-section';
import { QuickFilters } from './quick-filters';
import { FeaturedListings } from './featured-listings';
import { TestimonialsSection } from './testimonials-section';
import VideoBanner from './video-banner';

export function HomePage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <HeroSection />
            <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <QuickFilters />

                {/* Centered Video Banner as a horizontal banner */}
                <div className="my-24 flex justify-center">
                    <VideoBanner
                        src="/videos/videobanner.mp4"
                        alt="Discover your dream property with our immersive video experience from Keyprime - where luxury and affordability meet each other. Available soon in Future City."
                        className="w-full max-w-6xl h-[260px] object-cover rounded-lg shadow-xl"
                    />
                </div>

                <FeaturedListings />
                <TestimonialsSection />
            </main>
        </div>
    );
}
