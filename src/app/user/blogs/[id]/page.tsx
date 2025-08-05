"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  FaCalendarAlt,
  FaUserCircle,
  FaQuoteLeft,
  FaClock,
  FaTrashAlt,
} from "react-icons/fa";
import ConfirmationModal from "@/components/BlogConfirmationModal";

interface Blog {
  title: string;
  body: string;
  coverImageURL: string;
  createdAt: string;
}

interface User {
  _id: string;
  username: string;
  email: string;
  profileImageURL?: string;
}

interface BlogUser {
  _id: string;  
  username: string;
  email: string;
  profileImageURL?: string;
}

export default function Blog() {
  const { id } = useParams();
  const [blog, setBlog] = useState<Blog>();
  const [user, setUser] = useState<User>();
  const [blogUser, setBlogUser] = useState<BlogUser>();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const primaryColor = "#2180d3"; // Define the primary color

  const fetchBlog = async () => {
    try {
      const response = await axios.get(`/api/user/blogs/${id}`);
      setBlog(response.data.blog);
      setBlogUser(response.data.user);
    } catch (err) {
      console.error("Error fetching blog:", err);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await axios.get("/api/auth/me");
      setUser(response.data.user);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteBlog = async () => {
    setLoading(true);
    try {
      await axios.delete(`/api/deleteBlog/${id}`);
      window.location.href = "/";
    } catch (error) {
      console.error("Error deleting blog:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateReadingTime = () => {
    const words = blog?.body?.split(/\s+/).length || 0;
    return Math.ceil(words / 200);
  };

  useEffect(() => {
    if (id) {
      fetchBlog();
      fetchUser();
    }
  }, [id]);

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white" style={{ color: primaryColor }}>
        <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mb-4" style={{ borderColor: primaryColor, borderTopColor: 'transparent' }} />
        <p className="text-xl font-semibold">Loading blog...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 text-gray-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        <header className="text-center">
          <h1
            className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(to right, ${primaryColor}, #1a66a7)`, // Gradient using primaryColor
            }}
          >
            {blog.title}
          </h1>
          <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <FaCalendarAlt />
              <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaUserCircle />
              <Link href={`/profile/${blogUser?._id}`}>
                <span className="font-medium hover:underline" style={{ color: primaryColor }}>
                  {blogUser?.username}
                </span>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <FaClock />
              <span>{calculateReadingTime()} min read</span>
            </div>
          </div>
        </header>

        <div className="relative rounded-2xl overflow-hidden group shadow-xl">
          <img
            src={blog.coverImageURL}
            alt={blog.title}
            className="w-full h-auto max-h-[450px] object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent group-hover:from-black/30 transition duration-300" />
        </div>

        {blogUser && blogUser._id === user?._id && (
          <div className="text-center">
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white bg-red-600 hover:bg-red-700 transition shadow-lg"
            >
              <FaTrashAlt />
              Delete Blog
            </button>
          </div>
        )}

        {loading && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: primaryColor, borderTopColor: 'transparent' }} />
          </div>
        )}

        <section className="space-y-6">
          {blog.body.split("\n\n").map((section: string, index: number) => (
            <div
              key={index}
              className="p-6 bg-white rounded-xl shadow transition hover:shadow-lg"
            >
              {index % 2 === 0 ? (
                <p className="text-gray-800 text-lg leading-relaxed">{section}</p>
              ) : (
                <blockquote className="italic border-l-4 pl-4 text-base" style={{ borderColor: primaryColor, color: primaryColor }}>
                  <FaQuoteLeft className="inline mr-2" />
                  {section}
                </blockquote>
              )}
            </div>
          ))}
        </section>

        <footer className="mt-12 flex items-center gap-4 p-6 bg-white rounded-xl shadow" style={{ borderColor: `${primaryColor}30`, border: `1px solid ${primaryColor}30` }}>
          {blogUser?.profileImageURL && (
            <img
              src={blogUser.profileImageURL}
              alt={blogUser.username}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 object-cover"
              style={{ borderColor: primaryColor }}
            />
          )}
          <div>
            {blogUser && (
              <Link href={`/profile/${blogUser._id}`}>
                <h3 className="text-lg font-semibold hover:underline" style={{ color: primaryColor }}>
                  {blogUser.username}
                </h3>
              </Link>
            )}
            <p className="text-sm text-gray-600">{blogUser?.email}</p>
          </div>
        </footer>
      </div>

      <ConfirmationModal
        showModal={showModal}
        onConfirm={deleteBlog}
        onCancel={() => setShowModal(false)}
      />
    </div>
  );
}