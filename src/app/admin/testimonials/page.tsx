"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { StarRating } from "@/components/StarRating";
import { format } from "date-fns";
import {
  UserCircleIcon,
  MapPinIcon,
  ChatBubbleLeftIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

interface Testimonial {
  _id: string;
  username: string;
  review: string;
  rating: number;
  location: string;
  createdAt: string;
}

export default function TestimonialsPage() {
  const primaryColor = "#2180d3"; // Changed to the new theme color

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get("/api/admin/testimonials");
        setTestimonials(response.data.testimonials || []);
      } catch (err) {
        setError("Failed to load testimonials. Please try again later.");
        console.error("Error fetching testimonials:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-lg">
          <svg
            className="animate-spin h-12 w-12 text-blue-500"
            style={{ color: primaryColor }} // Apply primaryColor here
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
          style={{ color: primaryColor }} // Apply primaryColor here
        >
          What Our Clients Say
        </h2>
        <p className="mt-2 text-lg text-gray-600">
          Discover stories from people who trusted us with their property needs.
        </p>
      </div>

      {testimonials.length === 0 ? (
        <div className="text-center text-gray-600 text-2xl py-20 bg-gray-50 rounded-xl shadow-lg mx-auto max-w-2xl">
          <p className="mb-4">No testimonials available yet.</p>
          <p className="text-lg">Be the first to share your experience!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="p-8 rounded-2xl shadow-lg border border-gray-100 text-center transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
              style={{
                background: "linear-gradient(135deg, #e6f3ff, #f8fbff)", // Kept as lighter blue, consider adjusting if a darker gradient is preferred
              }}
            >
              <ChatBubbleLeftIcon
                className="h-8 w-8 mx-auto mb-4"
                style={{ color: primaryColor }} // Apply primaryColor here
              />
              <p className="text-lg text-gray-700 mb-5 italic font-light">
                "{testimonial.review}"
              </p>
              <div className="mb-4">
                <StarRating
                  rating={testimonial.rating}
                  readOnly={true}
                  starColor={primaryColor} // Apply primaryColor here
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
    </motion.section>
  );
}