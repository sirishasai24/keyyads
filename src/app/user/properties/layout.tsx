// src/app/manage-properties/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manage My Properties - Keyyards',
  description: 'View, edit, and delete your property listings on Keyyards. Track your active properties for sale or rent in your personal dashboard.',
  keywords: [
    'manage properties', 'my listings', 'edit property', 'delete property',
    'keyyards properties', 'property dashboard', 'user properties', 'real estate management'
  ],
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
  openGraph: {
    title: 'Your Property Dashboard - Keyyards',
    description: 'Access your Keyyards dashboard to manage all your active and inactive property listings. Effortlessly update details or remove properties.',
    url: 'https://keyyards.in/user/properties', // Adjust if your actual URL path is different
    images: [
      {
        url: 'https://keyyards.in/images/manage-properties-og.png', // Create a relevant OG image for this page
        width: 1200,
        height: 630,
        alt: 'Keyyards Property Management Dashboard',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Keyyards | Manage Your Real Estate Listings',
    description: 'Easily control your property listings on Keyyards. Update prices, descriptions, and photos from your personalized dashboard.',
    images: ['https://keyyards.in/images/manage-properties-twitter.png'], // Create a relevant Twitter image
  },
};

export default function ManagePropertiesLayout({
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