/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'church-gold': '#C9A84C',
        'church-navy': '#1B2A4A',
        'church-cream': '#F5F0E8',
      },
      fontFamily: {
        'display': ['Georgia', 'serif'],
        'sans': ['Inter', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
}