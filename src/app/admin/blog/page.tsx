"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

interface Blog {
  _id: string;
  title: string;
  body: string;
  createdAt: string;
  coverImageURL: string;
}

const Home = () => {
  const primaryColor = "#2180d3"; // New theme color

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("/api/admin/blog");
        setBlogs(response.data?.blogs || []);
      } catch (err: any) {
        setError("Failed to load blogs");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <motion.div
          className="w-16 h-16 border-4 border-[#2180d3] border-t-transparent rounded-full animate-spin" // Updated color
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        />
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen px-4 md:px-12 py-10">
      <motion.h1
        className="text-4xl font-extrabold text-center text-[#2180d3] mb-12" // Updated color
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        Ploteasy Insights
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <motion.div
            key={blog._id}
            className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="relative h-52 w-full">
              <img
                src={blog.coverImageURL}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <h2 className="text-xl font-semibold text-[#2180d3] mb-2"> {/* Updated color */}
                {blog.title}
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                {blog.body.substring(0, 100)}...
              </p>
              <p className="text-gray-400 text-xs mb-4">
                {new Date(blog.createdAt).toLocaleDateString()}
              </p>
              <a
                href={`/admin/blog/${blog._id}`}
                className="mt-auto inline-block text-center text-white bg-[#2180d3] px-4 py-2 rounded-lg hover:bg-[#1a66a7] transition" // Updated colors
              >
                Read More
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Home;