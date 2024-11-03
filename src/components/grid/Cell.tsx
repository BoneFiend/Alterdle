import { REVEAL_TIME_MS } from '@constants/settings'
import { CharStatus } from '@constants/types'

import useClientSettings from '@stores/useClientSettings'

import cn from '@lib/cn'

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
  const isPerfMode = useClientSettings((s) => s.isPerfMode)

  const isFilled = value && !isCompleted
  const shouldReveal = isRevealing && isCompleted
  const animationDelay = isRevealing ? `${position * REVEAL_TIME_MS}ms` : ''
  const animationDuration = isRevealing ? `${REVEAL_TIME_MS}ms` : ''

  const crampedGrids = numberOfLetters > 7 || numberOfWords > 2

  const classes = cn(
    'mx-0.5 transform-gpu select-none rounded border-2 border-solid font-bold sm:rounded-md',
    {
      'transition-[height,width] duration-300 ease-in-out': !isPerfMode,
      'h-14 w-14 text-4xl': !crampedGrids && !helpModal,
      'h-8 w-8 text-2xl md:h-14 md:w-14 md:text-4xl':
        crampedGrids && !helpModal && isFocussed,
      'h-6 w-8 text-2xl md:h-10 md:w-14 md:text-4xl':
        crampedGrids && !helpModal && !isFocussed,
      'h-10 w-10 text-3xl sm:h-14 sm:text-4xl': helpModal,
      'border-cell-border/50': !status || (!value && status === 'null'), // empty cell
      'border-cell-border text-ui-main': value && status === 'null',
      'shadowed border-absent bg-absent text-white': status === 'absent',
      'shadowed border-correct bg-correct text-white': status === 'correct',
      'shadowed border-present bg-present text-white': status === 'present',
      'shadowed border-incorrect bg-incorrect text-white transition-colors duration-100 ease-out':
        status === 'incorrect',
      'animate-cell-fill': isFilled,
      'animate-cell-reveal': shouldReveal && status !== 'incorrect',
      'animate-cell-reveal-invisible': shouldReveal && status === 'incorrect',
    },
  )

  return (
    <div className={classes} style={{ animationDelay, animationDuration }}>
      <div
        className={cn(
          'flex h-full transform-gpu items-center justify-center pb-0.5',
          shouldReveal && 'animate-letter-flip',
        )}
        style={{ animationDelay, animationDuration }}
      >
        {value}
      </div>
    </div>
  )
}
