import { ReactNode } from 'react'

import { CharStatus } from '@constants/types'

import cn from '@lib/cn'

type Props = {
  children?: ReactNode
  value: string
  longWidth?: boolean
  status?: CharStatus
  onClick: (value: string) => void
  isRevealing?: boolean
  isActive: boolean
}

export const Key = ({
  children,
  status,
  longWidth = false,
  value,
  onClick,
  isRevealing,
  isActive,
}: Props) => {
  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    onClick(value)
    event.currentTarget.blur()
  }

  return (
    <button
      aria-label={`${value}${status ? ' ' + status : ''}`}
      className={cn(
        'h-14 sm:h-16 short:h-12 xshort:h-10',
        'mx-0.5 flex cursor-pointer select-none items-center justify-center rounded-lg font-bold transition-all sm:rounded-xl',
        {
          'w-[40px] text-lg sm:w-[64px] sm:text-3xl short:w-[40px] short:text-lg':
            !longWidth,
          'w-[65.4px] text-base sm:w-[96px] sm:text-2xl short:w-[65.4px] short:text-base':
            longWidth,
          'transition ease-in-out': isRevealing,
          'bg-key text-white hover:bg-key-deep active:bg-key-deeper dark:text-white':
            !status,
          'bg-absent text-white': status === 'absent',
          'shadowed bg-correct text-white hover:bg-correct-deep active:bg-correct-deeper':
            status === 'correct',
          'shadowed bg-present text-white hover:bg-present-deep active:bg-present-deeper':
            status === 'present',
          'bg-key-deeper transition-none': isActive && !status,
          'bg-correct-deeper transition-none': isActive && status === 'correct',
          'bg-present-deeper transition-none': isActive && status === 'present',
        },
      )}
      onClick={handleClick}
    >
      {children || value}
    </button>
  )
}
