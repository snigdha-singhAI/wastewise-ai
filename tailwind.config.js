/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#070b14',
          surface: '#0d1527',
          card: 'rgba(13, 21, 39, 0.75)',
          cardSolid: '#111d35',
          border: 'rgba(56, 189, 248, 0.15)',
          muted: '#64748b'
        },
        cyber: {
          cyan: '#00f0ff',
          blue: '#38bdf8',
          purple: '#a855f7',
          orange: '#f97316',
          red: '#ef4444',
          green: '#10b981',
          yellow: '#eab308'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 240, 255, 0.35)',
        'glow-purple': '0 0 20px rgba(168, 85, 247, 0.35)',
        'glow-red': '0 0 20px rgba(239, 68, 68, 0.45)',
        'glow-orange': '0 0 20px rgba(249, 115, 22, 0.4)',
        'glow-green': '0 0 20px rgba(16, 185, 129, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      }
    },
  },
  plugins: [],
}
