import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#be1200',
          hover: '#d41515',
        },
        background: '#1E2023',
        card: {
          DEFAULT: '#2A2D31',
          hover: '#323538',
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