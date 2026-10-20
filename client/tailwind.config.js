/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        forest: '#244d36',
        leaf: '#36734b',
        lime: '#cde58a',
        canvas: '#f7f8f2',
        ink: '#17271d',
        muted: '#718076',
        line: '#e5eae1',
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Devanagari', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 12px 36px rgba(30, 57, 39, 0.07)',
      },
    },
  },
  plugins: [],
}
