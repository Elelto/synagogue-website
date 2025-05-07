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
          gold: '#FFD700',
          hover: {
            gold: '#FFC500'
          },
          navy: '#1B365D',
          burgundy: '#8B0000',
        }
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' }
        },
        shine: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' }
        }
      },
      animation: {
        flicker: 'flicker 5s ease-in-out infinite',
        shine: 'shine 3s linear infinite'
      },
      backgroundSize: {
        'shine': '200% 100%'
      }
    },
  },
  plugins: [],
  darkMode: 'class',
}
