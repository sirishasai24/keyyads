// src/app/auth/resetpassword/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verify Password Reset Link - Keyyards Account',
  description: 'Verify your password reset link for your Keyyards account. This page confirms the validity of your reset request before you set a new password.',
  keywords: [
    'verify password reset', 'password reset link', 'account verification',
    'keyyards security', 'reset token verification'
  ],
  robots: {
    index: false, // Important: Prevent indexing of sensitive pages
    follow: false,
    nocache: true,
  },
  openGraph: {
    title: 'Keyyards - Verify Password Reset',
    description: 'Securely verify your password reset link to proceed with setting a new password for your Keyyards account.',
    url: 'https://keyyards.in/auth/resetpassword', // Adjust if your actual URL path is different
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Keyyards - Verify Password Reset Link',
    description: 'Verify your password reset link for your Keyyards account.',
  },
};

export default function ResetPasswordLayout({
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