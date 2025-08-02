// src/app/admin/addBlog/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create New Blog Post - Keyyards Admin',
  description: 'Compose and publish new blog posts for the Keyyards platform. Add titles, content, and cover images for your articles.',
  keywords: [
    'create blog', 'add blog post', 'publish article', 'keyyards admin',
    'blog editor', 'content management', 'real estate blog'
  ],
  robots: {
    index: false, // Important: Prevent indexing of admin-specific pages
    follow: false,
    nocache: true,
  },
  openGraph: {
    title: 'Keyyards Admin - Create Blog',
    description: 'Access the Keyyards admin interface to create and publish new blog content.',
    url: 'https://keyyards.in/admin/addBlog', // Adjust if your actual URL path is different
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Keyyards Admin | New Blog Post',
    description: 'Publish new articles and insights on the Keyyards platform.',
  },
};

export default function AddBlogLayout({
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