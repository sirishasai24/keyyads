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

const BASE_URL = "https://keyyards.in";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Keyyards - Buy & Rent Property in India",
    template: "%s | Keyyards",
  },
  description:
    "Find your next home or investment property with Keyyards. Browse properties for sale and rent, connect with agents, and post your listings across India.",
  icons: {
    icon: "/images/tab.png",
    apple: "/images/apple-touch-icon.png",
  },
  openGraph: {
    title: "Keyyards - Your Trusted Partner for Property in India",
    description:
      "Explore top real estate listings in India. Buy, rent, or sell homes, apartments, and commercial properties easily with Keyyards.",
    url: BASE_URL,
    siteName: "Keyyards",
    images: [
      {
        url: `${BASE_URL}/images/keyyards-og.png`,
        width: 1200,
        height: 630,
        alt: "Keyyards Real Estate - Find Your Dream Property",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Keyyards | Discover Your Next Property in India",
    description:
      "Discover premium properties for sale and rent in your city across India. Trusted by thousands of buyers, sellers, and agents.",
    images: [`${BASE_URL}/images/keyyards-twitter.png`],
    creator: "@KeyyardsOfficial",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-snippet": -1,
      "max-video-preview": -1,
      "max-image-preview": "large",
    },
  },
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
  ],
  authors: [{ name: "Keyyards Team", url: BASE_URL }],
  generator: "Next.js",
  applicationName: "Keyyards",
  category: "Real Estate",
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
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://checkout.razorpay.com" crossOrigin="anonymous" />
        {/* AdSense Preconnect is handled by its script */}
        <link rel="preconnect" href="https://www.googletagmanager.com" /> {/* Preconnect for Analytics */}
        <link rel="preconnect" href="https://www.google-analytics.com" /> {/* Preconnect for Analytics */}

        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          integrity="sha512-iecdLmaskl7CVnK43L9fS4x+b/zP+m8Xw2l/GfA/n7y7o9y0dM8oPz1o1J/1X5X5x8x8j+q8oO+0fO+q9ZtA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <link rel="canonical" href={`${BASE_URL}${pathname}`} />
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />

        {/* Google AdSense Script */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1131720795071367"
          crossOrigin="anonymous"
          strategy="afterInteractive" // Good for AdSense to load after the main content is visible
        />

        {/* Google Analytics Scripts */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-Z6ZYMM28M3"
          strategy="afterInteractive" // Good for Analytics to load after initial interactivity
        />
        <Script
          id="google-analytics-init"
          strategy="afterInteractive" // Matches the above Script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-Z6ZYMM28M3');
            `,
          }}
        />
      </head>
      <body
        className={`${alata.variable} font-sans antialiased bg-gray-50 text-gray-800`}
      >
        <ClientRootLayoutContent>{children}</ClientRootLayoutContent>
      </body>
    </html>
  );
}