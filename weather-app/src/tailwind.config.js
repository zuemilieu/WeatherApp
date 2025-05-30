/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",   // Scan all JS/JSX files in src
    "./public/index.html"                 // Scan the public HTML
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

