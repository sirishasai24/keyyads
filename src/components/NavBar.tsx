"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { UserButton } from "./UserButton";
import {
  Bars3Icon,
  XMarkIcon,
  PlusIcon,
  HomeIcon,
  KeyIcon,
  ClipboardDocumentListIcon,
  UserIcon,
  SparklesIcon,
  DocumentTextIcon, // Icon for Blog
  ChatBubbleBottomCenterTextIcon, // Icon for Testimonials
  PhoneIcon, // Import PhoneIcon for Contact Us
} from "@heroicons/react/24/solid"; // Ensuring solid icons for consistency
import { FaRupeeSign } from "react-icons/fa"; // Import the Rupee icon

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/auth/me");
        setUser(res.data?.user || null);
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-[#2180d3] to-[#2180d3] shadow">
      {/* Absolute div for potential background effects, currently empty leading-[0] */}
      <div className="absolute top-full left-0 w-full overflow-hidden leading-[0]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between relative z-10">
        {/* Brand Logo and Name - Adjusted for alignment */}
        {/* Added mr-auto to push the right-aligned content further right */}
        <Link href="/" className="flex items-center text-2xl font-bold text-white mr-auto md:mr-0">
          <Image
            src="/images/navlogo.png"
            alt="Keyyards Logo"
            width={25}
            height={25}
            className="rounded-md"
            priority
          />
          <span className="inline-block ml-2">Keyyards</span>
        </Link>

        {/* Desktop Navigation Links */}
        {/* Increased space-x to space-x-5 for slightly tighter packing to fit "Contact Us" */}
        <div className="hidden md:flex items-center space-x-5">
          <Link
            href="/"
            className="text-white hover:text-gray-200 flex items-center gap-1"
          >
            <HomeIcon className="w-5 h-5" />
            Home
          </Link>
          <Link
            href="/property?transactionType=sale"
            className="text-white hover:text-gray-200 flex items-center gap-1"
          >
            <FaRupeeSign className="w-4 h-4" />
            Buy
          </Link>
          <Link
            href="/property?transactionType=rent"
            className="text-white hover:text-gray-200 flex items-center gap-1"
          >
            <KeyIcon className="w-5 h-5" />
            Rent
          </Link>
          <Link
            href="/user/blogs"
            className="text-white hover:text-gray-200 flex items-center gap-1"
          >
            <DocumentTextIcon className="w-5 h-5" />
            Blog
          </Link>
          <Link
            href="/user/testimonials"
            className="text-white hover:text-gray-200 flex items-center gap-1"
          >
            <ChatBubbleBottomCenterTextIcon className="w-5 h-5" />
            Testimonials
          </Link>
          {/* Contact Us Link for Desktop */}
          <Link
            href="/user/prime"
            className="text-white hover:text-gray-200 flex items-center gap-1"
          >
            <SparklesIcon className="w-5 h-5" />
            Prime Plan
          </Link>
          {user && (
            <Link
              href="/user/properties"
              className="text-white hover:text-gray-200 flex items-center gap-1"
            >
              <ClipboardDocumentListIcon className="w-5 h-5" />
              Manage Properties
            </Link>
          )}
          {/* <Link
            href="/contact"
            className="text-white hover:text-gray-200 flex items-center gap-1"
          >
            <PhoneIcon className="w-5 h-5" />
            Contact Us
          </Link> */}
          <Link
            href="/property/add"
            className="bg-white text-[#2180d3] px-4 py-2 rounded-lg hover:bg-gray-100 transition flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Post Property
          </Link>
          {user ? (
            <UserButton />
          ) : (
            <Link
              href="/auth"
              className="border border-white text-white px-4 py-2 rounded-lg hover:bg-white hover:text-[#1a6cb2] transition flex items-center gap-2"
            >
              <UserIcon className="w-5 h-5" />
              Login
            </Link>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
          >
            {isOpen ? (
              <XMarkIcon className="w-6 h-6 text-white" />
            ) : (
              <Bars3Icon className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isOpen
            ? "max-h-[500px] overflow-visible py-4 px-6"
            : "max-h-0 overflow-hidden px-6"
        } bg-gradient-to-br from-[#2180d3] to-[#2180d3] shadow-inner`}
      >
        <div className="flex flex-col space-y-4 text-base text-white font-medium">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="hover:text-gray-200 flex items-center gap-2"
          >
            <HomeIcon className="w-5 h-5" />
            Home
          </Link>
          <Link
            href="/property?transactionType=sale"
            onClick={() => setIsOpen(false)}
            className="hover:text-gray-200 flex items-center gap-2"
          >
            <FaRupeeSign className="w-5 h-5" />
            Buy
          </Link>
          <Link
            href="/property?transactionType=rent"
            onClick={() => setIsOpen(false)}
            className="hover:text-gray-200 flex items-center gap-2"
          >
            <KeyIcon className="w-5 h-5" />
            Rent
          </Link>
          <Link
            href="/user/blogs"
            onClick={() => setIsOpen(false)}
            className="hover:text-gray-200 flex items-center gap-2"
          >
            <DocumentTextIcon className="w-5 h-5" />
            Blog
          </Link>
          <Link
            href="/user/testimonials"
            onClick={() => setIsOpen(false)}
            className="hover:text-gray-200 flex items-center gap-2"
          >
            <ChatBubbleBottomCenterTextIcon className="w-5 h-5" />
            Testimonials
          </Link>
          {/* Contact Us Link for Mobile */}
          <Link
            href="/user/prime"
            onClick={() => setIsOpen(false)}
            className="hover:text-gray-200 flex items-center gap-2"
          >
            <SparklesIcon className="w-5 h-5" />
            Prime Plan
          </Link>
          {user && (
            <Link
              href="/user/properties"
              onClick={() => setIsOpen(false)}
              className="hover:text-gray-200 flex items-center gap-2"
            >
              <ClipboardDocumentListIcon className="w-5 h-5" />
              Manage Properties
            </Link>
          )}
          <Link
            href="/contact"
            onClick={() => setIsOpen(false)}
            className="hover:text-gray-200 flex items-center gap-2"
          >
            <PhoneIcon className="w-5 h-5" />
            Contact Us
          </Link>
          <hr className="border-gray-300 my-4" />
          <Link
            href="/property/add"
            onClick={() => setIsOpen(false)}
            className="text-[#2180d3] bg-white py-2 rounded-md text-center hover:bg-gray-100 flex items-center justify-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Post Property
          </Link>
          {user ? (
            <div
              className="flex justify-center mt-2 relative z-20"
              onClick={(e) => e.stopPropagation()}
            >
              <UserButton />
            </div>
          ) : (
            <Link
              href="/auth"
              onClick={() => setIsOpen(false)}
              className="text-white border border-white py-2 text-center rounded-md hover:bg-white hover:text-[#20b4b1] flex items-center justify-center gap-2"
            >
              <UserIcon className="w-5 h-5" />
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}