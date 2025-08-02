// app/layout.tsx (No changes needed here)
import type { Metadata } from "next";
import { Alata } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";

import Script from "next/script";
import ClientRootLayoutContent from "@/app/ClientRootLayoutContent";
import { Analytics } from "@vercel/analytics/next"

const alata = Alata({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-alata", // This line defines the CSS variable
});

export const metadata: Metadata = {
  title: "Keyyards",
  description:
    "Find your next home or investment property with Keyyards. Browse properties for sale and rent, connect with agents, and post your listings.",
    icons: '/images/tab.png'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          integrity="sha512-iecdLmaskl7CVnK43L9fS4x+b/zP+m8Xw2l/GfA/n7y7o9y0dM8oPz1o1J/1X5X5x8x8j+q8oO+0fO+q9ZtA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />

        {/* Razorpay Checkout script */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
      </head>
      <body
        // This className correctly applies the CSS variable to the body
        // and tells Tailwind to use its 'sans' font family
        className={`${alata.variable} font-sans antialiased bg-gray-50 text-gray-800`}
      >
        <ClientRootLayoutContent>{children}</ClientRootLayoutContent>
      </body>
    </html>
  );
}