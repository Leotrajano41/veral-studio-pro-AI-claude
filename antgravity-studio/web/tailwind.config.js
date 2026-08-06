/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0f0f0f',
          secondary: '#1a1a1a',
          tertiary: '#2d2d2d',
        },
        accent: {
          red: '#FF6B6B',
          teal: '#4ECDC4',
        },
        txt: {
          primary: '#FFFFFF',
          secondary: '#B0B0B0',
        },
        border: '#404040',
        success: '#4CAF50',
        error: '#FF5252',
        warning: '#FFC107',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        card: '8px',
        input: '4px',
      },
      transitionDuration: {
        DEFAULT: '200ms',
      },
      boxShadow: {
        card: '0 10px 30px rgba(0,0,0,0.3)',
        glow: '0 0 20px rgba(255,107,107,0.15)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [],
};
