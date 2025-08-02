// src/app/testimonials/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Client Testimonials - Hear From Our Satisfied Keyyards Users',
  description: 'Read genuine testimonials and reviews from Keyyards clients. Discover how our platform helped them find or sell their perfect property in India.',
  keywords: [
    'client testimonials', 'customer reviews', 'keyyards reviews', 'property testimonials',
    'real estate feedback', 'satisfied clients', 'user experiences', 'property success stories'
  ],
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
  openGraph: {
    title: 'Keyyards Client Testimonials & Success Stories',
    description: 'Explore authentic reviews from our happy clients who achieved their property goals with Keyyards. Your trusted real estate partner.',
    url: 'https://keyyards.in/admin/testimonials', // Adjust if your actual URL path is different
    images: [
      {
        url: 'https://keyyards.in/images/testimonials-og.png', // Create a relevant OG image for this page
        width: 1200,
        height: 630,
        alt: 'Keyyards Client Testimonials',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Keyyards | What Our Clients Say',
    description: 'See why clients love Keyyards! Read real testimonials about finding and selling properties with ease.',
    images: ['https://keyyards.in/images/testimonials-twitter.png'], // Create a relevant Twitter image
  },
};

export default function TestimonialsLayout({
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