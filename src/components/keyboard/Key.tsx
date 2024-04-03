import classnames from 'classnames'
import { ReactNode } from 'react'

import { REVEAL_TIME_MS } from '../../constants/settings'
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
  const keyDelayMs = REVEAL_TIME_MS * numberOfLetters

  const classes = classnames(
    'xshort:h-10 short:h-12 h-14 sm:h-16 ',
    'flex items-center justify-center rounded mx-0.5 font-bold cursor-pointer select-none dark:text-white text-stone-900 transition-all',
    {
      'w-[40px] sm:w-[64px] short:w-[40px] text-lg sm:text-3xl short:text-lg':
        !longWidth,
      'w-[65.4px] sm:w-[96px] short:w-[65.4px] text-base sm:text-2xl short:text-base':
        longWidth,
      'transition ease-in-out': isRevealing,
      'default-key': !status,
      absent: status === 'absent',
      'correct correct-key': status === 'correct',
      'present present-key': status === 'present',
    }
  )

  const styles = {
    transitionDelay: isRevealing ? `${keyDelayMs}ms` : 'unset',
  }

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    onClick(value)
    event.currentTarget.blur()
  }

  return (
    <button
      style={styles}
      aria-label={`${value}${status ? ' ' + status : ''}`}
      className={classes}
      onClick={handleClick}
    >
      {children || value}
    </button>
  )
}
