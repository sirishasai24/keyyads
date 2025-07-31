'use client';

import React from 'react';

interface VideoBannerProps {
  src: string;
  alt?: string;
  className?: string;
  containerClassName?: string;
}

const VideoBanner: React.FC<VideoBannerProps> = ({
  src,
  alt = "Homepage video banner",
  className = "",
  containerClassName = "",
}) => {
  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      <video
        className={`object-cover ${className}`}
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
