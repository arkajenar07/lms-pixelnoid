/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{vue,js,ts,jsx,tsx}",
    "./components/**/*.{vue,js,ts,jsx,tsx}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
  ],
  theme: {
    extend: {
      animation: {
        'glow-pulse': 'glowPulse 7s ease-in-out infinite',
        'glow-pulse-reverse': 'glowPulse 10s ease-in-out infinite reverse',
        'float-dot': 'floatDot linear infinite',
        'fade-up': 'fadeUp .65s ease both',
        'badge-pulse': 'badgePulse 1.6s ease-in-out infinite',
        'underline-grow': 'underlineGrow .8s .5s cubic-bezier(.4,0,.2,1) both',
        'pop-in': 'popIn .5s 1s cubic-bezier(.34,1.56,.64,1) both',
        'step-pop': 'stepPop .4s cubic-bezier(.34,1.56,.64,1) both',
        'fill-bar': 'fillBar 1.1s .85s cubic-bezier(.4,0,.2,1) both',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.1)', opacity: '.65' },
        },
        floatDot: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '.6' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateY(-80px) rotate(180deg)', opacity: '.15' },
        },
        fadeUp: {
          'from': { opacity: '0', transform: 'translateY(18px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        badgePulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(68,62,141,.45)' },
          '50%': { boxShadow: '0 0 0 5px rgba(68,62,141,0)' },
        },
        underlineGrow: {
          'from': { transform: 'scaleX(0)' },
          'to': { transform: 'scaleX(1)' },
        },
        popIn: {
          'from': { transform: 'scale(0) rotate(-8deg)', opacity: '0' },
          'to': { transform: 'scale(1) rotate(0)', opacity: '1' },
        },
        stepPop: {
          'from': { transform: 'scale(0)' },
          'to': { transform: 'scale(1)' },
        },
        fillBar: {
          'from': { width: '0' },
          'to': { width: 'var(--w, 0%)' },
        },
      },
    },
  },
  plugins: [],
}
