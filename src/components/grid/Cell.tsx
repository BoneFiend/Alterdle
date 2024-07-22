import classnames from 'classnames'

import { REVEAL_TIME_MS } from '../../constants/settings'
import { CharStatus } from '../../lib/statuses'

type Props = {
  value?: string
  status?: CharStatus
  isRevealing?: boolean
  isCompleted?: boolean
  position?: number
  helpModal?: boolean
  isFocussed?: boolean
  numberOfLetters?: number
  numberOfWords?: number
}

export const Cell = ({
  value,
  status,
  isRevealing,
  isCompleted,
  position = 0,
  helpModal = false,
  isFocussed = true,
  numberOfLetters = 1,
  numberOfWords = 1,
}: Props) => {
  const isFilled = value && !isCompleted
  const shouldReveal = isRevealing && isCompleted
  const animationDelay = isRevealing ? `${position * REVEAL_TIME_MS}ms` : ''

  const crampedGrids = numberOfLetters > 7 || numberOfWords > 2

  const classes = classnames(
    'border-solid border-2 flex items-center justify-center mx-0.5 font-bold rounded sm:rounded-md transition-[height] duration-300 ease-in-out select-none',
    {
      'text-4xl w-14 h-14': !crampedGrids && !helpModal,
      'md:text-4xl text-2xl w-8 h-8 md:w-14 md:h-14 ':
        crampedGrids && !helpModal && isFocussed,
      'md:text-4xl text-2xl w-8 h-6 md:w-14 md:h-10':
        crampedGrids && !helpModal && !isFocussed,
      'text-3xl sm:text-4xl h-10 w-10 sm:h-14 sm:h-14 ': helpModal,
      'border-cell-deep shadow-inner': !status || (!value && status === 'null'), // empty cell
      'border-cell-border-value text-blank': value && status === 'null',
      'bg-absent border-absent text-white shadowed': status === 'absent',
      'bg-correct text-white border-correct shadowed': status === 'correct',
      'bg-present border-present text-white shadowed': status === 'present',
      'bg-incorrect border-incorrect transition-colors ease-out duration-100 text-white shadowed':
        status === 'incorrect',
      'animate-cell-fill': isFilled,
      'animate-cell-reveal': shouldReveal && status !== 'incorrect',
      'animate-cell-reveal-incorrect': shouldReveal && status === 'incorrect',
    }
  )

  return (
    <div className={classes} style={{ animationDelay }}>
      <div
        className={shouldReveal ? 'animate-letter-flip' : ''}
        style={{ animationDelay }}
      >
        {value}
      </div>
    </div>
  )
}
