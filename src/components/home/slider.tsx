// components/carousel.tsx
'use client';

import React, { useState, useEffect } from 'react';
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

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % children.length);
        }, interval);
        return () => clearInterval(timer);
    }, [children.length, interval]);

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % children.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + children.length) % children.length);
    };

    return (
        <div className="relative overflow-hidden">
            <div className={`flex transition-transform duration-500 ease-in-out`}
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
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
                        {children.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`h-2 w-2 rounded-full ${currentIndex === index ? 'bg-[#1f8fff]' : 'bg-gray-300'} transition-colors duration-200`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};