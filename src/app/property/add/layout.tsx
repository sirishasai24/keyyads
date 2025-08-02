// src/app/property/add/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Add New Property - List Your Real Estate | Keyyards',
  description: 'Easily list your property for sale or rent on Keyyards. Fill out our step-by-step form to add details, upload images, and mark its location.',
  keywords: [
    'add property', 'list property', 'sell my home', 'rent my property',
    'post property', 'real estate listing form', 'Keyyards property submission',
    'new property listing', 'property for sale', 'property for rent'
  ],
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
  openGraph: {
    title: 'List Your Property on Keyyards',
    description: 'Quickly and easily add your residential or commercial property for sale or rent with Keyyards\' intuitive listing form.',
    url: 'https://keyyards.in/property/add', // Adjust if your actual URL path is different
    images: [
      {
        url: 'https://keyyards.in/images/add-property-og.png', // Create a relevant OG image for this page
        width: 1200,
        height: 630,
        alt: 'Add Property on Keyyards',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'List Your Property on Keyyards',
    description: 'Streamline your property listing process. Add all necessary details and photos to sell or rent your property fast.',
    images: ['https://keyyards.in/images/add-property-twitter.png'], // Create a relevant Twitter image
  },
};

export default function AddPropertyLayout({
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