import React, { useState } from 'react'

import { type VariantProps, cva } from 'class-variance-authority'

import cn from '@lib/cn'

export const buttonVariants = cva(
  'inline-flex items-center justify-center font-semibold shadow-sm transition-colors disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default:
          'w-full rounded-xl border border-transparent px-7 py-2 text-center',
        basic: 'rounded p-1',
      },
      priority: {
        primary:
          'bg-ui-primary text-ui-secondary-light hover:bg-ui-primary-deep focus-visible:bg-ui-primary-deep active:bg-ui-primary-deeper disabled:bg-ui-primary-disabled dark:text-ui-secondary-deeper disabled:dark:text-ui-main/30',
        secondary:
          'disabled:bg-ui-secondary-disabled border-3 border-ui-secondary-deep bg-ui-secondary text-ui-primary-deep hover:bg-ui-secondary-deep active:border-ui-secondary-deeper active:bg-ui-secondary-deeper dark:text-ui-primary',
      },
    },
    defaultVariants: {
      variant: 'default',
      priority: 'primary',
    },
  },
)

interface Props
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, Props>(
  (
    { children, className, variant, priority, type = 'button', ...props },
    ref,
  ) => {
    const [isHovered, setIsHovered] = useState(false)

    return (
      <button
        ref={ref}
        className={cn(
          buttonVariants({ variant, priority: priority }),
          isHovered ? 'duration-75' : 'duration-500',
          className,
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
