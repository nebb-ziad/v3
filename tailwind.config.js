/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#05060a',
          900: '#0b0d14',
          800: '#12151f',
          700: '#1b1f2c',
        },
        paper: {
          50: '#f5f6fa',
          100: '#ffffff',
          200: '#e9ebf3',
        },
        signal: {
          400: '#6f8dff',
          500: '#3d63ff',
          600: '#2547e0',
          glow: 'rgba(61,99,255,0.35)',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        mono: ['"Space Mono"', 'ui-monospace', 'monospace'],
        pixel: ['Silkscreen', 'monospace'],
        brand: ['"Space Grotesk"', 'sans-serif'],
        syne: ['Syne', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.22em',
        widest3: '0.32em',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'out-back': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      keyframes: {
        marquee: { to: { transform: 'translateX(-33.3333%)' } },
        drawSig: { to: { strokeDashoffset: 0 } },
        floatSlow: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeIn: {
          from: { opacity: 0, transform: 'translateY(6px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.05)' },
        },
      },
      animation: {
        marquee: 'marquee 22s linear infinite',
        floatSlow: 'floatSlow 6s ease-in-out infinite',
        glowPulse: 'glowPulse 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
