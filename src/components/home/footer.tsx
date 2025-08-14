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
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

export default function Footer() {
  const appVersion = "1.0.0";

  return (
    <footer className="bg-[#155a96] text-white py-5 md:py-6 mt-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <svg
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        ></svg>
      </div>

      {/* Main content grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5 md:gap-y-6 lg:gap-x-16">
        {/* Brand & Description */}
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-2 mb-2">
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

        {/* Contact Info */}
        <div className="flex flex-col">
          <h3 className="text-lg md:text-xl font-bold mb-2 border-b-2 border-[#2e7bbd] pb-2 inline-block">
            Contact Us
          </h3>
          <ul className="space-y-2 text-gray-100 text-sm md:text-base">
            <li className="flex items-start gap-2.5">
              <EnvelopeIcon className="w-4 h-4 md:w-5 md:h-5 text-[#bcdfff]" />
              <a
                href="mailto:support@keyyards.in"
                className="hover:text-[#bcdfff]"
              >
                support@keyyards.in
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <PhoneIcon className="w-4 h-4 md:w-5 md:h-5 text-[#bcdfff]" />
              <a href="tel:+914040316406" className="hover:text-[#bcdfff]">
                +91 40403 16406
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPinIcon className="w-4 h-4 md:w-5 md:h-5 text-[#bcdfff]" />
              <span>Gachibowli, Hyderabad, India</span>
            </li>
          </ul>
        </div>

        {/* Social Links & Badges */}
        <div>
          <h3 className="text-lg md:text-xl font-bold mb-2 border-b-2 border-[#2e7bbd] pb-2 inline-block">
            Connect With Us
          </h3>
          <div className="flex gap-2.5 sm:gap-3 mt-2">
            <a
              href="https://www.facebook.com/profile.php?id=61579001160970"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-[#2e7bbd] hover:bg-[#bcdfff] text-white hover:text-[#155a96] transition duration-300 shadow-md"
            >
              <FaFacebookF size={16} />
            </a>
            <a
              href="https://www.youtube.com/@Keyyards"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Youtube"
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-[#2e7bbd] hover:bg-[#bcdfff] text-white hover:text-[#155a96] transition duration-300 shadow-md"
            >
              <FaYoutube size={16} />
            </a>
            <a
              href="https://www.instagram.com/keyyards_in/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-[#2e7bbd] hover:bg-[#bcdfff] text-white hover:text-[#155a96] transition duration-300 shadow-md"
            >
              <FaInstagram size={16} />
            </a>
            <a
              href="https://www.linkedin.com/company/keyyards"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-[#2e7bbd] hover:bg-[#bcdfff] text-white hover:text-[#155a96] transition duration-300 shadow-md"
            >
              <FaLinkedinIn size={16} />
            </a>
          </div>

          {/* Glassdoor Badge */}
          <a
            href="https://www.glassdoor.com/Overview/Working-at-Keyyards-EI_IE10734033.11,19.htm"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block"
          >
            <img
              src="https://www.glassdoor.co.in/pc-app/static/img/partnerCenter/badges/eng_BASIC_250x90.png"
              alt="Find us on Glassdoor."
              width={250}
              height={90}
            />
          </a>

          {/* AmbitionBox Badge */}
          <a
            href="https://www.ambitionbox.com/overview/keyyards-overview?utm_source=employer-dashboard&utm_campaign=keyyards&utm_medium=badges"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block"
          >
            <img
              src="https://employer.ambitionbox.com/api/badge/2110650?badge-type=employee-ratings2"
              alt="Keyyards AmbitionBox Employee Ratings"
              width={250}
              height={90}
            />
          </a>

          {/* Trustpilot Widget */}
          <div
            className="trustpilot-widget mt-4 inline-block w-[250px]"
            data-locale="en-US"
            data-template-id="56278e9abfbbba0bdcd568bc"
            data-businessunit-id="689daedfc64a551852d9014c"
            data-style-height="52px"
            data-style-width="100%"
            data-token="25410d41-6111-4c43-8e14-3f001025c8ed"
          >
            <a
              href="https://www.trustpilot.com/review/keyyards.in"
              target="_blank"
              rel="noopener"
            >
              Trustpilot
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#2e7bbd] mt-5 md:mt-6 pt-3 pb-2 text-xs md:text-sm text-gray-200 text-center relative z-10 px-4">
        <p className="mb-0.5">
          &copy; {new Date().getFullYear()} Keyyards. All rights reserved.{" "}
          <span className="ml-2 text-gray-300">v{appVersion}</span>
        </p>
        <div className="flex justify-center gap-3 md:gap-4 flex-wrap">
          <Link href="/privacy-policy" className="hover:text-white transition">
            Privacy Policy
          </Link>
          <Link
            href="/terms-conditions"
            className="hover:text-white transition"
          >
            Terms of Service
          </Link>
          <Link href="/contact" className="hover:text-white transition">
            Contact Us
          </Link>
        </div>
      </div>
    </footer>
  );
}
