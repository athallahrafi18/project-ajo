/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FDF8F5',
          100: '#F8E8E0',
          200: '#F3D1C7',
          300: '#EEBAA9',
          400: '#E9A38C',
          500: '#E48C6E',
          600: '#DF7550',
          700: '#DA5E32',
          800: '#B84B24',
          900: '#96391B',
        },
        secondary: {
          50: '#F5F7FA',
          100: '#E4E7EB',
          200: '#CBD2D9',
          300: '#9AA5B1',
          400: '#7B8794',
          500: '#616E7C',
          600: '#52606D',
          700: '#3E4C59',
          800: '#323F4B',
          900: '#1F2933',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  variants: {
    scrollbar: ['rounded'], // ✅ Tambahkan ini
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
};