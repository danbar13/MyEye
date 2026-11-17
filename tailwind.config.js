/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Assistant', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        medical: {
          blue: '#0284c7',
          darkBlue: '#0369a1',
          teal: '#0d9488',
          amber: '#d97706',
          rose: '#e11d48',
          purple: '#7c3aed'
        }
      }
    },
  },
  plugins: [],
}
