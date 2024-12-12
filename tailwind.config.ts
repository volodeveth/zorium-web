import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',  // Змінено для охоплення всіх файлів в src
  ],
  darkMode: ['class'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#B31701',
          hover: '#FF2D2D',
        },
        background: '#0A0B0D',
        card: {
          DEFAULT: '#151515',
          hover: '#1A1A1A',
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(179, 23, 1, 0.15)',
        'glow-lg': '0 0 30px rgba(179, 23, 1, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;