/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        synagogue: {
          gold: '#C6A455',
          navy: '#1B365D',
          burgundy: '#8B0000',
        }
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' }
        }
      },
      animation: {
        flicker: 'flicker 1.5s ease-in-out infinite'
      }
    },
  },
  plugins: [],
  darkMode: 'class',
}
