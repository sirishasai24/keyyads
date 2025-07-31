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
    <footer className="bg-[#155a96] text-white py-8 md:py-12 mt-12 relative overflow-hidden">
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

      {/* Main content grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8 md:gap-y-10 lg:gap-x-16"> {/* Changed to lg:grid-cols-3 and increased lg:gap-x */}
        {/* Brand & Description */}
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-2 mb-3 md:mb-4">
            <Image
              src="/images/navlogo.png"
              alt="Ploteasy Logo"
              width={32}
              height={32}
              className="rounded-lg shadow-lg"
            />
            <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">
              Keyyards
            </h2>
          </div>
          <p className="text-gray-200 text-sm leading-relaxed">
            Discover, list, and manage properties with ease. Whether buying,
            renting, or selling — we&apos;re your trusted real estate partner,
            dedicated to simplifying your property journey.
          </p>
        </div>

        {/* Contact Info - This will now occupy its own column on larger screens */}
        <div className="flex flex-col"> {/* Removed sm:flex-row and md:col-span-2 from this div and its parent, as it's now a direct grid item */}
          <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 border-b-2 border-[#2e7bbd] pb-2 inline-block">
            Contact Us
          </h3>
          <ul className="space-y-2.5 md:space-y-3 text-gray-100 text-sm md:text-base">
            <li className="flex items-start gap-2.5">
              <EnvelopeIcon className="w-4 h-4 md:w-5 md:h-5 text-[#bcdfff]" />
              <a
                href="mailto: info@keyyards.in"
                className="hover:text-[#bcdfff]"
              >
                info@keyyards.in
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <PhoneIcon className="w-4 h-4 md:w-5 md:h-5 text-[#bcdfff]" />
              <a
                href="tel:+912268147080"
                className="hover:text-[#bcdfff]"
              >
                +91 22 6814 7080
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPinIcon className="w-4 h-4 md:w-5 md:h-5 text-[#bcdfff]" />
              <span>Hyderabad, India</span>
            </li>
          </ul>
        </div>

        {/* Social Links - This will also occupy its own column on larger screens */}
        <div>
          <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 border-b-2 border-[#2e7bbd] pb-2 inline-block">
            Connect With Us
          </h3>
          <div className="flex gap-2.5 sm:gap-3 mt-3">
            <a
              href="#"
              aria-label="Facebook"
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-[#2e7bbd] hover:bg-[#bcdfff] text-white hover:text-[#155a96] transition duration-300 shadow-md"
            >
              <FaFacebookF size={16} />
            </a>
            <a
              href="https://www.linkedin.com/company/keyyards"
              aria-label="Twitter"
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-[#2e7bbd] hover:bg-[#bcdfff] text-white hover:text-[#155a96] transition duration-300 shadow-md"
            >
              <FaTwitter size={16} />
            </a>
            <a
              href="https://www.linkedin.com/company/keyyards"
              aria-label="Instagram"
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-[#2e7bbd] hover:bg-[#bcdfff] text-white hover:text-[#155a96] transition duration-300 shadow-md"
            >
              <FaInstagram size={16} />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-[#2e7bbd] hover:bg-[#bcdfff] text-white hover:text-[#155a96] transition duration-300 shadow-md"
            >
              <FaLinkedinIn size={16} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#2e7bbd] mt-8 md:mt-12 pt-5 pb-2 text-xs md:text-sm text-gray-200 text-center relative z-10 px-4">
        <p className="mb-1.5">
          &copy; {new Date().getFullYear()} Keyyards. All rights reserved.
        </p>
        <div className="flex justify-center gap-3 md:gap-4 flex-wrap">
          <Link href="/privacy" className="hover:text-white transition">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-white transition">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}