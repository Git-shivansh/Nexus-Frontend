/** @type {import('tailwindcss').Config} */
export default {
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
   theme: {
    extend: {
      fontFamily: {
  inter: ['Inter', 'ui-sans-serif', 'system-ui'],
  lato: ['Lato', 'sans-serif'],
      },
      colors: {
        'brand-background': '#ffffffff',
        'lorange-background': '#bbbbbbff',
      },
    },
  },
  plugins: [], 
}
