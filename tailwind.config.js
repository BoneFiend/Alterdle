const { nextui } = require('@nextui-org/react')

module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        short: { raw: '(max-height: 650px)' },
        xshort: { raw: '(max-height: 560px)' },
        xxshort: { raw: '(max-height: 490px)' },
      },
      colors: {
        primary: {
          1: 'var(--primary-1)',
          2: 'var(--primary-2)',
          '1-light-mode': 'var(--primary-1-light-mode)',
          '2-light-mode': 'var(--primary-2-light-mode)',
          '1-dark-mode': 'var(--primary-1-dark-mode)',
          '2-dark-mode': 'var(--primary-2-dark-mode)',
          light: 'var(--primary-light)',
        },
        secondary: {
          DEFAULT: 'var(--secondary-1)',
          2: 'var(--secondary-2)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          deep: 'var(--accent-deep)',
          deeper: 'var(--accent-deeper)',
          disabled: 'var(--accent-disabled)',
        },
        cell: {
          deep: 'var(--cell-border)',
          'border-value': 'var(--cell-border-value)',
        },
        blank: 'var(--blank)',
        absent: 'var(--absent)',
        correct: {
          DEFAULT: 'var(--correct)',
          deep: 'var(--correct-deep)',
          deeper: 'var(--correct-deeper)',
        },
        present: {
          DEFAULT: 'var(--present)',
          deep: 'var(--present-deep)',
          deeper: 'var(--present-deeper)',
        },
        incorrect: 'var(--incorrect)',
        key: {
          DEFAULT: 'var(--key)',
          deep: 'var(--key-deep)',
          deeper: 'var(--key-deeper)',
        },
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
            borderColor: 'var(--cell-border-value)',
            color: 'var(--blank)',
            'text-shadow': '0px 0px 0px #000000',
          },
          '50%': {
            backgroundColor: 'transparent',
            borderColor: 'var(--cell-border-value)',
            color: 'var(--blank)',
            'text-shadow': '0px 0px 0px #000000',
          },
          '50.1%': {
            backgroundColor: 'inherit',
            borderColor: 'inherit',
            color: 'inherit',
          },
          '100%': { transform: 'rotateX(180deg)' },
        },
        'cell-reveal-incorrect': {
          '0%': {
            transform: 'rotateX(0deg)',
            backgroundColor: 'transparent',
            borderColor: 'var(--cell-border-value)',
            color: 'var(--blank)',
            opacity: 0,
            maxHeight: '0rem',
            paddingTop: 0,
            marginTop: 0,
            borderTop: 0,
          },
          '50%': {
            backgroundColor: 'transparent',
            borderColor: 'var(--cell-border-value)',
            color: 'var(--blank)',
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
        'cell-reveal-incorrect': 'cell-reveal-incorrect linear backwards',
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
            warning: 'rgba(111, 6, 116)', // This is actually the accent colour
          },
        },
        dark: {
          colors: {
            warning: 'rgba(255, 93, 115)',
          },
        },
      },
    }),
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
}
