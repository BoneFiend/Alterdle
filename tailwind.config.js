const { nextui } = require('@nextui-org/react')

module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    colors: {
      'ui-foundation': {
        DEFAULT: 'rgb(var(--foundation))',
        2: 'rgb(var(--foundation-2))',
        light: 'rgb(var(--foundation-light))',
      },
      'ui-primary': {
        DEFAULT: 'rgb(var(--primary))',
        deep: 'rgb(var(--primary-deep))',
        deeper: 'rgb(var(--primary-deeper))',
        disabled: 'rgb(var(--primary-disabled))',
      },
      'ui-secondary': {
        DEFAULT: 'rgb(var(--secondary))',
        light: 'rgb(var(--secondary-light))',
        deep: 'rgb(var(--secondary-deep))',
        deeper: 'rgb(var(--secondary-deeper))',
      },
      'ui-main': 'rgb(var(--main))',
      accent: 'rgb(var(--accent))',
      'cell-border': 'rgb(var(--cell-border))',
      absent: 'rgb(var(--absent))',
      correct: {
        DEFAULT: 'rgb(var(--correct))',
        deep: 'rgb(var(--correct-deep))',
        deeper: 'rgb(var(--correct-deeper))',
      },
      present: {
        DEFAULT: 'rgb(var(--present))',
        deep: 'rgb(var(--present-deep))',
        deeper: 'rgb(var(--present-deeper))',
      },
      incorrect: 'rgb(var(--incorrect))',
      key: {
        DEFAULT: 'rgb(var(--key))',
        deep: 'rgb(var(--key-deep))',
        deeper: 'rgb(var(--key-deeper))',
      },
      transparent: 'transparent',
      black: '#000000',
      white: '#ffffff',
      red: 'rgb(255, 0, 0)',
      blue: '#3b82f6',
    },
    extend: {
      screens: {
        short: { raw: '(max-height: 650px)' },
        xshort: { raw: '(max-height: 560px)' },
        xxshort: { raw: '(max-height: 490px)' },
      },
      keyframes: {
        'cell-fill': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' },
        },
        'cell-reveal': {
          '0%': {
            transform: 'rotateX(0deg)',
            backgroundColor: 'transparent',
            borderColor: 'rgb(var(--cell-border))',
            color: 'rgb(var(--ui-main))',
            'text-shadow': '0px 0px 0px #000000',
          },
          '50%': {
            backgroundColor: 'transparent',
            borderColor: 'rgb(var(--cell-border))',
            color: 'rgb(var(--ui-main))',
            'text-shadow': '0px 0px 0px #000000',
          },
          '50.1%': {
            backgroundColor: 'inherit',
            borderColor: 'inherit',
            color: 'inherit',
          },
          '100%': { transform: 'rotateX(180deg)' },
        },
        'cell-reveal-invisible': {
          '0%': {
            transform: 'rotateX(0deg)',
            backgroundColor: 'transparent',
            borderColor: 'rgb(var(--cell-border))',
            color: 'rgb(var(--ui-main))',
            opacity: 0,
            maxHeight: '0rem',
            paddingTop: 0,
            marginTop: 0,
            borderTop: 0,
          },
          '50%': {
            backgroundColor: 'transparent',
            borderColor: 'rgb(var(--cell-border))',
            color: 'rgb(var(--ui-main))',
            opacity: 0,
            maxHeight: '3.5rem',
          },
          '50.1%': {
            backgroundColor: 'inherit',
            borderColor: 'inherit',
            color: 'inherit',
            opacity: 1,
          },
          '100%': { transform: 'rotateX(180deg)' },
        },
        'letter-flip': {
          '0%': { transform: 'rotateX(0deg)' },
          '100%': { transform: 'rotateX(180deg)' },
        },
        jiggle: {
          '0%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(-0.5rem, 0)' },
          '50%': { transform: 'translate(0.5rem, 0)' },
          '75%': { transform: 'translate(-0.5rem, 0)' },
          '100%': { transform: 'translate(0, 0)' },
        },
      },
      animation: {
        'cell-fill': 'cell-fill 0.15s linear',
        'cell-reveal': 'cell-reveal linear backwards',
        'cell-reveal-invisible': 'cell-reveal-invisible linear backwards',
        'letter-flip': 'letter-flip linear backwards',
        jiggle: 'jiggle 0.25s linear',
      },
    },
  },
  darkMode: 'class',
  plugins: [
    require('@tailwindcss/forms'),
    nextui({
      themes: {
        light: {
          colors: {
            warning: 'rgba(121, 1, 142)', // This is actually the primary colour
          },
        },
        dark: {
          colors: {
            warning: 'rgba(234, 115, 254)',
          },
        },
      },
    }),
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
}
