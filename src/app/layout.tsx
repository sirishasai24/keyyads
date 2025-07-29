// app/layout.tsx
import type { Metadata } from "next";
import { Alata } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";

import Script from "next/script";
import ClientRootLayoutContent from "@/app/ClientRootLayoutContent";

const alata = Alata({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-alata",
});

export const metadata: Metadata = {
  title: "Ploteasy",
  description:
    "Find your next home or investment property with Ploteasy. Browse properties for sale and rent, connect with agents, and post your listings.",
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
        className={`${alata.variable} font-sans antialiased bg-gray-50 text-gray-800`}
      >
        <ClientRootLayoutContent>{children}</ClientRootLayoutContent>
      </body>
    </html>
  );
}
