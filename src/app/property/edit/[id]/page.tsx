// src/app/property/edit/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Property } from "@/types/property"; // Your Property interface
import toast from "react-hot-toast";
import { isValidPhoneNumber } from "@/helpers/phoneNumberValidation"; // We'll create this helper

// Define initial state for the form, matching your Property model
const initialPropertyState: Property = {
  _id: "", // Will be filled from params
  title: "",
  username: "",
  contact: "",
  address: "",
  type: "building", // Default to 'building'
  transactionType: "sale", // Default to 'sale'
  price: 0,
  discount: 0,
  floors: 0,
  parking: 0,
  landCategory: undefined, // Only for 'land'
  bedrooms: "",
  bathrooms: "",
  propertyAge: undefined,
  furnishing: undefined,
  facing: "Not Specified",
  otherDetails: "",
  isPremium: false,
  area: 0,
  areaUnit: "sqft",
  location: {
    state: "",
    city: "",
    lat: undefined,
    lng: undefined,
  },
  images: [],
  description: "",
  createdAt: "", // Not editable
  createdBy: "", // Not editable
};

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id as string;

  const [propertyData, setPropertyData] =
    useState<Property>(initialPropertyState);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]); // For new image uploads
  const [previewImages, setPreviewImages] = useState<string[]>([]); // For existing and new images

  // Fetch property data on component mount
  useEffect(() => {
    if (!propertyId) return;

    const fetchProperty = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/property/${propertyId}`); // Public API to get single property
        const data = response.data.property;

        // Set initial form data
        setPropertyData({
          ...initialPropertyState, // Ensure all fields are present, even if undefined in fetched data
          ...data,
          location: data.location || initialPropertyState.location,
        });
        setPreviewImages(data.images || []); // Set existing images as previews
      } catch (err) {
        console.error("Error fetching property:", err);
        setError(
          
            "Failed to fetch property details. Please try again."
        );
        toast.error(
           "Failed to load property."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  // Handle form field changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    if (name.startsWith("location.")) {
      const locationField = name.split(".")[1];
      setPropertyData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]:
            type === "number" ? parseFloat(value) || 0 : value,
        },
      }));
    } else if (type === "checkbox") {
      setPropertyData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (type === "number") {
      setPropertyData((prev) => ({
        ...prev,
        [name]: parseFloat(value) || 0, // Ensure number fields are parsed
      }));
    } else {
      setPropertyData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImageFiles((prev) => [...prev, ...filesArray]); // Add new files

      // Create URLs for new image previews
      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setPreviewImages((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number, isExisting: boolean) => {
    if (isExisting) {
      // If it's an existing image (from propertyData.images), mark it for removal
      // We filter out the image from propertyData.images
      setPropertyData((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));
    } else {
      // If it's a newly selected file (from imageFiles)
      // The index for new files needs to be adjusted relative to imageFiles
      const existingImagesCount = propertyData.images.length;
      const fileIndex = index - existingImagesCount;
      const newImageFiles = imageFiles.filter((_, i) => i !== fileIndex);
      setImageFiles(newImageFiles);
    }
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // Basic validation
    if (!propertyData.title.trim()) {
      toast.error("Property title is required.");
      setSubmitting(false);
      return;
    }
    if (!isValidPhoneNumber(propertyData.contact)) {
      toast.error("Please enter a valid contact number.");
      setSubmitting(false);
      return;
    }
    if (!propertyData.address.trim()) {
      toast.error("Address is required.");
      setSubmitting(false);
      return;
    }
    if (!propertyData.area || propertyData.area <= 0) {
      toast.error("Area must be greater than 0.");
      setSubmitting(false);
      return;
    }
    if (!propertyData.location.city.trim() || !propertyData.location.state.trim()) {
      toast.error("City and State are required.");
      setSubmitting(false);
      return;
    }
    if (propertyData.type === 'land' && !propertyData.landCategory) {
        toast.error("Land category is required for land properties.");
        setSubmitting(false);
        return;
    }
    if (previewImages.length === 0) {
      toast.error("At least one image is required for the property.");
      setSubmitting(false);
      return;
    }


    try {
      // Create FormData to handle file uploads
      const formData = new FormData();

      // Append all property data fields
      for (const key in propertyData) {
        if (key === "location") {
          formData.append("location[state]", propertyData.location.state);
          formData.append("location[city]", propertyData.location.city);
          if (propertyData.location.lat !== undefined) formData.append("location[lat]", propertyData.location.lat.toString());
          if (propertyData.location.lng !== undefined) formData.append("location[lng]", propertyData.location.lng.toString());
        } else if (key === "images") {
          // Append existing image URLs
          propertyData.images.forEach((url) => formData.append("existingImages[]", url));
        } else if (propertyData[key as keyof Property] !== undefined && propertyData[key as keyof Property] !== null) {
          formData.append(key, String(propertyData[key as keyof Property]));
        }
      }

      // Append new image files
      imageFiles.forEach((file) => {
        formData.append("newImages", file);
      });

      // Send PUT request to update the property
       await axios.put(
        `/api/user/properties/${propertyId}`, // Your PUT route
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Important for file uploads
          },
        }
      );

      toast.success("Property updated successfully!");
      router.push("/user/properties"); // Redirect to manage page
    } catch (err) {
      console.error("Error updating property:", err);
      setError(
         "Failed to update property. Please try again."
      );
      toast.error(
       "Failed to update property."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-80px)] bg-gray-50 text-[#2180d3]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#2180d3]"></div>
        <p className="mt-4 text-lg font-medium">Loading property details...</p>
      </div>
    );
  }

  if (error && !propertyData._id) { // Only show error if we failed to load initial data
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-gray-50 text-red-600 p-6">
        <p className="text-2xl font-bold mb-4">Oops! Something went wrong.</p>
        <p className="text-lg text-center mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()} // Simple reload to retry fetching
          className="px-8 py-3 bg-[#2180d3] text-white rounded-full hover:bg-[#1a9a97] transition-all duration-300 ease-in-out shadow-lg"
        >
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Retry Loading
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-[calc(100vh-80px)] font-sans">
      <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 text-center leading-tight">
        Edit Property Listing
      </h1>
      <p className="text-lg text-gray-600 mb-10 text-center max-w-3xl mx-auto">
        Update the details of your property to keep your listing accurate and attractive.
      </p>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto">
        {/* Basic Details */}
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-[#2180d3] pb-3">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label htmlFor="title" className="block text-gray-700 font-medium mb-2">Property Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={propertyData.title}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#2180d3] focus:border-transparent transition-all duration-200"
                placeholder="e.g., Spacious 3BHK Apartment"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="username" className="block text-gray-700 font-medium mb-2">Your Name</label>
              <input
                type="text"
                id="username"
                name="username"
                value={propertyData.username}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#2180d3] focus:border-transparent transition-all duration-200"
                placeholder="Your contact name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="contact" className="block text-gray-700 font-medium mb-2">Contact Number</label>
              <input
                type="tel"
                id="contact"
                name="contact"
                value={propertyData.contact}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#2180d3] focus:border-transparent transition-all duration-200"
                placeholder="+91 9876543210"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="address" className="block text-gray-700 font-medium mb-2">Full Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={propertyData.address}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#2180d3] focus:border-transparent transition-all duration-200"
                placeholder="Street, Locality, Landmark"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="type" className="block text-gray-700 font-medium mb-2">Property Type</label>
              <select
                id="type"
                name="type"
                value={propertyData.type}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#2180d3] focus:border-transparent bg-white appearance-none pr-8 transition-all duration-200"
                required
              >
                <option value="building">Building (House, Apartment, Villa)</option>
                <option value="land">Land (Plot, Agricultural)</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="transactionType" className="block text-gray-700 font-medium mb-2">Transaction Type</label>
              <select
                id="transactionType"
                name="transactionType"
                value={propertyData.transactionType}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#2180d3] focus:border-transparent bg-white appearance-none pr-8 transition-all duration-200"
                required
              >
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="price" className="block text-gray-700 font-medium mb-2">Price (INR)</label>
              <input
                type="number"
                id="price"
                name="price"
                value={propertyData.price}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#2180d3] focus:border-transparent transition-all duration-200"
                min="0"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="discount" className="block text-gray-700 font-medium mb-2">Discount (%)</label>
              <input
                type="number"
                id="discount"
                name="discount"
                value={propertyData.discount}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#2180d3] focus:border-transparent transition-all duration-200"
                min="0"
                max="100"
              />
            </div>
          </div>
        </div>

        {/* Location Details */}
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-[#2180d3] pb-3">Location Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label htmlFor="state" className="block text-gray-700 font-medium mb-2">State</label>
              <input
                type="text"
                id="state"
                name="location.state"
                value={propertyData.location.state}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#2180d3] focus:border-transparent transition-all duration-200"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="city" className="block text-gray-700 font-medium mb-2">City</label>
              <input
                type="text"
                id="city"
                name="location.city"
                value={propertyData.location.city}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#2180d3] focus:border-transparent transition-all duration-200"
                required
              />
            </div>
          </div>
        </div>

        {/* Specific Details based on Property Type */}
        {propertyData.type === "building" && (
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-[#2180d3] pb-3">Building Specifics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label htmlFor="floors" className="block text-gray-700 font-medium mb-2">Floors</label>
                <input
                  type="number"
                  id="floors"
                  name="floors"
                  value={propertyData.floors ?? ""}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#2180d3] focus:border-transparent transition-all duration-200"
                  min="0"
                />
              </div>
              <div className="form-group">
                <label htmlFor="parking" className="block text-gray-700 font-medium mb-2">Parking Spots</label>
                <input
                  type="number"
                  id="parking"
                  name="parking"
                  value={propertyData.parking ?? ""}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#2180d3] focus:border-transparent transition-all duration-200"
                  min="0"
                />
              </div>
              <div className="form-group">
                <label htmlFor="bedrooms" className="block text-gray-700 font-medium mb-2">Bedrooms</label>
                <input
                  type="text"
                  id="bedrooms"
                  name="bedrooms"
                  value={propertyData.bedrooms ?? ""}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#2180d3] focus:border-transparent transition-all duration-200"
                  placeholder="e.g., 3, 2BHK"
                />
              </div>
              <div className="form-group">
                <label htmlFor="bathrooms" className="block text-gray-700 font-medium mb-2">Bathrooms</label>
                <input
                  type="text"
                  id="bathrooms"
                  name="bathrooms"
                  value={propertyData.bathrooms ?? ""}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#2180d3] focus:border-transparent transition-all duration-200"
                  placeholder="e.g., 2, 2 attached"
                />
              </div>
              <div className="form-group">
                <label htmlFor="propertyAge" className="block text-gray-700 font-medium mb-2">Property Age</label>
                <select
                  id="propertyAge"
                  name="propertyAge"
                  value={propertyData.propertyAge ?? ""}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#2180d3] focus:border-transparent bg-white appearance-none pr-8 transition-all duration-200"
                >
                  <option value="">Select Age</option>
                  <option value="New">New</option>
                  <option value="<5 Years">&lt;5 Years</option>
                  <option value="5-10 Years">5-10 Years</option>
                  <option value=">10 Years">&gt;10 Years</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="furnishing" className="block text-gray-700 font-medium mb-2">Furnishing</label>
                <select
                  id="furnishing"
                  name="furnishing"
                  value={propertyData.furnishing ?? ""}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#2180d3] focus:border-transparent bg-white appearance-none pr-8 transition-all duration-200"
                >
                  <option value="">Select Furnishing</option>
                  <option value="Unfurnished">Unfurnished</option>
                  <option value="Semi-furnished">Semi-furnished</option>
                  <option value="Fully-furnished">Fully-furnished</option>
                </select>
              </div>
              <div className="form-group md:col-span-2">
                <label htmlFor="facing" className="block text-gray-700 font-medium mb-2">Facing Direction</label>
                <select
                  id="facing"
                  name="facing"
                  value={propertyData.facing ?? "Not Specified"}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#2180d3] focus:border-transparent bg-white appearance-none pr-8 transition-all duration-200"
                >
                  <option value="Not Specified">Not Specified</option>
                  <option value="North">North</option>
                  <option value="South">South</option>
                  <option value="East">East</option>
                  <option value="West">West</option>
                  <option value="North-East">North-East</option>
                  <option value="North-West">North-West</option>
                  <option value="South-East">South-East</option>
                  <option value="South-West">South-West</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {propertyData.type === "land" && (
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-[#2180d3] pb-3">Land Specifics</h2>
            <div className="form-group">
              <label htmlFor="landCategory" className="block text-gray-700 font-medium mb-2">Land Category</label>
              <select
                id="landCategory"
                name="landCategory"
                value={propertyData.landCategory ?? ""}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#2180d3] focus:border-transparent bg-white appearance-none pr-8 transition-all duration-200"
                required={propertyData.type === 'land'}
              >
                <option value="">Select Category</option>
                <option value="Agricultural">Agricultural</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>
          </div>
        )}

        {/* Area Details */}
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-[#2180d3] pb-3">Area Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label htmlFor="area" className="block text-gray-700 font-medium mb-2">Area</label>
              <input
                type="number"
                id="area"
                name="area"
                value={propertyData.area}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#2180d3] focus:border-transparent transition-all duration-200"
                min="0"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="areaUnit" className="block text-gray-700 font-medium mb-2">Area Unit</label>
              <select
                id="areaUnit"
                name="areaUnit"
                value={propertyData.areaUnit}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#2180d3] focus:border-transparent bg-white appearance-none pr-8 transition-all duration-200"
                required
              >
                <option value="sqft">Sq. Ft.</option>
                <option value="sqyd">Sq. Yd.</option>
                <option value="sqm">Sq. M.</option>
                <option value="acres">Acres</option>
              </select>
            </div>
          </div>
        </div>

        {/* Description & Other Details */}
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-[#2180d3] pb-3">Additional Information</h2>
          <div className="form-group mb-6">
            <label htmlFor="description" className="block text-gray-700 font-medium mb-2">Description</label>
            <textarea
              id="description"
              name="description"
              value={propertyData.description ?? ""}
              onChange={handleChange}
              rows={5}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#2180d3] focus:border-transparent transition-all duration-200"
              placeholder="Provide a detailed description of the property..."
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="otherDetails" className="block text-gray-700 font-medium mb-2">Other Details (Optional)</label>
            <textarea
              id="otherDetails"
              name="otherDetails"
              value={propertyData.otherDetails ?? ""}
              onChange={handleChange}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#2180d3] focus:border-transparent transition-all duration-200"
              placeholder="Any other relevant information..."
            ></textarea>
          </div>
        </div>

        
         <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPremium"
              name="isPremium"
              checked={propertyData.isPremium}
              onChange={handleChange}
              className="h-5 w-5 text-[#20b4b1] rounded border-gray-300 focus:ring-[#2180d3] cursor-pointer"
            />
            <label htmlFor="isPremium" className="ml-3 block text-lg font-medium text-gray-800 cursor-pointer">
              Mark as **Premium Listing** (Higher Visibility)
            </label>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-[#2180d3] pb-3">Property Images</h2>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="imageUpload">Upload New Images</label>
            <input
              type="file"
              id="imageUpload"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-[#2180d3] file:text-[#fff]
                hover:file:bg-[#1a6cb2] cursor-pointer"
            />
            <p className="mt-2 text-sm text-gray-500">Add up to 5 images (JPG, PNG) for your listing.</p>
          </div>

          {previewImages.length > 0 && (
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {previewImages.map((imageSrc, index) => (
                <div key={index} className="relative group w-full h-40 rounded-lg overflow-hidden shadow-sm border border-gray-200 flex items-center justify-center bg-gray-100">
                  <img
                    src={imageSrc}
                    alt={`Property image ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index, index < propertyData.images.length)}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    title="Remove image"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
          {previewImages.length === 0 && (
            <p className="text-base text-red-500 mt-4 p-3 bg-red-50 rounded-md border border-red-200">
              <span className="font-semibold">Important:</span> At least one image is required for the property listing.
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-6">
          <button
            type="submit"
            disabled={submitting || previewImages.length === 0}
            className={`px-10 py-4 rounded-full text-white font-bold text-lg shadow-lg transition-all duration-300 ease-in-out transform
              ${submitting || previewImages.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#2180d3] hover:bg-[#1a6cb2] hover:scale-105"
              }
              flex items-center justify-center
            `}
          >
            {submitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}