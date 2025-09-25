// app/components/PropertyAssistanceSection.tsx

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export const PropertyAssistanceSection: React.FC = () => {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center lg:justify-between gap-12 lg:gap-20">

          {/* Text Content Section */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Property Posting Assistance
            </h2>
            <p className="mt-4 text-lg text-gray-700 leading-relaxed">
              Our sales agents can visit your office to help with property posting queries in Hyderabad, Vijayawada, and Bengaluru.
            </p>
            <p className="mt-4 text-lg text-gray-700 leading-relaxed">
              For customers across India, our customer care team is available to assist you anytime.
            </p>
            
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/enquire" // IMPORTANT: Replace with your enquiry page link
                className="inline-block bg-gray-900 text-white font-semibold px-8 py-3 rounded-full shadow-md transition-transform duration-300 ease-in-out hover:bg-gray-800 hover:scale-105"
              >
                Enquire Now
              </Link>
              <span className="text-gray-600 font-medium hidden sm:block">or</span> {/* 'or' visible on sm and up */}
              <Link
                href="tel:+91XXXXXXXXXX" // IMPORTANT: Replace with your contact number
                className="inline-block bg-gray-900 text-white font-semibold px-8 py-3 rounded-full shadow-md transition-transform duration-300 ease-in-out hover:bg-gray-800 hover:scale-105"
              >
                Call us
              </Link>
            </div>
          </div>

          {/* Image Section */}
          <div className="flex-shrink-0 w-80 h-80 sm:w-96 sm:h-96">
            {/* The container gives the image its rounded shape and shadow */}
            <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-xl bg-gray-800"> {/* Added bg-gray-800 as placeholder background */}
              <Image
                src="/homeIcons/propAssit.png" // IMPORTANT: Replace with your image path in the /public folder
                alt="Keyyard Team"
                fill
                style={{ objectFit: 'cover', objectPosition: 'center' }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};