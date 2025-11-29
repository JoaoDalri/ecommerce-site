/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-outfit)', 'sans-serif'],
      },
      colors: {
        bg: {
            DEFAULT: '#050505', // Almost black
            paper: '#0A0A0A',
        },
        glass: {
            DEFAULT: 'rgba(255, 255, 255, 0.03)',
            border: 'rgba(255, 255, 255, 0.08)',
            highlight: 'rgba(255, 255, 255, 0.1)',
        },
        primary: {
          DEFAULT: '#6366f1', // Indigo
          glow: '#818cf8',
        },
        accent: {
          DEFAULT: '#ec4899', // Pink
          glow: '#f472b6',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #6366f1 0deg, #ec4899 180deg, #6366f1 360deg)',
      },
      animation: {
        'blob': 'blob 7s infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      },
    },
  },
  plugins: [],
}