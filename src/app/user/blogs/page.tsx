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
  const [allBlogs, setAllBlogs] = useState<Blog[]>([]); // Stores all fetched blogs
  const [currentBlogs, setCurrentBlogs] = useState<Blog[]>([]); // Blogs for the current page
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [blogsPerPage] = useState(5); // Fixed: 5 blogs per page

  useEffect(() => {
    const fetchAllBlogs = async () => {
      try {
        setLoading(true);
        setError(null); // Clear any previous errors
        const response = await axios.get("/api/user/blogs");
        // Assuming the API always returns ALL blogs without pagination
        setAllBlogs(response.data?.blogs || []);
      } catch (err) {
        setError("Failed to load blogs.");
        console.error("Error fetching all blogs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllBlogs();
  }, []); // Empty dependency array means this runs once on mount

  // Effect to update currentBlogs when allBlogs or currentPage changes
  useEffect(() => {
    const indexOfLastBlog = currentPage * blogsPerPage;
    const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
    // Ensure blogs are sorted if not already from API (e.g., newest first)
    const sortedBlogs = [...allBlogs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setCurrentBlogs(sortedBlogs.slice(indexOfFirstBlog, indexOfLastBlog));
  }, [allBlogs, currentPage, blogsPerPage]);

  const totalPages = Math.ceil(allBlogs.length / blogsPerPage);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return; // Prevent invalid page numbers
    setCurrentPage(pageNumber);
    // Scroll to top of the blog section or page on page change for better UX
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

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <motion.div
          className="w-16 h-16 border-4 border-[#2180d3] border-t-transparent rounded-full animate-spin"
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
        className="text-4xl font-extrabold text-center text-[#2180d3] mb-12"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        Keyyards Insights
      </motion.h1>

      {/* Conditional rendering for no blogs found */}
      {currentBlogs.length === 0 && !loading && !error && allBlogs.length === 0 ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <p className="text-gray-600 text-xl">No blogs found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentBlogs.map((blog) => (
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
                <h2 className="text-xl font-semibold text-[#2180d3] mb-2">
                  {blog.title}
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                  {blog.body.substring(0, 100)}...
                </p>
                <p className="text-gray-400 text-xs mb-4">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </p>
                <a
                  href={`/user/blogs/${blog._id}`}
                  className="mt-auto inline-block text-center text-white bg-[#2180d3] px-4 py-2 rounded-lg hover:bg-[#1a66a7] transition"
                >
                  Read More
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Only display pagination if there's more than one page */}
      {totalPages > 1 && renderPaginationButtons()}
    </div>
  );
};

export default Home;