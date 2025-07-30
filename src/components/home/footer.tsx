"use client";

import Image from "next/image";
import Link from "next/link";
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#155a96] text-white py-10 md:py-16 mt-20 relative overflow-hidden">
      {/* Subtle background pattern/gradient for visual interest */}
      <div className="absolute inset-0 opacity-10">
        <svg
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <pattern
            id="stripes"
            patternUnits="userSpaceOnUse"
            width="40"
            height="40"
            patternTransform="rotate(45)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="40"
              stroke="#ffffff"
              strokeWidth="1"
            />
          </pattern>
          <rect width="100%" height="100%" fill="url(#stripes)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 md:gap-y-12">
        {/* Brand & Description - Stays as a single column on all screen sizes */}
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-3 mb-4 md:mb-5">
            <Image
              src="/images/navlogo.png"
              alt="Ploteasy Logo"
              width={36}
              height={36}
              className="rounded-lg shadow-lg"
            />
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Ploteasy
            </h2>
          </div>
          <p className="text-gray-200 text-sm md:text-base leading-relaxed">
            Discover, list, and manage properties with ease. Whether buying,
            renting, or selling — we&apos;re your trusted real estate partner,
            dedicated to simplifying your property journey.
          </p>
        </div>

      
        <div className="flex flex-col sm:flex-row gap-y-10 sm:gap-x-8 md:col-span-2">
          {/* Quick Links */}
          

          {/* Contact Info */}
          <div className="flex-1"> {/* flex-1 makes it take equal width in the flex row */}
            <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-5 border-b-2 border-[#2e7bbd] pb-2 inline-block">
              Contact Us
            </h3>
            <ul className="space-y-3 md:space-y-4 text-gray-100 text-sm md:text-base">
              <li className="flex items-start gap-3">
                <EnvelopeIcon className="w-5 h-5 md:w-6 md:h-6 text-[#bcdfff]" />
                <a
                  href="mailto:support@ploteasy.com"
                  className="hover:text-[#bcdfff]"
                >
                  support@ploteasy.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <PhoneIcon className="w-5 h-5 md:w-6 md:h-6 text-[#bcdfff]" />
                <a
                  href="tel:+919876543210"
                  className="hover:text-[#bcdfff]"
                >
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPinIcon className="w-5 h-5 md:w-6 md:h-6 text-[#bcdfff]" />
                <span>Hyderabad, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Links - Remains a single column in the main grid */}
        <div>
          <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-5 border-b-2 border-[#2e7bbd] pb-2 inline-block">
            Connect With Us
          </h3>
          <div className="flex gap-3 sm:gap-4 mt-4">
            <a
              href="#"
              aria-label="Facebook"
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-[#2e7bbd] hover:bg-[#bcdfff] text-white hover:text-[#155a96] transition duration-300 shadow-md"
            >
              <FaFacebookF size={18} />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-[#2e7bbd] hover:bg-[#bcdfff] text-white hover:text-[#155a96] transition duration-300 shadow-md"
            >
              <FaTwitter size={18} />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-[#2e7bbd] hover:bg-[#bcdfff] text-white hover:text-[#155a96] transition duration-300 shadow-md"
            >
              <FaInstagram size={18} />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-[#2e7bbd] hover:bg-[#bcdfff] text-white hover:text-[#155a96] transition duration-300 shadow-md"
            >
              <FaLinkedinIn size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#2e7bbd] mt-10 md:mt-16 pt-6 pb-3 text-xs md:text-sm text-gray-200 text-center relative z-10 px-4">
        <p className="mb-2">
          &copy; {new Date().getFullYear()} Ploteasy. All rights reserved.
        </p>
        <div className="flex justify-center gap-4 md:gap-6 flex-wrap">
          <Link href="/privacy" className="hover:text-white transition">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-white transition">
            Terms of Service
          </Link>
          <Link href="/sitemap.xml" className="hover:text-white transition">
            Sitemap
          </Link>
        </div>
      </div>
    </footer>
  );
}