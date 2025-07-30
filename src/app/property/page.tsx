// app/property/page.tsx
import { Suspense } from 'react';
import { HeroSection } from '@/components/home/hero-section';
import { PropertyResultsClient } from '@/components/property/PropertyResultsClient';

export default function PropertyResultsPage() {
  return (
    <>
      <HeroSection />
      {/* Wrap the client-side component in Suspense */}
      <Suspense fallback={<div>Loading properties...</div>}>
        <PropertyResultsClient />
      </Suspense>
    </>
  );
}