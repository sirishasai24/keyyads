// src/app/contact/page.tsx
'use client'; // This is a client component

import React, { useState, FormEvent } from 'react';
import axios from 'axios'; // Import axios
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  ChatBubbleBottomCenterTextIcon,
  PaperAirplaneIcon,
  BuildingOfficeIcon,
  ClockIcon,
  CalendarDaysIcon, // Note: CalendarDaysIcon is not used in the final version of info cards
  ChatBubbleOvalLeftEllipsisIcon // Added for Live Chat card
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast'; // Assuming you have react-hot-toast for notifications
import Link from 'next/link'; // Import Link for navigation

// If you don't have react-hot-toast, install it: npm install react-hot-toast
// And add <Toaster /> to your root layout.tsx or a higher-level component.

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    propertyInterest: '', // Can be a string or array if multiple selection
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [formMessage, setFormMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormMessage('');
    setMessageType('');

    try {
      // Use axios for the API endpoint for sending messages
      // This is a placeholder API call. You will need to create a /api/contact endpoint
      // that handles sending emails or saving contact form submissions.
      const response = await axios.post('/api/contact', formData);

      if (response.status === 200) { // Assuming your API returns 200 for success
        toast.success('Message sent successfully! We will get back to you soon.');
        setFormMessage('Your message has been sent successfully!');
        setMessageType('success');
        setFormData({ fullName: '', email: '', phoneNumber: '', propertyInterest: '', message: '' }); // Clear form
      } else {
        // Handle non-200 responses from your API
        const errorMsg = response.data?.message || 'Failed to send message. Please try again.';
        toast.error(errorMsg);
        setFormMessage(errorMsg);
        setMessageType('error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      let errorMsg = 'An unexpected error occurred. Please try again later.';
      if (axios.isAxiosError(error) && error.response) {
        errorMsg = error.response.data?.message || errorMsg;
      }
      toast.error(errorMsg);
      setFormMessage(errorMsg);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          {/* Reduced h1 from text-4xl sm:text-5xl md:text-6xl to text-3xl sm:text-4xl md:text-5xl */}
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-5xl">
            Ready to Find Your Keyyard Property?
          </h1>
          {/* Reduced p from text-lg to text-base */}
          <p className="mt-4 text-base text-gray-600 max-w-2xl mx-auto">
            Get in touch with our keyyard property specialists. We're here to help you find the
            perfect secure property that matches your lifestyle and needs.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact Form */}
          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-gray-100 h-fit">
            {/* Reduced h2 from text-2xl to text-xl */}
            <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
              Send us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Your full name"
                    />
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="your@email.com"
                    />
                    <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="+91 XXXXXXXXXX"
                    />
                    <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label htmlFor="propertyInterest" className="block text-sm font-medium text-gray-700 mb-1">
                    Property Interest
                  </label>
                  <div className="relative">
                    <select
                      id="propertyInterest"
                      name="propertyInterest"
                      value={formData.propertyInterest}
                      onChange={handleChange}
                      className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                    >
                      <option value="">Select property type</option>
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                      <option value="land">Land</option>
                      <option value="rental">Rental</option>
                    </select>
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-y"
                    placeholder="Tell us about your property requirements, budget, preferred location, and any specific Keyyard features you're looking for..."
                  ></textarea>
                  <ChatBubbleBottomCenterTextIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {formMessage && (
                <div
                  className={`p-3 rounded-md text-sm ${
                    messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}
                >
                  {formMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#2180d3] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <PaperAirplaneIcon className="h-5 w-5 rotate-90 mr-2" />
                )}
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info Cards */}
          <div className="space-y-6">
            {/* Call Us Card */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-start space-x-4">
              <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full">
                <PhoneIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Call Us</h3>
                <p className="mt-1 text-gray-600">Speak with our keyyard specialists</p>
                <a href="tel:+914040316406" className="text-blue-600 hover:underline font-medium mt-1 inline-block">
                  +91 40403 16406
                </a>
              </div>
            </div>

            {/* Email Us Card */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-start space-x-4">
              <div className="flex-shrink-0 bg-green-100 p-3 rounded-full">
                <EnvelopeIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Email Us</h3>
                <p className="mt-1 text-gray-600">Get detailed property information</p>
                <a href="mailto:support@keyyards.com" className="text-green-600 hover:underline font-medium mt-1 inline-block">
                  support@keyyards.com
                </a>
              </div>
            </div>

            {/* Live Chat Card - Commented out as in your provided code */}
            {/*
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-start space-x-4">
              <div className="flex-shrink-0 bg-orange-100 p-3 rounded-full">
                <ChatBubbleOvalLeftEllipsisIcon className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Live Chat</h3>
                <p className="mt-1 text-gray-600">Instant support available</p>
                <Link href="#" className="text-orange-600 hover:underline font-medium mt-1 inline-block">
                  Start a conversation
                </Link>
              </div>
            </div>
            */}

            {/* Visit Our Office Card - Themed */}
            <div className="bg-gradient-to-br from-[#155a96] to-[#2180d3] text-white p-6 rounded-2xl shadow-lg flex flex-col">
              <h3 className="text-2xl font-bold mb-4">Visit Our Office</h3>
              <div className="space-y-3 text-lg">
                <p className="flex items-start">
                  <BuildingOfficeIcon className="h-6 w-6 text-blue-200 mr-3 flex-shrink-0 mt-0.5" />
                  <span>
                    Main Office <br />
                    Gachibowli, Hyderabad <br />
                    India
                  </span>
                </p>
                <p className="flex items-center">
                  <ClockIcon className="h-6 w-6 text-blue-200 mr-3 flex-shrink-0" />
                  <span>Business Hours</span>
                </p>
                <ul className="pl-9 space-y-1 text-base">
                  <li>Monday - Friday: 9:00 AM - 5:00 PM</li>
                  <li>Saturday: 10:00 AM - 3:00 PM</li>
                  <li>Sunday: 12:00 PM - 5:00 PM</li>
                </ul>
              </div>
              {/* Schedule a Visit Button - Commented out as in your provided code */}
              {/*
              <Link href="#" className="mt-6 inline-block self-start px-6 py-3 bg-white text-[#2180d3] font-semibold rounded-md shadow-md hover:bg-gray-100 transition-colors">
                Schedule a Visit
              </Link>
              */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}