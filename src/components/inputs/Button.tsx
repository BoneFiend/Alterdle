import React, { useState } from 'react'

import { type VariantProps, cva } from 'class-variance-authority'

import cn from '@lib/cn'

const variants = cva(
  'inline-flex items-center justify-center bg-accent text-white shadow-sm hover:bg-accent-deep active:bg-accent-deeper disabled:bg-accent-disabled dark:text-secondary',
  {
    variants: {
      variant: {
        default:
          'w-full rounded-xl border border-transparent px-7 py-2 text-center',
        basic: 'rounded p-1',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

interface Props
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof variants> {}

export const Button = React.forwardRef<HTMLButtonElement, Props>(
  ({ children, className, variant, type = 'button', ...props }, ref) => {
    const [isHovered, setIsHovered] = useState(false)

    return (
      <button
        ref={ref}
        className={cn(
          variants({ variant, className }),
          isHovered && 'transition-none',
          !isHovered && 'transition-colors duration-500',
        )}
        type={type}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        {children}
      </button>
    )
  },
)
