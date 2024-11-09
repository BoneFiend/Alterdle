import { ReactNode } from 'react'

import { CharStatus } from '@constants/types'

import { useIsKeyActive } from '@stores/useActiveKeys'

import cn from '@lib/cn'

type Props = {
  children?: ReactNode
  value: string
  longWidth?: boolean
  status?: CharStatus
  onClick: (value: string) => void
  isRevealing?: boolean
}

export const Key = ({
  children,
  status,
  longWidth = false,
  value,
  onClick,
  isRevealing,
}: Props) => {
  const isActive = useIsKeyActive(value)

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    onClick(value)
    event.currentTarget.blur()
  }

  return (
    <button
      aria-label={`${value}${status ? ' ' + status : ''}`}
      className={cn(
        'h-14 sm:h-16 short:h-12 xshort:h-10',
        'mx-0.5 flex cursor-pointer select-none items-center justify-center rounded-lg font-bold transition-[background-color,border-color,width,height] active:duration-0 sm:rounded-xl',
        {
          'w-[40px] text-lg sm:w-[64px] sm:text-3xl short:w-[40px] short:text-lg':
            !longWidth,
          'w-[65.4px] text-base sm:w-[96px] sm:text-2xl short:w-[65.4px] short:text-base':
            longWidth,
          'ease-in-out': isRevealing,
          'bg-key text-white hover:bg-key-deep focus-visible:bg-key-deeper active:bg-key-deeper dark:text-white':
            !status,
          'bg-absent text-white': status === 'absent',
          'shadowed bg-correct text-white hover:bg-correct-deep focus-visible:bg-correct-deeper active:bg-correct-deeper':
            status === 'correct',
          'shadowed bg-present text-white hover:bg-present-deep focus-visible:bg-present-deeper active:bg-present-deeper':
            status === 'present',
          'bg-key-deeper transition-[width,height]': isActive && !status,
          'bg-correct-deeper transition-[width,height]':
            isActive && status === 'correct',
          'bg-present-deeper transition-[width,height]':
            isActive && status === 'present',
        },
      )}
      onClick={handleClick}
    >
      {children || value}
    </button>
  )
}
