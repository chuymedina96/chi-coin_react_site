/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Chi flag colors — exact match to React Native app theme.js
        'chi-blue':        '#0F5EA8',
        'chi-blue-light':  '#41B6E6',
        'chi-blue-dim':    '#0A4C87',
        'chi-red':         '#E53950',
        'chi-red-light':   '#F26B7B',
        'chi-red-dim':     '#A7283A',
        // "Gold" remapped to sky-blue for presidential red-white-blue palette
        'chi-gold':        '#41B6E6',

        // Page backgrounds (LIGHT — matching app COLORS)
        'bg-dark':         '#EEF2F6',  // app pageBg
        'bg-card':         '#FFFFFF',  // white cards
        'bg-card-2':       '#F8FBFE',  // app slate

        // Borders
        'chi-border':      '#D8E0E8',
        'chi-border-soft': '#BFD0DE',

        // Soft accent backgrounds
        'soft-blue':       '#EAF6FC',
        'soft-red':        '#FCECEF',

        // Text hierarchy (ink-* prefix avoids Tailwind naming conflicts)
        'ink':             '#111827',
        'ink-dim':         '#4B5563',
        'ink-muted':       '#66768A',
        'ink-faint':       '#7D8DA1',
        'ink-navy':        '#23415E',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float':      'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'spin-slow':  'spin 20s linear infinite',
        'gradient':   'gradient 8s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-20px)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
      },
      backgroundSize: {
        '300%': '300%',
      },
    },
  },
  plugins: [],
}
