'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Carousel } from './slider';
import { QuoteIcon, StarIcon } from './emojis';

interface Testimonial {
  _id: string;
  username: string;
  review: string;
  rating: number;
  location: string;
  profileImageURL: string;
}

interface ApiResponse {
  testimonials: Testimonial[];
}

const itemVariants = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring' as const, stiffness: 100 },
  },
};

// Helper to split array into chunks of n
const chunkArray = <T,>(arr: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

export const TestimonialsSection = () => {
  const [slides, setSlides] = useState<Testimonial[][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get<ApiResponse>('/api/user/testimonials');
        const list = response.data?.testimonials ?? [];
        const shuffled = list.sort(() => 0.5 - Math.random()).slice(0, 9);
        setSlides(chunkArray(shuffled, 3)); // 👈 group into arrays of 3
      } catch (e) {
        console.error(e);
        setError('Failed to load testimonials. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  if (loading)
    return (
      <section className="py-8 bg-[#1f8fff]/10 rounded-3xl shadow-inner mt-12 text-center text-gray-700">
        <p>Loading testimonials...</p>
      </section>
    );
  if (error)
    return (
      <section className="py-8 bg-[#1f8fff]/10 rounded-3xl shadow-inner mt-12 text-center text-red-600">
        <p>{error}</p>
      </section>
    );
  if (slides.length === 0)
    return (
      <section className="py-8 bg-[#1f8fff]/10 rounded-3xl shadow-inner mt-12 text-center text-gray-700">
        <p>No testimonials available at the moment.</p>
      </section>
    );

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="py-6 px-4 bg-[#1f8fff]/10 rounded-3xl shadow-inner mt-12 max-w-5xl mx-auto"
    >
      <motion.h2
        variants={itemVariants}
        className="text-2xl font-bold text-center text-gray-800 mb-6"
      >
        What Our Clients Say
      </motion.h2>

      {/* Each child of Carousel is one full slide (up to 3 cards) */}
      <Carousel cardWidthClass="w-full" snapAlign="snap-center" interval={7000}>
        {slides.map((group, idx) => (
          <div
            key={idx}
            className="flex justify-center gap-4 px-2 lg:px-4 mb-4" // container for the 3 cards
          >
            {group.map((t) => (
              <motion.div
                key={t._id}
                variants={itemVariants}
                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center text-center transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] w-full sm:w-1/2 lg:w-1/3"
              >
                <div className="mb-4">
                  <img
                    src={t.profileImageURL || '/profile.png'}
                    alt={t.username}
                    width={80}
                    height={80}
                    className="rounded-full object-cover border-2 border-[#1f8fff] shadow-md"
                  />
                </div>
                <QuoteIcon />
                <p className="text-base text-gray-700 mb-4 italic font-light flex-grow h-[100px] overflow-hidden">
                  &quot;{t.review}&quot;
                </p>
                <div className="text-yellow-500 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} fill={i < t.rating} />
                  ))}
                </div>
                <p className="font-bold text-gray-800">{t.username}</p>
                <p className="text-sm text-gray-500">{t.location}</p>
              </motion.div>
            ))}
          </div>
        ))}
      </Carousel>
    </motion.section>
  );
};
