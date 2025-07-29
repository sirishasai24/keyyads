"use client";

import { useState, FormEvent } from "react";
import axios from "axios";
import { StarRating } from "@/components/StarRating";
import {
  ChatBubbleBottomCenterTextIcon,
  UserIcon,
  MapPinIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";

export default function AddTestimonialPage() {
  const primaryColor = "#2180d3"; // Changed to the new theme color

  const [formData, setFormData] = useState({
    username: "",
    review: "",
    rating: 0,
    location: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRatingChange = (newRating: number) => {
    setFormData((prev) => ({
      ...prev,
      rating: newRating,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const response = await axios.post("/api/admin/testimonials/add", formData);
      setMessage(response.data.message || "Testimonial submitted successfully!");
      setMessageType("success");
      setFormData({ username: "", review: "", rating: 0, location: "" });
    } catch (error: any) {
      console.error("Submission error:", error);
      setMessage(error.response?.data?.message || "Failed to submit testimonial.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center"
      style={{
        background: `linear-gradient(to bottom right, #f0f6fc, #e0f0f7, #cce6f2)`, // Updated gradient
      }}
    >
      <div className="max-w-3xl w-full bg-white p-8 md:p-12 rounded-xl shadow-2xl space-y-8 border border-gray-100">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Share Your Experience
          </h2>
          <p className="text-lg text-gray-600">
            We'd love to hear your thoughts on our service and help others
            find their dream property!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              <UserIcon className="inline-block h-5 w-5 mr-2 text-gray-500" />
              Your Name
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2180d3] text-gray-900" // Updated focus ring
              placeholder="e.g., John Doe"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              <MapPinIcon className="inline-block h-5 w-5 mr-2 text-gray-500" />
              Your Location
            </label>
            <input
              id="location"
              name="location"
              type="text"
              required
              className="block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2180d3] text-gray-900" // Updated focus ring
              placeholder="e.g., New York, USA"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-1">
              <ChatBubbleBottomCenterTextIcon className="inline-block h-5 w-5 mr-2 text-gray-500" />
              Your Review
            </label>
            <textarea
              id="review"
              name="review"
              rows={4}
              required
              className="block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2180d3] text-gray-900 resize-y" // Updated focus ring
              placeholder="Share your experience with us..."
              value={formData.review}
              onChange={handleChange}
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How would you rate us?
            </label>
            <StarRating
              rating={formData.rating}
              onRatingChange={handleRatingChange}
              starColor={primaryColor} // Applied primaryColor
            />
          </div>

          {message && (
            <div
              className={`p-4 rounded-md ${
                messageType === "success"
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : "bg-red-100 text-red-700 border border-red-200"
              }`}
            >
              {message}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white transition-all duration-300 ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#2180d3] hover:bg-[#1a66a7]" // Updated button colors
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  <PaperAirplaneIcon className="inline-block h-6 w-6 mr-2 rotate-90" />
                  Submit Testimonial
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}