'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

interface CarouselProps {
    children: React.ReactNode[];
    interval?: number;
    showControls?: boolean;
    cardWidthClass?: string;
    snapAlign?: string;
}

export const Carousel: React.FC<CarouselProps> = ({
    children,
    interval = 5000,
    showControls = true,
    cardWidthClass = "w-full",
    snapAlign = "snap-center"
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    // Number of cards to show per slide on desktop (lg breakpoint)
    // This is derived from `lg:w-1/3` in `cardWidthClass`.
    // For simplicity, we hardcode it assuming a 1/3 width means 3 cards.
    const cardsPerDesktopSlide = 3; 

    // Calculate total number of "pages" or "slides" for desktop view
    const totalDesktopSlides = Math.ceil(children.length / cardsPerDesktopSlide);

    // This ref will be used to determine the actual number of cards visible
    // depending on the screen size. For now, we'll use a simplified approach
    // assuming `lg:w-1/3` means 3 cards on desktop.
    // In a more robust solution, you'd use a ResizeObserver or media queries in JS
    // to dynamically determine `cardsPerView` based on `cardWidthClass` and current viewport.
    const getCardsPerView = useCallback(() => {
        // You'd ideally parse cardWidthClass or use actual window.innerWidth and breakpoints here.
        // For this specific example, assuming the `lg:w-1/3` from FeaturedListings means 3 cards on large screens.
        if (window.innerWidth >= 1024) { // Tailwind's 'lg' breakpoint is typically 1024px
            return cardsPerDesktopSlide;
        } else if (window.innerWidth >= 640) { // Tailwind's 'sm' breakpoint is typically 640px
            // Assuming 'sm:w-1/2' means 2 cards on small/medium screens
            return 2; 
        }
        return 1; // Default for mobile 'w-full'
    }, [cardsPerDesktopSlide]);


    // Modified useEffect for auto-scrolling
    useEffect(() => {
        const currentCardsPerView = getCardsPerView();
        // Adjust total "pages" based on actual cards per view
        const totalPages = Math.ceil(children.length / currentCardsPerView);

        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => {
                // If we're showing multiple cards per slide, increment by 1 "page"
                return (prevIndex + 1) % totalPages;
            });
        }, interval);
        return () => clearInterval(timer);
    }, [children.length, interval, getCardsPerView]);


    const goToSlide = (pageIndex: number) => {
        setCurrentIndex(pageIndex);
    };

    const nextSlide = () => {
        const currentCardsPerView = getCardsPerView();
        const totalPages = Math.ceil(children.length / currentCardsPerView);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % totalPages);
    };

    const prevSlide = () => {
        const currentCardsPerView = getCardsPerView();
        const totalPages = Math.ceil(children.length / currentCardsPerView);
        setCurrentIndex((prevIndex) => (prevIndex - 1 + totalPages) % totalPages);
    };

    // Calculate the translateX percentage
    // Each "slide" now moves by the percentage of one card's width multiplied by cards per view
    const currentCardsPerView = getCardsPerView();
    const translateXPercentage = (currentIndex * 100) / currentCardsPerView;


    // Generate dot indicators based on the number of "pages"
    const totalPages = Math.ceil(children.length / currentCardsPerView);
    const dotIndicators = Array.from({ length: totalPages }, (_, i) => (
        <button
            key={i}
            onClick={() => goToSlide(i)}
            className={`h-2 w-2 rounded-full ${currentIndex === i ? 'bg-[#1f8fff]' : 'bg-gray-300'} transition-colors duration-200`}
        />
    ));


    return (
        <div className="relative overflow-hidden">
            <div
                className={`flex transition-transform duration-500 ease-in-out`}
                style={{ transform: `translateX(-${translateXPercentage}%)` }}
            >
                {children.map((child, index) => (
                    <div key={index} className={`flex-shrink-0 ${cardWidthClass} ${snapAlign}`}>
                        {child}
                    </div>
                ))}
            </div>

            {showControls && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full z-10 shadow-lg transition-all duration-200 focus:outline-none"
                        aria-label="Previous slide"
                    >
                        <ChevronLeftIcon className="w-6 h-6" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full z-10 shadow-lg transition-all duration-200 focus:outline-none"
                        aria-label="Next slide"
                    >
                        <ChevronRightIcon className="w-6 h-6" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                        {dotIndicators}
                    </div>
                </>
            )}
        </div>
    );
};