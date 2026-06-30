/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        medical: {
          bg: '#04060a',
          panel: 'rgba(10, 16, 30, 0.55)',
          border: 'rgba(0, 242, 254, 0.15)',
          glow: 'rgba(0, 242, 254, 0.05)',
          cyan: '#00f2fe',
          purple: '#a100ff',
          green: '#39ff14',
          orange: '#ff9900',
          red: '#ff073a',
          textPrimary: '#f0f4f8',
          textSecondary: '#8fa0b0',
          textDim: '#54687a',
        }
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
        cyanGlow: '0 0 15px rgba(0, 242, 254, 0.3)',
        purpleGlow: '0 0 15px rgba(161, 0, 255, 0.3)',
        redGlow: '0 0 15px rgba(255, 7, 58, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
