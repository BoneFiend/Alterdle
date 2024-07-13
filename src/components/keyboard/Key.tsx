import classnames from 'classnames'
import { ReactNode } from 'react'

import { CharStatus } from '../../lib/statuses'

type Props = {
  children?: ReactNode
  value: string
  longWidth?: boolean
  status?: CharStatus
  onClick: (value: string) => void
  isRevealing?: boolean
  numberOfLetters: number
}

export const Key = ({
  children,
  status,
  longWidth = false,
  value,
  onClick,
  isRevealing,
  numberOfLetters,
}: Props) => {
  const classes = classnames(
    'xshort:h-10 short:h-12 h-14 sm:h-16',
    'flex items-center justify-center rounded-lg mx-0.5 font-bold cursor-pointer select-none transition-all',
    {
      'w-[40px] sm:w-[64px] short:w-[40px] text-lg sm:text-3xl short:text-lg':
        !longWidth,
      'w-[65.4px] sm:w-[96px] short:w-[65.4px] text-base sm:text-2xl short:text-base':
        longWidth,
      'transition ease-in-out': isRevealing,
      'bg-key text-stone-900 dark:text-white hover:bg-key-deep active:bg-key-deeper':
        !status,
      'bg-absent text-white': status === 'absent',
      'bg-correct text-white hover:bg-correct-deep active:bg-correct-deeper':
        status === 'correct',
      'bg-present text-white hover:bg-present-deep active:bg-present-deeper':
        status === 'present',
    }
  )

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    onClick(value)
    event.currentTarget.blur()
  }

  return (
    <button
      aria-label={`${value}${status ? ' ' + status : ''}`}
      className={classes}
      onClick={handleClick}
    >
      {children || value}
    </button>
  )
}
