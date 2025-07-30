"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AddBlog() {
  const router = useRouter();
  const [blog, setBlog] = useState({
    title: "",
    body: "",
    coverImageURL: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const primaryColor = "#2180d3"; 
  const secondaryColor = "#1a66a7"; 

  const handleImageURL = async (): Promise<string | null> => {
    if (!image) {
      console.error("No image selected.");
      toast.error("Please select a cover image for your blog.");
      return null;
    }

    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        try {
          const base64Image = reader.result;
          const response = await fetch("/api/admin/image/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: base64Image }),
          });

          const data = await response.json();
          if (data.success) {
            resolve(data.secure_url);
          } else {
            reject(new Error(data.error));
            toast.error("Failed to upload image. Please try again.");
          }
        } catch (err) {
          console.error("Error uploading image:", err);
          reject(err);
          toast.error("An error occurred during image upload.");
        }
      };

      reader.onerror = (error) => {
        console.error("FileReader error:", error);
        reject(error);
        toast.error("File reading error. Please try again.");
      };

      reader.readAsDataURL(image);
    });
  };

  const onAddBlog = async () => {
    setLoading(true);
    try {
      const url = await handleImageURL();
      if (!url) {
        console.error("Failed to upload image");
        setLoading(false);
        return;
      }

      const updatedBlog = { ...blog, coverImageURL: url };
      const response = await axios.post("/api/admin/addBlog", updatedBlog);
      const id = response.data.blog._id;
      toast.success("Blog created successfully!");
      router.push(`/admin/blog/${id}`);
    } catch (error) {
      console.log("Error", error);
      toast.error("Failed to create blog. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center px-4 sm:px-6 py-8">
        {/* Main card container, now slightly more compact */}
        <div className="w-full max-w-4xl p-5 sm:p-7 bg-white rounded-xl shadow-xl border border-gray-100 transform transition-all duration-300 hover:shadow-2xl">
          <h1 className="text-2xl font-extrabold text-center mb-6 flex items-center justify-center gap-2" style={{ color: primaryColor }}>
            {/* Icon for blog post */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14.25v4.75a2 2 0 01-2 2H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
            Create Your Blog Post
          </h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onAddBlog();
            }}
            className="flex flex-col md:flex-row gap-5"
          >
            {/* Left section: Title and Image */}
            <div className="flex-1 space-y-5">
              <div className="space-y-1.5">
                <label
                  htmlFor="title"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Blog Title
                </label>
                <input
                  onChange={(e) => setBlog({ ...blog, title: e.target.value })}
                  type="text"
                  id="title"
                  name="title"
                  className="w-full px-3.5 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2180d3] focus:border-[#2180d3] transition-all duration-200 text-gray-800 shadow-sm text-sm outline-none hover:border-gray-400"
                  placeholder="Enter your compelling blog title"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="coverImage"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Cover Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 space-y-2 bg-gray-50 hover:bg-gray-100 transition-all duration-200 shadow-sm flex flex-col items-center justify-center cursor-pointer">
                  {/* Icon for image upload */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-9 h-9 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                  <span className="text-gray-500 text-xs font-medium">Drag & drop or <label htmlFor="coverImage" className="hover:underline cursor-pointer" style={{ color: primaryColor }}>browse</label> to upload</span>
                  <input
                    onChange={handleImageChange}
                    type="file"
                    id="coverImage"
                    name="coverImage"
                    className="hidden" // Hide the default input to style the custom area
                    accept="image/*"
                    required // Added required to ensure an image is selected
                  />
                  {imagePreview && (
                    <div className="mt-3 w-full flex justify-center">
                      <img
                        src={imagePreview}
                        alt="Cover Image Preview"
                        className="max-w-full h-auto max-h-36 rounded-md shadow-md border border-gray-200 object-cover w-full"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right section: Blog Content */}
            <div className="flex-1 space-y-1.5">
              <label
                htmlFor="body"
                className="block text-sm font-semibold text-gray-700"
              >
                Blog Content
              </label>
              <textarea
                onChange={(e) => setBlog({ ...blog, body: e.target.value })}
                id="body"
                name="body"
                rows={12}
                className="w-full px-3.5 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2180d3] focus:border-[#2180d3] transition-all duration-200 text-gray-800 shadow-sm text-sm outline-none hover:border-gray-400"
                placeholder="Write your insightful blog content here..."
                required
              ></textarea>
            </div>
          </form>

          {/* Submit button */}
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={loading}
              onClick={onAddBlog}
              className="w-full sm:w-auto px-7 py-2.5 text-white font-bold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-base flex items-center justify-center gap-2"
              style={{
                background: loading
                  ? "#a0a0a0" // A neutral color when disabled
                  : `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
                boxShadow: loading
                  ? "none"
                  : `0 4px 15px rgba(33, 128, 211, 0.4)` // Adjusted shadow for depth
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  (e.currentTarget as HTMLElement).style.background = `linear-gradient(to right, ${secondaryColor}, ${primaryColor})`;
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  (e.currentTarget as HTMLElement).style.background = `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`;
                }
              }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Publishing Blog...</span>
                </>
              ) : (
                <>
                  {/* Icon for publishing */}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M12 1.5a.75.75 0 01.75.75V7.5h-1.5V2.25a.75.75 0 01.75-.75zM11.25 7.5v5.69l-1.72-1.72a.75.75 0 00-1.06 1.06l3 3a.75.75 0 001.06 0l3-3a.75.75 0 10-1.06-1.06l-1.72 1.72V7.5h3.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V10.5a3 3 0 013-3H9.75z" />
                  </svg>
                  <span>Publish Blog</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}