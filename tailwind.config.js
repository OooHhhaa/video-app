/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ios-bg': '#000000',
        'ios-card': '#1C1C1E',
        'ios-secondary': '#2C2C2E',
        'ios-blue': '#0A84FF',
        'ios-green': '#30D158',
        'ios-orange': '#FF9F0A',
        'ios-red': '#FF453A',
        'ios-text': '#FFFFFF',
        'ios-text-secondary': '#8E8E93',
        'ios-border': '#38383A',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'sans-serif'],
      },
      borderRadius: {
        'ios-lg': '12px',
        'ios-md': '10px',
        'ios-sm': '8px',
      },
    },
  },
  plugins: [],
}
