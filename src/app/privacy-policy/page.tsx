// components/PrivacyPolicyPage.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaInfoCircle, FaShareAlt, FaCookie, FaDatabase, FaCogs, FaPhoneAlt, FaEnvelope, FaLink, FaRegEdit } from 'react-icons/fa';

export default function PrivacyPolicyPage() {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="bg-white rounded-3xl shadow-2xl p-6 sm:p-10"
        >
          <motion.header variants={itemVariants} className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
              Privacy Policy
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              Effective Date: 1/08/2025
            </p>
            <p className="mt-4 text-gray-700 text-lg leading-relaxed">
              At Keyyards, your privacy is important to us. This Privacy Policy outlines how we collect, use, disclose, and protect your personal information.
            </p>
          </motion.header>

          <motion.div variants={itemVariants} className="space-y-10">
            {/* Section 1: Information We Collect */}
            <section className="bg-gray-50 p-6 rounded-2xl">
              <h2 className="flex items-center text-2xl font-bold text-gray-800 mb-4">
                <FaInfoCircle className="text-[#2180d3] mr-3" />
                1. Information We Collect
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                <li><span className="font-semibold">Personal Information:</span> Name, email address, phone number, address, etc.</li>
                <li><span className="font-semibold">Property Information:</span> Details of your listings, preferences, budgets, etc.</li>
                <li><span className="font-semibold">Usage Data:</span> IP address, browser type, pages visited, and time spent on our site.</li>
                <li><span className="font-semibold">Location Data (if enabled):</span> To provide nearby property suggestions.</li>
              </ul>
            </section>

            {/* Section 2: How We Use Your Information */}
            <section className="p-6">
              <h2 className="flex items-center text-2xl font-bold text-gray-800 mb-4">
                <FaCogs className="text-[#2180d3] mr-3" />
                2. How We Use Your Information
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                <li>To provide and manage property listings and services.</li>
                <li>To communicate with you (promotions, updates, support).</li>
                <li>To improve website functionality and user experience.</li>
                <li>To send alerts or marketing content (you can opt out anytime).</li>
              </ul>
            </section>

            {/* Section 3: Sharing Your Information */}
            <section className="bg-gray-50 p-6 rounded-2xl">
              <h2 className="flex items-center text-2xl font-bold text-gray-800 mb-4">
                <FaShareAlt className="text-[#2180d3] mr-3" />
                3. Sharing Your Information
              </h2>
              <p className="text-gray-600 mb-2">
                We do not sell your personal information. We may share data:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                <li>With our verified agent partners.</li>
                <li>With service providers (e.g., payment gateways, analytics).</li>
                <li>If required by law or legal obligations.</li>
              </ul>
            </section>

            {/* Section 4: Cookies and Tracking */}
            <section className="p-6">
              <h2 className="flex items-center text-2xl font-bold text-gray-800 mb-4">
                <FaCookie className="text-[#2180d3] mr-3" />
                4. Cookies and Tracking
              </h2>
              <p className="text-gray-600">
                We use cookies to personalize content and analyze traffic. You can choose to disable cookies via your browser.
              </p>
            </section>

            {/* Section 5: Data Security */}
            <section className="bg-gray-50 p-6 rounded-2xl">
              <h2 className="flex items-center text-2xl font-bold text-gray-800 mb-4">
                <FaDatabase className="text-[#2180d3] mr-3" />
                5. Data Security
              </h2>
              <p className="text-gray-600">
                We implement appropriate security measures to protect your data, but no method of transmission over the internet or electronic storage is 100% secure.
              </p>
            </section>

            {/* Section 6: Your Rights */}
            <section className="p-6">
              <h2 className="flex items-center text-2xl font-bold text-gray-800 mb-4">
                <FaShieldAlt className="text-[#2180d3] mr-3" />
                6. Your Rights
              </h2>
              <p className="text-gray-600">
                As a user, you have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                <li>Request access or correction to your data.</li>
                <li>Opt out of marketing communications.</li>
                <li>Request account deletion.</li>
              </ul>
            </section>

            {/* Section 7: Third-Party Links */}
            <section className="bg-gray-50 p-6 rounded-2xl">
              <h2 className="flex items-center text-2xl font-bold text-gray-800 mb-4">
                <FaLink className="text-[#2180d3] mr-3" />
                7. Third-Party Links
              </h2>
              <p className="text-gray-600">
                Our website may contain links to third-party websites. We are not responsible for their privacy practices. We encourage you to read the privacy policies of any third-party sites you visit.
              </p>
            </section>

            {/* Section 8: Changes to This Policy */}
            <section className="p-6">
              <h2 className="flex items-center text-2xl font-bold text-gray-800 mb-4">
                <FaRegEdit className="text-[#2180d3] mr-3" />
                8. Changes to This Policy
              </h2>
              <p className="text-gray-600">
                We may update this Privacy Policy periodically to reflect changes in our practices. We will notify you of any significant changes by posting the new policy on this page.
              </p>
            </section>

            {/* Section 9: Contact Us */}
            <section className="bg-gray-50 p-6 rounded-2xl text-center">
              <h2 className="flex items-center justify-center text-2xl font-bold text-gray-800 mb-4">
                <FaPhoneAlt className="text-[#2180d3] mr-3" />
                9. Contact Us
              </h2>
              <p className="text-gray-600 mb-4">
                For questions regarding this Privacy Policy, please contact us at:
              </p>
              <div className="flex items-center justify-center text-[#2180d3] text-xl font-medium">
                <FaEnvelope className="mr-2" />
                <a
                  href="mailto:support@keyyards.in"
                  className="hover:underline transition-all duration-200"
                >
                  support@keyyards.in
                </a>
              </div>
            </section>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}