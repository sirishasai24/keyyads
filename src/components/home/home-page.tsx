'use client';

import React from 'react';
import { HeroSection } from './hero-section';
import { QuickFilters } from './quick-filters';
import { FeaturedListings } from './featured-listings';
import { TestimonialsSection } from './testimonials-section';
import BannerSlider from './banner-slider';
import BannerSlider2 from './banner-slider2';

export function HomePage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <HeroSection />
            <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <QuickFilters />
                <BannerSlider/>
                <FeaturedListings />
                <BannerSlider2/>
                <TestimonialsSection />
            </main>
        </div>
    );
}
