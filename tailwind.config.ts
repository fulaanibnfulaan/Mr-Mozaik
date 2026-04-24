import type { Config } from 'tailwindcss'
import animatePlugin from 'tailwindcss-animate'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    container: { center: true, padding: '1rem' },
    extend: {
      colors: {
        night: {
          DEFAULT: '#FFFFFF',
          2: '#F7F7F7',
          3: '#EEEEEE',
        },
        ember: {
          DEFAULT: '#D10000',
          deep: '#8B0000',
          glow: 'rgba(209,0,0,0.12)',
        },
        gold: {
          DEFAULT: '#D10000',
          light: '#FF3333',
        },
        cream: '#111111',
        sand:  '#777777',
        // shadcn compat
        border:      'hsl(var(--border))',
        input:       'hsl(var(--input))',
        ring:        'hsl(var(--ring))',
        background:  'hsl(var(--background))',
        foreground:  'hsl(var(--foreground))',
        primary:     { DEFAULT: '#D10000', foreground: '#FFFFFF' },
        secondary:   { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        muted:       { DEFAULT: 'hsl(var(--muted))',     foreground: 'hsl(var(--muted-foreground))' },
        accent:      { DEFAULT: 'hsl(var(--accent))',    foreground: 'hsl(var(--accent-foreground))' },
        card:        { DEFAULT: 'hsl(var(--card))',      foreground: 'hsl(var(--card-foreground))' },
        popover:     { DEFAULT: 'hsl(var(--popover))',   foreground: 'hsl(var(--popover-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body:    ['DM Sans', 'system-ui', 'sans-serif'],
        sans:    ['DM Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: { lg: '16px', md: '12px', sm: '8px', xl: '20px', '2xl': '24px' },
      boxShadow: {
        ember:    '0 4px 20px rgba(209,0,0,0.35)',
        'ember-lg': '0 8px 32px rgba(209,0,0,0.45)',
        gold:     '0 4px 16px rgba(209,0,0,0.25)',
        night:    '0 8px 32px rgba(0,0,0,0.10)',
        card:     '0 2px 16px rgba(0,0,0,0.06)',
      },
      backgroundImage: {
        'ember-gradient': 'linear-gradient(135deg, #D10000 0%, #8B0000 100%)',
        'gold-gradient':  'linear-gradient(135deg, #D10000 0%, #FF3333 50%, #D10000 100%)',
        'night-gradient': 'linear-gradient(180deg, #FFFFFF 0%, #F7F7F7 100%)',
        'card-gradient':  'linear-gradient(135deg, #FFFFFF 0%, #F7F7F7 100%)',
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up':   { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        shimmer:    { '0%': { backgroundPosition: '200% 0' }, '100%': { backgroundPosition: '-200% 0' } },
        'bounce-in': {
          '0%':   { transform: 'scale(0.85)', opacity: '0' },
          '70%':  { transform: 'scale(1.04)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'slide-up': {
          '0%':   { transform: 'translateY(24px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up':   'accordion-up 0.2s ease-out',
        shimmer:    'shimmer 1.6s infinite',
        'bounce-in': 'bounce-in 0.4s ease-out',
        'slide-up': 'slide-up 0.4s ease-out',
        float:      'float 3s ease-in-out infinite',
      },
    },
  },
  plugins: [animatePlugin],
}

export default config
