import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { BlogCard } from './BlogCard';

// In both LatestUpdates.tsx and BlogCard.tsx

interface IBlog {
  _id: string;
  title: string;
  body: string;
  coverImageURL: string;
  createdBy: {
    _id: string;
    username: string; // CHANGED: from fullName to username
  } | null;
  slug?: string;
  createdAt: string;
  updatedAt: string;
}

export const LatestUpdates: React.FC = () => {
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('/api/user/blogs/home');
        setBlogs(response.data?.blogs || []);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Failed to load blogs.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllBlogs();
  }, []);

  return (
    <section className="bg-gray-50 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Latest updates
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              Get all the current updates of our pride Real Estate
            </p>
          </div>
          <Link
            href="/user/blogs"
            className="hidden sm:inline-block bg-gray-900 text-white font-semibold px-6 py-2.5 rounded-full shadow-sm transition-colors hover:bg-gray-700"
          >
            View more articles &gt;
          </Link>
        </div>

        {/* Blog Grid / States */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading articles...</p>
          </div>
        )}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        )}
        {!loading && !error && blogs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}
        {!loading && !error && blogs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No articles found.</p>
          </div>
        )}

        {/* Mobile "View More" Button */}
        <div className="mt-12 text-center sm:hidden">
          <Link
            href="/user/blogs"
            className="inline-block bg-gray-900 text-white font-semibold px-6 py-2.5 rounded-full shadow-sm transition-colors hover:bg-gray-700"
          >
            View more articles &gt;
          </Link>
        </div>
      </div>
    </section>
  );
};
