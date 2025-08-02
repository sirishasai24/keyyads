import type { Metadata } from "next";
import { Alata } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";

import Script from "next/script";
import ClientRootLayoutContent from "@/app/ClientRootLayoutContent";
import { headers } from "next/headers";

const alata = Alata({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-alata",
});

// Define a base URL for consistency in metadata URLs
const BASE_URL = "https://keyyards.in";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL), // Use the defined base URL

  // Primary Metadata: Crucial for Search Engine Results Pages (SERP)
  title: {
    default: "Keyyards - Buy & Rent Property in India", // More descriptive default title
    template: "%s | Keyyards", // Template for dynamic page titles
  },
  description:
    "Find your next home or investment property with Keyyards. Browse properties for sale and rent, connect with agents, and post your listings across India.", // Enhanced description with geo-specificity
  icons: {
    icon: "/images/tab.png", // Favicon for browser tabs
    apple: "/images/apple-touch-icon.png", // Recommended for Apple devices (create this if you don't have it)
  },

  // Open Graph (OG) Metadata: For rich social media sharing
  openGraph: {
    title: "Keyyards - Your Trusted Partner for Property in India", // Specific title for social shares
    description:
      "Explore top real estate listings in India. Buy, rent, or sell homes, apartments, and commercial properties easily with Keyyards.", // Detailed description for social shares
    url: BASE_URL, // Canonical URL for the site
    siteName: "Keyyards",
    images: [
      {
        url: `${BASE_URL}/images/keyyards-og.png`, // Use absolute URL for Open Graph image. Consider a higher-res image.
        width: 1200,
        height: 630,
        alt: "Keyyards Real Estate - Find Your Dream Property", // Descriptive alt text for the OG image
      },
      // You can add more image sizes or variations if needed
    ],
    locale: "en_IN", // Specific locale for India
    type: "website", // Standard type for most websites
  },

  // Twitter Card Metadata: For rich Twitter sharing
  twitter: {
    card: "summary_large_image",
    title: "Keyyards | Discover Your Next Property in India", // Twitter-specific title
    description:
      "Discover premium properties for sale and rent in your city across India. Trusted by thousands of buyers, sellers, and agents.", // Twitter-specific description
    images: [`${BASE_URL}/images/keyyards-twitter.png`], // Use absolute URL for Twitter image (can be same as OG or optimized for Twitter)
    creator: "@KeyyardsOfficial", // Use your actual Twitter handle if you have one
  },

  // Robots Meta Tag: Crucial for crawler instructions
  robots: {
    index: true, // Allow indexing
    follow: true, // Allow following links
    nocache: false, // Allow caching (default, but explicit can be good)
    googleBot: { // Specific instructions for Googlebot
      index: true,
      follow: true,
      noimageindex: false,
      "max-snippet": -1, // Allow full snippet in SERP
      "max-video-preview": -1, // Allow full video preview
      "max-image-preview": "large", // Allow large image preview
    },
  },

  // Keywords: Less impactful for ranking directly, but still good for context
  keywords: [
    "real estate India",
    "buy home India",
    "rent house India",
    "property listings India",
    "apartments for sale",
    "houses for rent",
    "commercial property India",
    "investment property India",
    "Keyyards",
    "property portal",
    "flats for sale",
    "land for sale",
    // Add more specific keywords relevant to your business and location (e.g., "property in Hyderabad", "flats in Bangalore")
  ],

  // Author and Generator
  authors: [{ name: "Keyyards Team", url: BASE_URL }], // More generic "Team" or your official company name
  generator: "Next.js", // Good to keep
  applicationName: "Keyyards", // Good to keep
  category: "Real Estate", // More specific capitalization
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerList = await headers();
  const pathname = headerList.get("x-next-url") || "/";

  return (
    <html lang="en">
      <head>
        {/* Preconnect for faster loading of external resources */}
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://checkout.razorpay.com" crossOrigin="anonymous" />


        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          integrity="sha512-iecdLmaskl7CVnK43L9fS4x+b/zP+m8Xw2l/GfA/n7y7o9y0dM8oPz1o1J/1X5X5x8x8j+q8oO+0fO+q9ZtA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        {/* Canonical URL is correctly implemented based on the dynamic pathname */}
        <link rel="canonical" href={`${BASE_URL}${pathname}`} />
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
        {/* Add a descriptive title for your page based on metadata (handled by Next.js automatically from `metadata` object) */}
        {/* <title>Your Page Title</title> */}
      </head>
      <body
        className={`${alata.variable} font-sans antialiased bg-gray-50 text-gray-800`}
      >
        <ClientRootLayoutContent>{children}</ClientRootLayoutContent>
      </body>
    </html>
  );
}