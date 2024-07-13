import { type VariantProps, cva } from 'class-variance-authority'
import classnames from 'classnames'
import React from 'react'

const variants = cva('inline-flex disabled:opacity-50', {
  variants: {
    variant: {
      default: 'accent-button-large',
      basic: 'accent-button p-1 shadow-sm rounded inline-flex',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

interface Props
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof variants> {}

export const Button = React.forwardRef<HTMLButtonElement, Props>(
  ({ children, className, variant, type = 'button', ...props }, ref) => {
    return (
      <button
        className={classnames(variants({ variant, className }))}
        type={type}
        {...props}
      >
        {children}
      </button>
    )
  }
)
