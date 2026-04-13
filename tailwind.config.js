/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-tertiary': 'var(--text-tertiary)',
        border: 'var(--border)',
        'surface-dark': 'var(--surface-dark)',
        'surface-dark-text': 'var(--surface-dark-text)',
        'bar-fill': 'var(--bar-fill)',
        'bar-track': 'var(--bar-track)',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        '2xs': '10px',
        xxs: '11px',
      },
    },
  },
  plugins: [],
};
