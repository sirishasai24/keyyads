'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { HeroSection } from '@/components/home/hero-section';

interface Location {
  city?: string;
  state?: string;
}

interface Property {
  _id: string;
  title: string;
  images?: string[];
  type: string;
  location?: Location;
  price: number;
}

export default function PropertyResultsPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const query = new URLSearchParams(searchParams.toString()).toString();
        const res = await axios.get(`/api/property/search?${query}`);
        setProperties(res.data.properties);
      } catch (error) {
        console.error('Failed to fetch properties:', error);
        setProperties([]);
      }
    };

    fetchProperties();
  }, [searchParams]);

  return (
    <>
      <HeroSection />

      <div className="min-h-screen bg-[#f9fafb] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-10 text-center">
            Discover <span className="text-[#1f8fff]">Your Dream Property</span>{' '}
          </h1>

          {properties.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
              <p className="text-2xl font-semibold text-gray-700">No Results Found</p>
              <p className="text-gray-500 mt-2">Try adjusting your search filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((p) => (
                <div
                  key={p._id}
                  className="bg-white rounded-xl shadow-md group overflow-hidden transition-transform duration-300 hover:scale-[1.02]"
                >
                  <div className="relative h-44 w-full overflow-hidden">
                    {p.images?.[0] ? (
                      <img
                        src={p.images[0]}
                        alt={p.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                        No Image Available
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-[#1f8fff] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow">
                      {' '}
                      {p.type}
                    </div>
                  </div>
                  <div className="p-4">
                    <h2 className="text-base font-semibold text-gray-800 truncate" title={p.title}>
                      {p.title}
                    </h2>
                    <p className="text-xs text-gray-600 mt-1 flex items-center">
                      <span className="mr-1 text-[#1f8fff]">
                        {' '}
                        <i className="fas fa-map-marker-alt" />
                      </span>
                      {p.location?.city}, {p.location?.state}
                    </p>

                    <div className="flex items-center justify-between mt-4">
                      <p className="text-lg font-bold text-[#1f8fff]">
                        {' '}
                        ₹{p.price.toLocaleString()}
                      </p>
                      <button
                        onClick={() => router.push(`/property/${p._id}`)}
                        className="bg-[#1f8fff] text-white text-xs font-medium px-3 py-1.5 rounded-md hover:bg-[#1a77cc] cursor-pointer shadow-sm transition duration-200"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}