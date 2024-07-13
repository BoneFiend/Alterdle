import { type VariantProps, cva } from 'class-variance-authority'
import classnames from 'classnames'
import React from 'react'

const variants = cva(
  'inline-flex items-center justify-center shadow-sm text-white bg-accent hover:bg-accent-deep active:bg-accent-deeper disabled:bg-accent-disabled',
  {
    variants: {
      variant: {
        default:
          'mt-2 w-full rounded-xl border border-transparent px-4 py-2 text-center',
        basic: 'p-1 rounded',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

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
