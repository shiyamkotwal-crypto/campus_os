/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        campus: {
          50: '#f0f5ff',
          100: '#e0ebff',
          200: '#c7dafe',
          300: '#a3c2fd',
          400: '#769ffa',
          500: '#4f75f5',
          600: '#3855ea',
          700: '#2c40d5',
          800: '#2836ac',
          900: '#253188',
          950: '#171e54'
        },
        slate: {
          850: '#151e2e',
          950: '#0a0f1d'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'premium': '0 10px 30px -10px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.02)'
      }
    },
  },
  plugins: [],
}

