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
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
