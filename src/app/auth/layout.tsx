// src/app/auth/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login or Register - Access Your Keyyards Account',
  description: 'Sign in to your existing Keyyards account or create a new one to list properties, manage your listings, and access exclusive features.',
  keywords: [
    'keyyards login', 'keyyards register', 'sign in', 'sign up',
    'create account', 'real estate portal login', 'property account',
    'access dashboard', 'agent login', 'owner login'
  ],
  robots: {
    index: false, // Prevents search engines from indexing the login/registration page
    follow: false,
    nocache: true,
  },
  openGraph: {
    title: 'Login / Register for Keyyards',
    description: 'Join Keyyards to buy, sell, or rent properties. Login to manage your listings or register for a new account.',
    url: 'https://keyyards.in/auth', // Adjust if your actual URL path is different
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Keyyards | Login/Register',
    description: 'Your gateway to managing properties and connecting with real estate opportunities on Keyyards.',
  },
};

export default function AuthLayout({
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