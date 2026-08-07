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
          primary: '#0F172A',
          secondary: '#1E293B',
          tertiary: '#334155',
        },
        primary: {
          DEFAULT: '#6366F1',
          hover: '#4F46E5',
        },
        secondary: {
          DEFAULT: '#8B5CF6',
          hover: '#7C3AED',
        },
        accent: {
          indigo: '#6366F1',
          purple: '#8B5CF6',
          cyan: '#06B6D4',
          teal: '#14B8A6',
        },
        txt: {
          primary: '#F8FAFC',
          secondary: '#94A3B8',
        },
        border: '#334155',
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
        card: '0 10px 30px rgba(0,0,0,0.5)',
        glow: '0 0 20px rgba(99,102,241,0.35)',
        purpleGlow: '0 0 20px rgba(139,92,246,0.35)',
      },
    },
  },
  plugins: [],
};
