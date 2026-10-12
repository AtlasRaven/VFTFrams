/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2E7D32',
          hover: '#1B5E20',
          light: '#E8F5E9',
          border: '#C8E6C9',
          accent: '#4CAF50',
        },
        nature: {
          green: '#2E7D32',
          lime: '#4CAF50',
          light: '#F1F8E9',
          badge: '#2E7D32',
        },
      },
    },
  },
  plugins: [],
};
