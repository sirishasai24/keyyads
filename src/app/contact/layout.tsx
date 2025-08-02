// src/app/contact/layout.tsx
import type { Metadata } from 'next';

// Metadata for the /contact route segment
// This file is a Server Component by default, so 'use client' is not here.
export const metadata: Metadata = {
  title: 'Contact Keyyards - Get in Touch with Our Property Experts',
  description: 'Reach out to Keyyards for property inquiries, support, or to list your property. Find our phone number, email, and office address in Gachibowli, Hyderabad, India.',
  keywords: [
    'contact keyyards', 'keyyards contact number', 'keyyards email',
    'real estate support India', 'property inquiry Hyderabad',
    'real estate agents contact', 'Gachibowli property contact',
    'contact us', 'Keyyards office address', 'property help',
  ],
  openGraph: {
    title: 'Contact Keyyards - Your Property Assistance in Hyderabad',
    description: 'Connect with Keyyards for all your real estate needs. Our team is ready to assist you with buying, selling, or renting properties in Hyderabad and across India.',
    url: 'https://keyyards.in/contact',
    images: [
      {
        url: 'https://keyyards.in/images/contact-keyyards-og.png', // Ensure this image exists in your public/images folder
        width: 1200,
        height: 630,
        alt: 'Contact Keyyards - Real Estate Experts',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Keyyards for Your Property Needs',
    description: 'Have questions about properties? Contact Keyyards for expert real estate guidance and support.',
    images: ['https://keyyards.in/images/contact-keyyards-twitter.png'], // Ensure this image exists in your public/images folder
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}