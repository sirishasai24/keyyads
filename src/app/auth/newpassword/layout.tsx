// src/app/auth/newpassword/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Set New Password - Keyyards Account',
  description: 'Set a new password for your Keyyards account. This page is for securely resetting your account credentials.',
  keywords: [
    'new password', 'reset password', 'change password', 'keyyards password reset',
    'account security', 'password setup'
  ],
  robots: {
    index: false, // Important: Prevent indexing of sensitive pages
    follow: false,
    nocache: true,
  },
  openGraph: {
    title: 'Keyyards - Set New Password',
    description: 'Securely set a new password for your Keyyards account.',
    url: 'https://keyyards.in/auth/newpassword', // Adjust if your actual URL path is different
    // No images for OG as it's a functional page
    type: 'website',
  },
  twitter: {
    card: 'summary', // A simple summary card is sufficient
    title: 'Keyyards - Set New Password',
    description: 'Update your Keyyards account password securely.',
    // No images for Twitter card
  },
};

export default function NewPasswordLayout({
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