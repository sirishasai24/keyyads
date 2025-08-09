// app/ClientRootLayoutContent.tsx
'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/NavBar';
import { Toaster } from 'react-hot-toast';
import Footer from '@/components/home/footer';
import { Analytics } from "@vercel/analytics/next"
import Chatbot from '@/components/ChatBot'; // Import the Chatbot component

export default function ClientRootLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const excludeNavbarPaths = ['/auth', '/auth/resetpassword', '/auth/forgotpassword', '/auth/resetpassword', '/auth/verifyemail', '/privacy-policy', '/terms-conditions'];
  const shouldShowNavbar = !excludeNavbarPaths.includes(pathname);

  const excludeFooterPaths = ['/auth', '/auth/resetpassword', '/auth/forgotpassword', '/auth/resetpassword', '/auth/verifyemail', '/property/add', '/privacy-policy', '/terms-conditions'];
  const shouldShowFooter = !excludeFooterPaths.includes(pathname);

  // Define paths where the chatbot should not be shown
  const excludeChatbotPaths = [
    '/auth',
    '/auth/resetpassword',
    '/auth/forgotpassword',
    '/auth/verifyemail',
    '/property/add',
  ];
  const shouldShowChatbot = !excludeChatbotPaths.includes(pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar/>}
      <main>
        {children}
      </main>
      <Toaster position="top-right" />
      <Analytics />

      {/* Conditionally render the Chatbot */}
      {shouldShowChatbot && <Chatbot />}

      {shouldShowFooter && <footer className="mt-20"><Footer /></footer>}
    </>
  );
}