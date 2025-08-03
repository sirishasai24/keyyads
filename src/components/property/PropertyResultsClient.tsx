// components/property/PropertyResultsClient.tsx
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

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
  // Add other properties if they exist in your Property model
}

export function PropertyResultsClient() {
  const [allProperties, setAllProperties] = useState<Property[]>([]); // Stores all fetched properties for the current search
  const [currentProperties, setCurrentProperties] = useState<Property[]>([]); // Properties for the current page
  const [currentPage, setCurrentPage] = useState(1);
  const [propertiesPerPage] = useState(9); // Display 9 properties per page
  const [loading, setLoading] = useState(false); // Add loading state
  const [error, setError] = useState<string | null>(null); // Add error state

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError(null);
      try {
        const query = new URLSearchParams(searchParams.toString()).toString();
        // Assuming your API returns ALL properties that match the search query,
        // without handling pagination on the backend.
        const res = await axios.get(`/api/property/search?${query}`);
        setAllProperties(res.data.properties || []);
        setCurrentPage(1); // Reset to first page on new search query
      } catch (err) {
        console.error('Failed to fetch properties:', err);
        setError('Failed to load properties. Please try again.');
        setAllProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [searchParams]); // Re-fetch all properties when search params change

  // Effect to update currentProperties when allProperties or currentPage changes
  useEffect(() => {
    const indexOfLastProperty = currentPage * propertiesPerPage;
    const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
    setCurrentProperties(allProperties.slice(indexOfFirstProperty, indexOfLastProperty));
  }, [allProperties, currentPage, propertiesPerPage]);

  const totalPages = Math.ceil(allProperties.length / propertiesPerPage);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    // Scroll to top of the page on page change for better UX
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPaginationButtons = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    const maxVisibleButtons = 5; // Max number of pagination buttons to show at once
    let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

    // Adjust startPage if we're near the end and can't fill maxVisibleButtons
    if (endPage - startPage + 1 < maxVisibleButtons) {
        startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }

    const visiblePageNumbers = pageNumbers.slice(startPage - 1, endPage);

    return (
      <nav className="flex justify-center mt-12" aria-label="Pagination">
        <ul className="inline-flex -space-x-px text-base h-10">
          <li>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
          </li>

          {startPage > 1 && (
            <>
              <li>
                <button
                  onClick={() => handlePageChange(1)}
                  className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                >
                  1
                </button>
              </li>
              {startPage > 2 && (
                <li>
                  <span className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300">
                    ...
                  </span>
                </li>
              )}
            </>
          )}

          {visiblePageNumbers.map((number) => (
            <li key={number}>
              <button
                onClick={() => handlePageChange(number)}
                className={`flex items-center justify-center px-4 h-10 leading-tight border border-gray-300 ${
                  currentPage === number
                    ? "text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700"
                    : "text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700"
                }`}
              >
                {number}
              </button>
            </li>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <li>
                  <span className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300">
                    ...
                  </span>
                </li>
              )}
              <li>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                >
                  {totalPages}
                </button>
              </li>
            </>
          )}

          <li>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-10 text-center">
          Discover <span className="text-[#1f8fff]">Your Dream Property</span>{' '}
        </h1>

        {loading ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="w-16 h-16 border-4 border-[#1f8fff] border-t-transparent rounded-full animate-spin"></div>
            <p className="ml-4 text-gray-600 text-lg">Loading properties...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 rounded-2xl shadow-lg p-10 text-center border border-red-200">
            <p className="text-2xl font-semibold text-red-800">{error}</p>
          </div>
        ) : allProperties.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
            <p className="text-2xl font-semibold text-gray-700">No Results Found</p>
            <p className="text-gray-500 mt-2">Try adjusting your search filters.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentProperties.map((p) => (
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
                      {p.type}
                    </div>
                  </div>
                  <div className="p-4">
                    <h2 className="text-base font-semibold text-gray-800 truncate" title={p.title}>
                      {p.title}
                    </h2>
                    <p className="text-xs text-gray-600 mt-1 flex items-center">
                      <span className="mr-1 text-[#1f8fff]">
                        <i className="fas fa-map-marker-alt" />
                      </span>
                      {p.location?.city}, {p.location?.state}
                    </p>

                    <div className="flex items-center justify-between mt-4">
                      <p className="text-lg font-bold text-[#1f8fff]">
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
            {totalPages > 1 && renderPaginationButtons()}
          </>
        )}
      </div>
    </div>
  );
}