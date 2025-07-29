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
  readOnly?: boolean; // <--- THIS IS THE MISSING PROP IN YOUR PROVIDED STAR RATING
}

export const StarRating = ({
  rating,
  onRatingChange,
  maxStars = 5,
  starColor = "#0080FF", // Default to the theme color
  readOnly = false, // Default to false (editable) if not provided
}: StarRatingProps) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex items-center space-x-0.5">
      {[...Array(maxStars)].map((_, index) => {
        const currentRating = index + 1;
        return (
          <span
            key={currentRating}
            onMouseEnter={() => !readOnly && setHoverRating(currentRating)} // Only allow hover if not readOnly
            onMouseLeave={() => !readOnly && setHoverRating(0)} // Only allow hover if not readOnly
            onClick={() => !readOnly && onRatingChange?.(currentRating)} // Only allow click if not readOnly
            className={readOnly ? "cursor-default" : "cursor-pointer"} // Change cursor based on readOnly
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