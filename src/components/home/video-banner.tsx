// components/VideoBanner.tsx
"use client"; // Important for Next.js App Router

import React from 'react';

interface VideoBannerProps {
  src: string; // The URL path to your video file (e.g., /videos/homepage-bg.mp4)
  alt?: string; // Optional alt text for accessibility
  className?: string; // Optional additional Tailwind CSS classes for the video element
  containerClassName?: string; // Optional additional Tailwind CSS classes for the outer container
}

const VideoBanner: React.FC<VideoBannerProps> = ({
  src,
  alt = "Homepage video banner",
  className = "",
  containerClassName = "",
}) => {
  return (
    <div className={`relative w-full overflow-hidden ${containerClassName}`}>
      <video
        className={`w-full h-auto object-cover ${className}`}
        src={src}
        title={alt}
        muted 
        autoPlay 
        loop 
        playsInline 
        preload="auto" 
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoBanner;