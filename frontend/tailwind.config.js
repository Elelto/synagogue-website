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
      }
    },
  },
  plugins: [],
  darkMode: 'class',
}
