/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        bg: '#050505',
        surface: '#0A0A0A',
        primary: '#6366f1',
        accent: '#ec4899',
      },
    },
  },
  plugins: [],
}