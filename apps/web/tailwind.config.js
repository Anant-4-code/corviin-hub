/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: 'var(--color-canvas)',
        surface: {
          DEFAULT: 'var(--color-surface)',
          muted: 'var(--color-surface-muted)',
          elevated: 'var(--color-surface-elevated)',
          selected: 'var(--color-surface-selected)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          foreground: 'var(--color-accent-foreground)',
        },
        'ch-border': {
          DEFAULT: 'var(--color-border)',
          strong: 'var(--color-border-strong)',
        },
        'ch-text': {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
        },
        success: { DEFAULT: 'var(--color-success)', subtle: 'var(--color-success-subtle)' },
        warning: { DEFAULT: 'var(--color-warning)', subtle: 'var(--color-warning-subtle)' },
        danger: { DEFAULT: 'var(--color-danger)', subtle: 'var(--color-danger-subtle)' },
        info: { DEFAULT: 'var(--color-info)', subtle: 'var(--color-info-subtle)' },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      spacing: {
        sidebar: '15rem',
        'sidebar-collapsed': '4rem',
        topbar: '3.5rem',
        bottomnav: '4rem',
      },
    },
  },
  plugins: [],
};

