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

    // Determines how many cards are conceptually visible in a "slide" for navigation.
    // When `cardWidthClass` is "w-full", it implies only one card is visible at a time.
    const getCardsPerView = useCallback(() => {
        if (cardWidthClass.includes("w-full")) {
            return 1;
        }
        // This responsive logic would apply if `cardWidthClass` allowed multiple items per view (e.g., "w-1/3")
        if (window.innerWidth >= 1024) { // Tailwind's 'lg' breakpoint is typically 1024px
            return 3; // Example: if cards were lg:w-1/3
        } else if (window.innerWidth >= 640) { // Tailwind's 'sm' breakpoint is typically 640px
            return 2; // Example: if cards were sm:w-1/2
        }
        return 1; // Default for mobile or if card is explicitly w-full
    }, [cardWidthClass]);

    useEffect(() => {
        // The `totalPages` for navigation is simply the count of children
        // because each child currently occupies the full width due to `cardWidthClass="w-full"`.
        const totalPages = children.length;

        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => {
                return (prevIndex + 1) % totalPages;
            });
        }, interval);
        return () => clearInterval(timer);
    }, [children.length, interval, getCardsPerView]);


    const goToSlide = (pageIndex: number) => {
        setCurrentIndex(pageIndex);
    };

    const nextSlide = () => {
        const totalPages = children.length;
        setCurrentIndex((prevIndex) => (prevIndex + 1) % totalPages);
    };

    const prevSlide = () => {
        const totalPages = children.length;
        setCurrentIndex((prevIndex) => (prevIndex - 1 + totalPages) % totalPages);
    };

    // The translateX percentage is calculated based on each card taking 100% of the visible width.
    const translateXPercentage = currentIndex * 100;

    // Dot indicators are generated for each individual card.
    const totalPages = children.length;
    const dotIndicators = Array.from({ length: totalPages }, (_, i) => (
        <button
            key={i}
            onClick={() => goToSlide(i)}
            className={`h-2 w-2 rounded-full ${currentIndex === i ? 'bg-[#1f8fff]' : 'bg-gray-300'} transition-colors duration-200`}
            aria-label={`Go to slide ${i + 1}`}
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