/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          dark: 'var(--purple-dark)',
          medium: 'var(--purple-medium)',
          light: 'var(--purple-light)',
          accent: 'var(--purple-accent)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
        },
      },
      backgroundColor: {
        glass: 'var(--glass-bg)',
      },
      borderColor: {
        glass: 'var(--glass-border)',
      },
      boxShadow: {
        glass: 'var(--glass-shadow)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease forwards',
        'slide-down': 'slideDown 0.5s ease forwards',
        'slide-in': 'slideIn 0.3s ease',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
    },
  },
  plugins: [],
};
