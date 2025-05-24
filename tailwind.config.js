/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        // Default shadow
        'custom-lg': 'rgba(17, 17, 26, 0.1) 0px 12px 24px, rgba(17, 17, 26, 0.1) 0px 16px 48px, rgba(17, 17, 26, 0.1) 0px 24px 112px',
        // Hover shadow
        'custom-xl': 'rgba(17, 17, 26, 0.2) 0px 24px 48px, rgba(17, 17, 26, 0.2) 0px 32px 96px, rgba(17, 17, 26, 0.2) 0px 64px 256px',
      },
    },
  },
  plugins: [],
};
