"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import axios from "axios";
import { StarRating } from "@/components/StarRating"; // Ensure this path is correct
import {
  ChatBubbleBottomCenterTextIcon,
  UserIcon,
  MapPinIcon,
  PaperAirplaneIcon,
  PhotoIcon, // Import for image icon
} from "@heroicons/react/24/outline";

export default function AddTestimonialPage() {
  const primaryColor = "#2180d3";

  const [formData, setFormData] = useState({
    username: "",
    review: "",
    rating: 0,
    location: "",
    profileImageURL: "", // New field for image URL
  });
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false); // New loading state for image
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Basic client-side validation for file type and size (optional but recommended)
      if (!file.type.startsWith('image/')) {
        setMessage("Only image files are allowed.");
        setMessageType("error");
        setSelectedImageFile(null);
        setImagePreview(null);
        return;
      }
      if (file.size > 2 * 1024 * 1024) { // Max 2MB
        setMessage("Image size must be less than 2MB.");
        setMessageType("error");
        setSelectedImageFile(null);
        setImagePreview(null);
        return;
      }

      setMessage(""); // Clear previous messages
      setMessageType("");

      setSelectedImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedImageFile(null);
      setImagePreview(null);
      setFormData((prev) => ({ ...prev, profileImageURL: "" })); // Clear URL if image is deselected
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      let uploadedImageUrl = formData.profileImageURL;

      // Only upload image if a new one is selected
      if (selectedImageFile) {
        setImageUploading(true);
        const reader = new FileReader();

        // Convert file to Data URL and upload to Cloudinary
        uploadedImageUrl = await new Promise<string>((resolve, reject) => {
          reader.onloadend = async () => {
            try {
              const uploadResponse = await axios.post("/api/admin/image/upload", {
                image: reader.result,
              });
              if (uploadResponse.data.success) {
                setMessage("Image uploaded successfully!");
                setMessageType("success");
                resolve(uploadResponse.data.secure_url);
              } else {
                reject(new Error(uploadResponse.data.error || "Image upload failed."));
              }
            } catch (uploadError) {
              console.error("Image upload error:", uploadError);
              const errMsg = axios.isAxiosError(uploadError) && uploadError.response?.data?.error
                ? uploadError.response.data.error
                : "Failed to upload image due to server error.";
              reject(new Error(errMsg));
            } finally {
              setImageUploading(false);
            }
          };
          reader.onerror = (error) => {
            console.log(error)
            setImageUploading(false);
            reject(new Error("Failed to read image file."));
          };
          reader.readAsDataURL(selectedImageFile);
        });

        setFormData((prev) => ({ ...prev, profileImageURL: uploadedImageUrl }));

      } else if (!formData.profileImageURL) {
        // If no file selected AND no URL already in state (e.g., editing and removing image)
        setMessage("Please upload a profile image.");
        setMessageType("error");
        setLoading(false);
        return;
      }

      // Now submit testimonial with the image URL
      const finalFormData = { ...formData, profileImageURL: uploadedImageUrl };

      if (!finalFormData.profileImageURL) { // Double check after potential upload attempt
        setMessage("Profile image is required.");
        setMessageType("error");
        setLoading(false);
        return;
      }

      if (!finalFormData.username || !finalFormData.review || !finalFormData.location || finalFormData.rating <= 0) {
        setMessage("Please fill in all required fields (Name, Location, Review, Rating).");
        setMessageType("error");
        setLoading(false);
        return;
      }


      const response = await axios.post("/api/admin/testimonials/add", finalFormData);
      setMessage(response.data.message || "Testimonial submitted successfully!");
      setMessageType("success");
      // Reset form after successful submission
      setFormData({ username: "", review: "", rating: 0, location: "", profileImageURL: "" });
      setSelectedImageFile(null);
      setImagePreview(null);
    } catch (error) { // Type 'any' for broader error handling
      console.error("Submission error:", error);

      setMessage("Submission error:");
      setMessageType("error");
    } finally {
      setLoading(false);
      setImageUploading(false); // Ensure this is reset even if main submission fails
    }
  };

  const isFormDisabled = loading || imageUploading;

  return (
    <div
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center"
      style={{
        background: `linear-gradient(to bottom right, #f0f6fc, #e0f0f7, #cce6f2)`,
      }}
    >
      <div className="max-w-3xl w-full bg-white p-8 md:p-12 rounded-xl shadow-2xl space-y-8 border border-gray-100">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Share Your Experience
          </h2>
          <p className="text-lg text-gray-600">
            We&apos;d love to hear your thoughts on our service and help others
            find their dream property!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image Upload */}
          <div>
            <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700 mb-1">
              <PhotoIcon className="inline-block h-5 w-5 mr-2 text-gray-500" />
              Upload Profile Image
            </label>
            <input
              id="profileImage"
              name="profileImage"
              type="file"
              accept="image/*"
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-[#e0f0f7] file:text-[#2180d3]
                hover:file:bg-[#cce6f2]
                disabled:opacity-50 disabled:cursor-not-allowed
              "
              onChange={handleImageChange}
              disabled={isFormDisabled}
            />
            {imagePreview && (
              <div className="mt-4 flex items-center space-x-4">
                <img
                  src={imagePreview}
                  alt="Profile Preview"
                  className="w-24 h-24 object-cover rounded-full border-2 border-gray-300 shadow-md"
                />
                <span className="text-gray-600 text-sm">Image Selected</span>
              </div>
            )}
            {imageUploading && (
              <p className="text-sm text-blue-600 mt-2 flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading image...
              </p>
            )}
          </div>

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
              className="block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2180d3] text-gray-900"
              placeholder="e.g., John Doe"
              value={formData.username}
              onChange={handleChange}
              disabled={isFormDisabled}
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
              className="block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2180d3] text-gray-900"
              placeholder="e.g., New York, USA"
              value={formData.location}
              onChange={handleChange}
              disabled={isFormDisabled}
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
              className="block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2180d3] text-gray-900 resize-y"
              placeholder="Share your experience with us..."
              value={formData.review}
              onChange={handleChange}
              disabled={isFormDisabled}
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How would you rate us?
            </label>
            <StarRating
              rating={formData.rating}
              onRatingChange={handleRatingChange}
              starColor={primaryColor}
              disabled={isFormDisabled} // Disable rating during submission
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
              disabled={isFormDisabled}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white transition-all duration-300 ${
                isFormDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-[#2180d3] hover:bg-[#1a66a7]"
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