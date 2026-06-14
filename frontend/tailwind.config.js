/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        background: 'var(--bg-color)',
        foreground: 'var(--text-primary)',
        primary: 'var(--accent-primary)',
        gold: 'var(--accent-gold)',
        nav: 'var(--nav-bg)',
      },
      fontFamily: {
        serif: ['var(--font-cinzel)', 'serif'],
        sans: ['var(--font-montserrat)', 'sans-serif'],
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      },
      animation: {
        marquee: 'marquee 20s linear infinite',
      }
    },
  },
  plugins: [],
};
