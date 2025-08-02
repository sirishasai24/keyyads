// src/app/forgot-password/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forgot Password - Reset Your Keyyards Account',
  description: 'Request a password reset link for your Keyyards account. Enter your email address to receive instructions on how to regain access.',
  keywords: [
    'forgot password', 'reset password', 'keyyards password', 'account recovery',
    'login help', 'password assistance', 'secure login'
  ],
  robots: {
    index: false, // Important: Prevent indexing of sensitive pages
    follow: false,
    nocache: true,
  },
  openGraph: {
    title: 'Keyyards - Forgot Password',
    description: 'Easily reset your password for your Keyyards account. Securely regain access to your property management dashboard.',
    url: 'https://keyyards.in/auth/forgotpassword', // Adjust if your actual URL path is different
    // No images for OG as it's a functional page, not content-rich for sharing
    type: 'website', // 'website' or 'profile' (less common for forgot password)
  },
  twitter: {
    card: 'summary', // A simple summary card is sufficient
    title: 'Keyyards - Forgot Password',
    description: 'Reset your Keyyards account password securely.',
    // No images for Twitter card
  },
};

export default function ForgotPasswordLayout({
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