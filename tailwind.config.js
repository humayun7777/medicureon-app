/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'medicure-primary': '#02276F',
        'medicure-secondary': '#14365C', 
        'medicure-accent': '#F1C40F',
        'medicure-light': '#86B7F7',
        'medicure-success': '#00FC14',
        'medicure-error': '#C80C0C',
      }
    },
  },
  plugins: [],
}