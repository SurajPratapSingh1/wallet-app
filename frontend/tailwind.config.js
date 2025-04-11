/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // 🔥 This is required for custom dark mode toggle
  theme: {
    extend: {},
  },
  plugins: [],
}
