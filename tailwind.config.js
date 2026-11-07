/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#eef3fb',
          100: '#d9e3f5',
          200: '#b3c7ea',
          300: '#7f9fd6',
          400: '#4c74bd',
          500: '#2c55a0',
          600: '#1f4282',
          700: '#183467',
          800: '#13284f',
          900: '#0d1d3a',
          950: '#081227',
        },
        teal: {
          50: '#ecfbf8',
          100: '#cff5ee',
          200: '#a0eadd',
          300: '#63d7c6',
          400: '#2fbcab',
          500: '#159f90',
          600: '#0e8076',
          700: '#0f6660',
          800: '#11524e',
          900: '#124441',
        },
        sun: {
          50: '#fff8eb',
          100: '#ffecc6',
          200: '#ffd888',
          300: '#ffbf4a',
          400: '#ffa621',
          500: '#f98508',
          600: '#dd6203',
          700: '#b74306',
          800: '#94330c',
          900: '#7a2b0d',
        },
      },
      fontSize: {
        // Raised minimums for older eyes (root is 18px by default): xs ≈ 15px, sm ≈ 17px.
        xs: ['0.85rem', { lineHeight: '1.35' }],
        sm: ['0.94rem', { lineHeight: '1.45' }],
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans SC',
          'PingFang SC',
          'Microsoft YaHei',
          'sans-serif',
        ],
      },
      boxShadow: {
        card: '0 1px 2px rgba(13,29,58,0.06), 0 4px 16px rgba(13,29,58,0.08)',
        lift: '0 8px 30px rgba(13,29,58,0.16)',
      },
      keyframes: {
        pop: {
          '0%': { transform: 'scale(0.4) rotate(-8deg)', opacity: '0' },
          '60%': { transform: 'scale(1.08) rotate(2deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        floatUp: {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        confetti: {
          '0%': { transform: 'translateY(-20vh) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(110vh) rotate(720deg)', opacity: '0.9' },
        },
        pulseRing: {
          '0%': { boxShadow: '0 0 0 0 rgba(255,166,33,0.75)' },
          '70%': { boxShadow: '0 0 0 14px rgba(255,166,33,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(255,166,33,0)' },
        },
      },
      animation: {
        pop: 'pop 0.6s cubic-bezier(.2,.9,.3,1.2) both',
        floatUp: 'floatUp 0.35s ease-out both',
        pulseRing: 'pulseRing 1.6s ease-out infinite',
      },
    },
  },
  plugins: [],
};
