/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xl2: "1100px",   // for layouts needing 1100px breakpoint
        navbreak: "1150px", // for your navbar toggle between menu/links
      },
      // You can extend colors, font families, etc. here if needed
    },
  },
  plugins: [],
};