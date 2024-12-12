import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
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
      container: {
        center: true,
        padding: '2rem',
        screens: {
          '2xl': '1400px',
        },
      }
    },
  },
  plugins: [],
}

export default config