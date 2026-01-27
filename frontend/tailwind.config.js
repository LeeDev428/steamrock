/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a365d',
        secondary: '#2c5282',
        accent: '#c7996b',
        light: '#f7fafc',
        dark: '#1a202c',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}
