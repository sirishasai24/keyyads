// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // This is where you configure the font-sans utility
        sans: ['var(--font-alata)', 'sans-serif'], // 'sans-serif' as a generic fallback
      },
      
    },
  },
  plugins: [],
};

export default config;