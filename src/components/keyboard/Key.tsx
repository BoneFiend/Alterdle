import classnames from 'classnames'
import { ReactNode } from 'react'

import { REVEAL_TIME_MS } from '../../constants/settings'
import { CharStatus } from '../../lib/statuses'

type Props = {
  children?: ReactNode
  value: string
  width?: number
  status?: CharStatus
  onClick: (value: string) => void
  isRevealing?: boolean
  numberOfLetters: number
}

export const Key = ({
  children,
  status,
  width = 40,
  value,
  onClick,
  isRevealing,
  numberOfLetters,
}: Props) => {

  const keyDelayMs = REVEAL_TIME_MS * solution.length
  const keyDelayMs = REVEAL_TIME_MS * numberOfLetters

  const classes = classnames(
    'xxshort:h-8 xxshort:w-8 xxshort:text-xxs xshort:w-10 xshort:h-10 flex short:h-12 h-14 items-center justify-center rounded mx-0.5 text-xs font-bold cursor-pointer select-none dark:text-white',
    {
      'transition ease-in-out': isRevealing,
      'default-key': !status,
      absent: status === 'absent',
      'correct correct-key': status === 'correct',
      'present present-key': status === 'present',
    }
  )

  const styles = {
    transitionDelay: isRevealing ? `${keyDelayMs}ms` : 'unset',
    width: `${width}px`,
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
