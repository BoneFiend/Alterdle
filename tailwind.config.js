module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
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
          DEFAULT: 'var(--primary-1)',
          2: 'var(--primary-2)',
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
        cell: 'var(--cell)',
        'cell-border': 'var(--cell-border)',
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
            backgroundColor: 'var(--cell)',
            borderColor: 'var(--cell-border)',
            color: 'var(--blank)',
          },
          '50%': {
            backgroundColor: 'var(--cell)',
            borderColor: 'var(--cell-border)',
            color: 'var(--blank)',
          },
          '50.1%': {
            backgroundColor: 'inherit',
            borderColor: 'inherit',
            color: 'inherit',
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
        'cell-reveal': 'cell-reveal 0.35s linear backwards',
        'letter-flip': 'letter-flip 0.35s linear backwards',
        jiggle: 'jiggle 0.25s linear',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
