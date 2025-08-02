// src/app/subscription/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Keyyards Premium Plans - Unlock Exclusive Real Estate Features',
  description: 'Choose a Keyyards premium subscription plan to get more listings, premium badging, property shows, EMI options, money-back guarantee, and more. Elevate your property experience today!',
  keywords: [
    'keyyards subscription', 'real estate premium plans', 'property listing plans',
    'buy property plan', 'sell property plan', 'premium features',
    'real estate membership', 'India property plans', 'Keyyards pricing',
    'annual plan', 'quarterly plan', 'half yearly plan', 'property shows',
    'money back guarantee real estate', 'EMI property plans'
  ],
  openGraph: {
    title: 'Keyyards Premium Plans - Exclusive Real Estate Features',
    description: 'Explore Keyyards subscription plans offering increased listings, premium visibility, and dedicated support for a superior real estate journey in India.',
    url: 'https://keyyards.in/user/prime',
    images: [
      {
        url: 'https://keyyards.in/images/subscription-og.png', // Ensure you create a relevant OG image for this page
        width: 1200,
        height: 630,
        alt: 'Keyyards Subscription Plans',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Keyyards | Premium Property Listing Subscriptions',
    description: 'Boost your property listings with Keyyards premium plans. Get maximum visibility and connect with genuine buyers across India.',
    images: ['https://keyyards.in/images/subscription-twitter.png'], // Ensure you create a relevant Twitter image for this page
  },
};

export default function SubscriptionLayout({
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