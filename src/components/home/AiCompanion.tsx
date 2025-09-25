// app/components/AiCompanionSection.tsx

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export const AiCompanionSection: React.FC = () => {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">

          {/* Image Section */}
          <div className="flex-shrink-0 w-80 h-80 sm:w-96 sm:h-96">
            {/* The container gives the image its rounded shape and shadow */}
            <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-xl">
              <Image
                src="/homeIcons/AiCompanion.png" 
                alt="AI property assistant Swetha"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </div>

          {/* Text Content Section */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-lg">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Your Perfect Partner for Searching Properties
            </h2>
            <p className="mt-4 text-lg text-gray-600 leading-relaxed">
              ✨ "Meet Swetha – your friendly AI companion who helps you find the right properties, chats with you, and shares market insights (and much more) with a smile!"
            </p>
            <Link
              href="/chat" // IMPORTANT: Replace with your chat page link
              className="mt-8 inline-block bg-gray-900 text-white font-semibold px-8 py-3 rounded-full shadow-md transition-transform duration-300 ease-in-out hover:bg-gray-800 hover:scale-105"
            >
              Talk with Swetha
            </Link>
          </div>
          
        </div>
      </div>
    </section>
  );
};