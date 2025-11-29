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
            DEFAULT: '#050505', // Preto profundo
            paper: '#0A0A0A',
        },
        glass: {
            DEFAULT: 'rgba(255, 255, 255, 0.03)',
            border: 'rgba(255, 255, 255, 0.08)',
            highlight: 'rgba(255, 255, 255, 0.1)',
        },
        primary: {
          DEFAULT: '#6366f1', // Indigo Neon
          glow: '#818cf8',
        },
        accent: {
          DEFAULT: '#ec4899', // Pink Neon
          glow: '#f472b6',
        }
      },
      backgroundImage: {
        'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #6366f1 0deg, #ec4899 180deg, #6366f1 360deg)',
      },
      animation: {
        'blob': 'blob 10s infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
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
  plugins: [
     function ({ addUtilities }) {
      addUtilities({
        '.perspective-1000': { 'perspective': '1000px' },
        '.preserve-3d': { 'transform-style': 'preserve-3d' },
        '.backface-hidden': { 'backface-visibility': 'hidden' },
        '.rotate-y-180': { 'transform': 'rotateY(180deg)' },
      })
    }
  ],
}