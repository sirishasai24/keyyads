// src/app/admin/blog/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blogs - Keyyards',
  description: 'Manage all blog posts on the Keyyards platform. View, edit, and oversee your published articles from the admin dashboard.',
  keywords: [
    'blog management', 'admin blog', 'keyyards blog dashboard', 'manage articles',
    'blog list admin', 'content management system', 'real estate blog admin'
  ],
  robots: {
    index: false, // Important: Prevent indexing of admin-specific pages
    follow: false,
    nocache: true,
  },
  openGraph: {
    title: 'Keyyards Admin - Blog Management',
    description: 'Access the Keyyards admin panel for comprehensive blog post management.',
    url: 'https://keyyards.in/admin/blog', // Adjust if your actual URL path is different
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Keyyards Admin | Blog Overview',
    description: 'Overview of all blog content on Keyyards for administrative purposes.',
  },
};

export default function BlogAdminLayout({
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