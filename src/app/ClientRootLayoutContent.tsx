// app/ClientRootLayoutContent.tsx
'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/NavBar';
import { Toaster } from 'react-hot-toast';

export default function ClientRootLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const excludeNavbarPaths = ['/auth', '/auth/resetpassword', '/auth/forgotpassword', '/auth/resetpassword','/auth/verifyemail'];

  const shouldShowNavbar = !excludeNavbarPaths.includes(pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <main>
        {children}
      </main>
      <Toaster position="top-right" />
    </>
  );
}