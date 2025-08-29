const config = {
  plugins: ["@tailwindcss/postcss"],
  theme: {
    extend: {
      screens: {
        xl2: '1100px', // custom breakpoint
        navbreak: '1150px',
      }
    }
  }
};

export default config;


