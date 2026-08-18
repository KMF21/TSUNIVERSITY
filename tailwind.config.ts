import type { Config } from 'tailwindcss'

// Design tokens derived from the UniPulse reference the client approved:
// deep navy for header/footer/authority, crimson for CTAs/energy,
// soft rose tint for alternating section backgrounds.
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0F1F3D',
          50: '#EEF1F6',
          700: '#13284A',
          900: '#0A1730',
        },
        crimson: {
          DEFAULT: '#C4293B',
          50: '#FDF1F2',
          600: '#A81F30',
        },
        rose: {
          tint: '#FDF1F1',
        },
        ink: {
          DEFAULT: '#1C2536',
          muted: '#5B6478',
        },
      },
      fontFamily: {
        display: ['var(--font-sora)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
      },
    },
  },
  plugins: [],
}

export default config
