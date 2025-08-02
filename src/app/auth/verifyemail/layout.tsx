// src/app/auth/verifyemail/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verify Your Email - Keyyards Account',
  description: 'Complete your account registration by verifying your email address with Keyyards. This step secures your account and unlocks full platform access.',
  keywords: [
    'verify email', 'email verification', 'keyyards account', 'account activation',
    'confirm email', 'secure account', 'registration complete'
  ],
  robots: {
    index: false, // Important: Prevent indexing of sensitive and transient pages
    follow: false,
    nocache: true,
  },
  openGraph: {
    title: 'Keyyards - Email Verification',
    description: 'Verify your email address to activate your Keyyards account and start exploring properties.',
    url: 'https://keyyards.in/auth/verifyemail', // Adjust if your actual URL path is different
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Keyyards - Email Verification',
    description: 'Activate your Keyyards account by verifying your email.',
  },
};

export default function VerifyEmailLayout({
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