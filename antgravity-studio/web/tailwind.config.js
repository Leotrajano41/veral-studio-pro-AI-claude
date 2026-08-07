/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        bg: {
          primary: '#1a1a1a',
          secondary: '#2a2a2a',
          tertiary: '#333333',
        },
        primary: {
          DEFAULT: '#FF6B6B',
          hover: '#FF5252',
        },
        secondary: {
          DEFAULT: '#A78BFA',
          hover: '#8B5CF6',
        },
        accent: {
          red: '#FF6B6B',
          purple: '#A78BFA',
          teal: '#4ECDC4',
        },
        txt: {
          primary: '#FFFFFF',
          secondary: '#B0B0B0',
        },
        border: '#444444',
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', '-apple-system', 'sans-serif'],
        mono: ['Courier New', 'Courier', 'monospace'],
      },
      borderRadius: {
        card: '8px',
        input: '6px',
      },
      transitionDuration: {
        DEFAULT: '180ms',
      },
      boxShadow: {
        card: '0 10px 30px rgba(0,0,0,0.4)',
        glow: '0 0 20px rgba(255,107,107,0.2)',
        purpleGlow: '0 0 20px rgba(167,139,250,0.2)',
      },
    },
  },
  plugins: [],
};
