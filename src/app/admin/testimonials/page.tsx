"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { StarRating } from "@/components/StarRating"; // Ensure this path is correct
import {
  MapPinIcon,
  ChatBubbleLeftIcon,
} from "@heroicons/react/24/outline";

interface Testimonial {
  _id: string;
  username: string;
  review: string;
  rating: number;
  location: string;
  createdAt: string;
  profileImageURL: string; // Add the profile image URL here
}

export default function TestimonialsPage() {
  const primaryColor = "#2180d3"; // Changed to the new theme color

  const [allTestimonials, setAllTestimonials] = useState<Testimonial[]>([]); // Stores all fetched testimonials
  const [currentTestimonials, setCurrentTestimonials] = useState<Testimonial[]>([]); // Testimonials for the current page
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [testimonialsPerPage] = useState(6); // Display 6 testimonials per page

  useEffect(() => {
    const fetchAllTestimonials = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get("/api/admin/testimonials");
        // Assuming the API returns ALL testimonials without pagination
        setAllTestimonials(response.data.testimonials || []);
      } catch (err) {
        setError("Failed to load testimonials. Please try again later.");
        console.error("Error fetching testimonials:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllTestimonials();
  }, []); // Empty dependency array means this runs once on mount

  // Effect to update currentTestimonials when allTestimonials or currentPage changes
  useEffect(() => {
    const indexOfLastTestimonial = currentPage * testimonialsPerPage;
    const indexOfFirstTestimonial = indexOfLastTestimonial - testimonialsPerPage;

    // Sort testimonials by creation date (newest first) before slicing
    const sortedTestimonials = [...allTestimonials].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    setCurrentTestimonials(sortedTestimonials.slice(indexOfFirstTestimonial, indexOfLastTestimonial));
  }, [allTestimonials, currentPage, testimonialsPerPage]);

  const totalPages = Math.ceil(allTestimonials.length / testimonialsPerPage);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return; // Prevent invalid page numbers
    setCurrentPage(pageNumber);
    // Scroll to top of the testimonials section or page on page change for better UX
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPaginationButtons = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    // Logic to limit visible page buttons (e.g., show 5 buttons at a time)
    const maxVisibleButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

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
              {startPage > 2 && ( // Only show ellipsis if there's a gap after page 1
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
              {endPage < totalPages - 1 && ( // Only show ellipsis if there's a gap before last page
                <li>
                  <span className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300">
                    ...
                  </span>
                </li>
              )}
              <li>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700"
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-lg">
          <svg
            className="animate-spin h-12 w-12 text-blue-500"
            style={{ color: primaryColor }}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="mt-4 text-xl font-medium text-gray-700">
            Fetching amazing stories...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-100 p-8">
        <p className="text-2xl font-semibold text-red-800 bg-white p-6 rounded-lg shadow-md border border-red-200">
          Oops! {error}
        </p>
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-white"
    >
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h2
          className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4"
          style={{ color: primaryColor }}
        >
          What Our Clients Say
        </h2>
        <p className="mt-2 text-lg text-gray-600">
          Discover stories from people who trusted us with their property needs.
        </p>
      </div>

      {currentTestimonials.length === 0 && !loading && !error && allTestimonials.length === 0 ? (
        <div className="text-center text-gray-600 text-2xl py-20 bg-gray-50 rounded-xl shadow-lg mx-auto max-w-2xl">
          <p className="mb-4">No testimonials available yet.</p>
          <p className="text-lg">Be the first to share your experience!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {currentTestimonials.map((testimonial) => (
            <motion.div
              key={testimonial._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="p-8 rounded-2xl shadow-lg border border-gray-100 text-center flex flex-col items-center transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
              style={{
                background: "linear-gradient(135deg, #e6f3ff, #f8fbff)",
              }}
            >
              {/* Profile Image */}
              <div className="mb-4">
                <img
                  src={testimonial.profileImageURL || '/default-avatar.png'} // Added fallback image
                  alt={testimonial.username}
                  width={96} // Adjust size as needed, 96px for h-24 w-24
                  height={96}
                  className="rounded-full object-cover border-2 border-blue-400 shadow-md"
                />
              </div>

              <ChatBubbleLeftIcon
                className="h-8 w-8 mx-auto mb-4"
                style={{ color: primaryColor }}
              />
              <p className="text-lg text-gray-700 mb-5 italic font-light flex-grow">
                &quot;{testimonial.review}&quot;
              </p>
              <div className="mb-4">
                <StarRating
                  rating={testimonial.rating}
                  disabled={true}
                  starColor={primaryColor}
                />
              </div>
              <div className="flex flex-col items-center space-y-1">
                <p className="font-bold text-gray-800 text-lg">
                  {testimonial.username}
                </p>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <MapPinIcon className="w-4 h-4 text-gray-400" />
                  {testimonial.location}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Only render pagination if there's more than one page */}
      {totalPages > 1 && renderPaginationButtons()}
    </motion.section>
  );
}