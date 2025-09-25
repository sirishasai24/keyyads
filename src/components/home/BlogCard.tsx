import React from 'react';
import Link from 'next/link';
import Image from 'next/image';


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
// Helper function to truncate text
const truncateText = (text: string, wordLimit: number) => {
  const words = text.split(' ');
  if (words.length <= wordLimit) {
    return text;
  }
  return words.slice(0, wordLimit).join(' ') + '...';
};

// Helper function to format date
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric'
    });
}

export const BlogCard = ({ blog }: { blog: IBlog }) => {
  return (
    <Link href={`/user/blogs/${blog._id}`} className="group block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden h-full transition-shadow duration-300 group-hover:shadow-xl">
        <div className="relative w-full h-48">
          <Image
            src={blog.coverImageURL}
            alt={blog.title}
            fill
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-tight">
            {blog.title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
            {truncateText(blog.body, 25)} {/* Truncates body to 25 words */}
          </p>
          <div className="border-t border-gray-200 pt-4 flex justify-between items-center text-xs text-gray-500 font-medium">
            <span>{blog.createdBy?.username || 'Anonymous'}</span>
            <span>{formatDate(blog.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};