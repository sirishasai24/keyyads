// components/StarRating.tsx
"use client";

import { useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarIconOutline } from "@heroicons/react/24/outline";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void; // Made optional for display-only
  maxStars?: number;
  starColor?: string;
  disabled?: boolean; // Changed from 'readOnly' to 'disabled'
}

export const StarRating = ({
  rating,
  onRatingChange,
  maxStars = 5,
  starColor = "#0080FF", // Default to the theme color
  disabled = false, // Changed from 'readOnly' to 'disabled'
}: StarRatingProps) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex items-center space-x-0.5">
      {[...Array(maxStars)].map((_, index) => {
        const currentRating = index + 1;
        return (
          <span
            key={currentRating}
            onMouseEnter={() => !disabled && setHoverRating(currentRating)} // Use 'disabled'
            onMouseLeave={() => !disabled && setHoverRating(0)} // Use 'disabled'
            onClick={() => !disabled && onRatingChange?.(currentRating)} // Use 'disabled'
            className={disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"} // Use 'disabled' for styling
          >
            {currentRating <= (hoverRating || rating) ? (
              <StarIcon className="h-5 w-5 transition-colors duration-100" style={{ color: starColor }} />
            ) : (
              <StarIconOutline className="h-5 w-5 text-gray-400 transition-colors duration-100" />
            )}
          </span>
        );
      })}
    </div>
  );
};