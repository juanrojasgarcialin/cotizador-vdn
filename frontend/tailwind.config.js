/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        vdn: {
          blue:    '#1565c0',
          bluedk:  '#0d47a1',
          bluelt:  '#1976d2',
          green:   '#6dbe04',
          greendk: '#5aaa02',
          pink:    '#e44993',
          dark:    '#1d1d1d',
          black:   '#010101',
          gray:    '#6c757d',
        },
      },
      fontFamily: {
        heading: ['Merriweather', 'Georgia', 'serif'],
        body:    ['Open Sans', 'sans-serif'],
      },
      backgroundImage: {
        'hero-overlay': 'linear-gradient(135deg, rgba(13,71,161,0.88) 0%, rgba(1,1,1,0.70) 100%)',
        'card-overlay': 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.72) 100%)',
      },
    },
  },
  safelist: [
    { pattern: /bg-vdn-/, variants: ['hover', 'active'] },
    { pattern: /text-vdn-/, variants: ['hover'] },
    { pattern: /border-vdn-/, variants: ['hover', 'focus'] },
    { pattern: /border-t-vdn-/ },
    { pattern: /border-l-vdn-/ },
    { pattern: /from-vdn-/ },
    { pattern: /via-vdn-/ },
    { pattern: /to-vdn-/ },
    { pattern: /ring-vdn-/ },
    { pattern: /shadow-vdn-/ },
  ],
  plugins: [],
}
