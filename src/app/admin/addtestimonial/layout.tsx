// src/app/add-testimonial/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Add Your Testimonial - Share Your Keyyards Experience',
  description: 'Share your positive experience with Keyyards! Submit your testimonial and rating to help other users discover our reliable property services.',
  keywords: [
    'add testimonial', 'submit review', 'share experience', 'keyyards feedback',
    'write testimonial', 'customer review form', 'property service review'
  ],
  robots: {
    index: false, // Prevents search engines from indexing the form submission page
    follow: false,
    nocache: true,
  },
  openGraph: {
    title: 'Share Your Story with Keyyards',
    description: 'Provide your valuable feedback and testimonial about your experience with Keyyards.',
    url: 'https://keyyards.in/admin/addtestimonial/', // Adjust if your actual URL path is different
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Keyyards | Add Your Testimonial',
    description: 'We appreciate your feedback! Submit your testimonial to Keyyards.',
  },
};

export default function AddTestimonialLayout({
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