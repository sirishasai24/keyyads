// src/app/user/profile/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Profile - Keyyards Account Dashboard',
  description: 'Manage your Keyyards profile, update personal information, view your active plan details, track remaining listings, and manage your properties.',
  keywords: [
    'keyyards profile', 'user dashboard', 'my account', 'property listings',
    'subscription plan', 'real estate account', 'edit profile', 'my properties'
  ],
  openGraph: {
    title: 'Keyyards User Profile & Dashboard',
    description: 'Access your Keyyards dashboard to manage listings, view plan details, and update your personal information.',
    url: 'https://keyyards.in/user/profile', // Adjust if your profile URL is different
    images: [
      {
        url: 'https://keyyards.in/images/profile-og.png', // Create a relevant OG image for your profile page
        width: 1200,
        height: 630,
        alt: 'Keyyards User Profile',
      },
    ],
    type: 'profile', // 'profile' type is appropriate for user profile pages
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Keyyards | Your Personal Real Estate Hub',
    description: 'Check your Keyyards account for active plans and manage your property portfolio.',
    images: ['https://keyyards.in/images/profile-twitter.png'], // Create a relevant Twitter image
  },
  robots: {
    index: false, // User profiles are typically not indexed by search engines for privacy/security reasons
    follow: false,
  }
};

export default function ProfileLayout({
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