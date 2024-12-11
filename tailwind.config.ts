import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Основна кольорова схема
        background: {
          DEFAULT: '#0A0B0D',
          secondary: '#111214',
        },
        primary: {
          DEFAULT: '#B31701',
          hover: '#D31901',
          light: '#FF2D2D',
        },
        neutral: {
          100: '#FFFFFF',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        accent: {
          blue: '#3B82F6',
          purple: '#8B5CF6',
          green: '#10B981',
        }
      },
      boxShadow: {
        'glow': '0 0 20px rgba(179, 23, 1, 0.15)',
        'glow-strong': '0 0 30px rgba(179, 23, 1, 0.3)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(to right, #B31701, #FF2D2D)',
      },
    },
  },
  plugins: [],
};

export default config;