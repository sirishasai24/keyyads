// components/TermsAndConditionsPage.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  FaFileContract,
  FaUser,
  FaUserCog,
  FaKey,
  FaHome,
  FaDollarSign,
  FaCopyright,
  FaHandshakeSlash,
  FaBan,
  FaPencilAlt,
  FaBalanceScale,
  FaEnvelope,
} from 'react-icons/fa';

export default function TermsAndConditionsPage() {
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
              Terms & Conditions
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              Effective Date: 01/08/2025
            </p>
            <p className="mt-4 text-gray-700 text-lg leading-relaxed">
              Welcome to Keyyards! By using our website and services, you agree to the following terms and conditions.
            </p>
          </motion.header>

          <motion.div variants={itemVariants} className="space-y-10">
            {/* Section 1: Use of the Site */}
            <section className="bg-gray-50 p-6 rounded-2xl">
              <h2 className="flex items-center text-2xl font-bold text-gray-800 mb-4">
                <FaFileContract className="text-[#2180d3] mr-3" />
                1. Use of the Site
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                <li>You must be at least 18 years old to use our platform.</li>
                <li>You agree to use the site only for lawful purposes.</li>
              </ul>
            </section>

            {/* Section 2: User Responsibilities */}
            <section className="p-6">
              <h2 className="flex items-center text-2xl font-bold text-gray-800 mb-4">
                <FaUserCog className="text-[#2180d3] mr-3" />
                2. User Responsibilities
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                <li>You are responsible for the accuracy of the information you provide.</li>
                <li>You shall not upload false, misleading, or fraudulent property details.</li>
                <li>You agree not to post offensive or prohibited content.</li>
              </ul>
            </section>

            {/* Section 3: Account Registration */}
            <section className="bg-gray-50 p-6 rounded-2xl">
              <h2 className="flex items-center text-2xl font-bold text-gray-800 mb-4">
                <FaKey className="text-[#2180d3] mr-3" />
                3. Account Registration
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                <li>You must keep your login details confidential.</li>
                <li>We are not liable for unauthorized access to your account due to negligence.</li>
              </ul>
            </section>

            {/* Section 4: Property Listings */}
            <section className="p-6">
              <h2 className="flex items-center text-2xl font-bold text-gray-800 mb-4">
                <FaHome className="text-[#2180d3] mr-3" />
                4. Property Listings
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                <li>Listings must follow our quality guidelines.</li>
                <li>We reserve the right to remove any listings that violate our policies.</li>
              </ul>
            </section>

            {/* Section 5: Subscription Plans */}
            <section className="bg-gray-50 p-6 rounded-2xl">
              <h2 className="flex items-center text-2xl font-bold text-gray-800 mb-4">
                <FaDollarSign className="text-[#2180d3] mr-3" />
                5. Subscription Plans
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                <li>All paid plans and services are non-transferable.</li>
                <li>Refunds (if any) are subject to our Money-Back Guarantee policy.</li>
              </ul>
            </section>

            {/* Section 6: Intellectual Property */}
            <section className="p-6">
              <h2 className="flex items-center text-2xl font-bold text-gray-800 mb-4">
                <FaCopyright className="text-[#2180d3] mr-3" />
                6. Intellectual Property
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                <li>All content on the website (text, images, logos, code) is owned by Keyyards or its licensors.</li>
                <li>You may not use any content without permission.</li>
              </ul>
            </section>

            {/* Section 7: Limitation of Liability */}
            <section className="bg-gray-50 p-6 rounded-2xl">
              <h2 className="flex items-center text-2xl font-bold text-gray-800 mb-4">
                <FaHandshakeSlash className="text-[#2180d3] mr-3" />
                7. Limitation of Liability
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                <li>Keyyards is not responsible for disputes between buyers, sellers, or agents.</li>
                <li>We do not guarantee the sale or purchase of any listed property.</li>
              </ul>
            </section>

            {/* Section 8: Termination */}
            <section className="p-6">
              <h2 className="flex items-center text-2xl font-bold text-gray-800 mb-4">
                <FaBan className="text-[#2180d3] mr-3" />
                8. Termination
              </h2>
              <p className="text-gray-600">
                We may suspend or terminate your account if you violate our policies or applicable laws.
              </p>
            </section>

            {/* Section 9: Modifications */}
            <section className="bg-gray-50 p-6 rounded-2xl">
              <h2 className="flex items-center text-2xl font-bold text-gray-800 mb-4">
                <FaPencilAlt className="text-[#2180d3] mr-3" />
                9. Modifications
              </h2>
              <p className="text-gray-600">
                We may change these Terms at any time. Your continued use of the site means you accept the new terms.
              </p>
            </section>

            {/* Section 10: Governing Law */}
            <section className="p-6">
              <h2 className="flex items-center text-2xl font-bold text-gray-800 mb-4">
                <FaBalanceScale className="text-[#2180d3] mr-3" />
                10. Governing Law
              </h2>
              <p className="text-gray-600">
                These Terms shall be governed by and construed in accordance with the laws of India.
              </p>
            </section>

            {/* Section 11: Contact Us */}
            <section className="bg-gray-50 p-6 rounded-2xl text-center">
              <h2 className="flex items-center justify-center text-2xl font-bold text-gray-800 mb-4">
                <FaUser className="text-[#2180d3] mr-3" />
                11. Contact Us
              </h2>
              <p className="text-gray-600 mb-4">
                Questions? Reach us at:
              </p>
              <div className="flex items-center justify-center text-[#2180d3] text-xl font-medium">
                <FaEnvelope className="mr-2" />
                <a
                  href="mailto:legal@keyyards.in"
                  className="hover:underline transition-all duration-200"
                >
                  legal@keyyards.in
                </a>
              </div>
            </section>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}