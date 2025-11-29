module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        primary: {
          accent: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
        },
        muted: 'var(--color-text-muted)',
      },
    },
  },
  plugins: [],
}