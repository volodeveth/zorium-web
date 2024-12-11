import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0A0B0D',
        card: '#151515',
        primary: {
          DEFAULT: '#B31701',
          hover: '#D31901',
        },
        neutral: {
          100: '#FFFFFF',
          400: '#9CA3AF',
          700: '#374151',
        },
      },
      boxShadow: {
        glow: '0 0 20px rgba(179, 23, 1, 0.15)',
      },
    },
  },
  plugins: [],
};

export default config;