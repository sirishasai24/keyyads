// components/AdminNav.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';  
import {
  FaHome,
  FaUsers,
  FaChartBar,
  FaSignOutAlt,
  FaChevronLeft,
  FaPlus,
  FaBell,
} from 'react-icons/fa';
import Image from 'next/image';
import Logo from '../../public/images/keyyards.png';

const navLinks = [
  { href: '/admin/analytics/dashboard', label: 'Dashboard', icon: <FaChartBar /> },
  { href: '/admin/manage-users', label: 'Users', icon: <FaUsers /> },
  { href: '/admin/manage-properties', label: 'Properties', icon: <FaHome /> },
  { href: '/admin/manage-properties/unapproved', label: 'Unapproved', icon: <FaBell /> },
  { href: '/property/add', label: 'Add Property', icon: <FaPlus /> },
  { href: '/admin/addtestimonial', label: 'Add Testimonial', icon: <FaPlus /> },
  { href: '/admin/addBlog', label: 'Add Blog', icon: <FaPlus /> },
];

export default function AdminNav() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

  const sidebarVariants = {
  open: {
    width: 250,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    transition: { duration: 0.3 },
  },
  closed: {
    width: 0,
    backgroundColor: 'transparent',
    transition: { duration: 0.3 },
  },
};

return (
  <motion.nav
    initial="open"
    animate={isSidebarOpen ? 'open' : 'closed'}
    variants={sidebarVariants}
    className={`fixed z-50 h-screen shadow-xl flex flex-col backdrop-blur-md ${
      !isSidebarOpen ? 'bg-transparent' : ''
    }`}
  >
    {/* Toggle Button */}
    <button
      onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      className={`absolute top-4 left-4 p-2 rounded-full bg-[#2180d3] text-white hover: transition-transform duration-300 ${
        !isSidebarOpen && 'rotate-180'
      }`}
    >
      <FaChevronLeft />
    </button>

    {isSidebarOpen && (
      <>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <Image src={Logo} alt="Keyyards Logo" width={120} height={40} className="ml-8" />
        </div>

        <div className="flex flex-col flex-1 p-4 overflow-y-auto custom-scrollbar">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <motion.div
                className={`flex items-center p-3 my-2 rounded-lg transition-colors ${
                  pathname === link.href
                    ? 'bg-[#2180d3] text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                <span className="text-xl mr-3">{link.icon}</span>
                <span className="font-semibold whitespace-nowrap">{link.label}</span>
              </motion.div>
            </Link>
          ))}
        </div>

        <div className="flex items-center justify-between p-4 border-t border-gray-200">
          <button className="p-2 rounded-full text-gray-500 hover:text-[#2180d3]">
            <FaBell className="text-xl" />
          </button>
          <button className="p-2 rounded-full text-red-500 hover:text-red-700">
            <FaSignOutAlt className="text-xl" />
          </button>
        </div>
      </>
    )}
  </motion.nav>
);
}