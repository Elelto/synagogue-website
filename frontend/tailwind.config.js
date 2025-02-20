/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
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
