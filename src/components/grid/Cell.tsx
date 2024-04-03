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
  currentRow?: boolean
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
  currentRow = false,
  numberOfLetters = 1,
  numberOfWords = 1,
}: Props) => {
  const isFilled = value && !isCompleted
  const shouldReveal = isRevealing && isCompleted
  const animationDelay = `${position * REVEAL_TIME_MS}ms`

  const crampedGrids = numberOfLetters > 7 || numberOfWords > 2 // TODO make logic here

  const classes = classnames(
    'border-solid border-2 flex items-center justify-center mx-0.5 font-bold rounded dark:text-white transition-[height] duration-300 ease-in-out',
    {
      // TODO move all row types into a single row type, so that animations work better
      // TODO also ensure completed grids still have a larger current row, as to maintain even spacing
      'text-4xl w-14 h-14': !crampedGrids && !helpModal && currentRow,
      'md:text-4xl text-2xl w-8 h-8 md:w-14 md:h-14 ':
        crampedGrids && !helpModal && currentRow,
      'text-4xl w-14 h-10': !crampedGrids && !helpModal && !currentRow,
      'md:text-4xl text-2xl w-8 h-6 md:w-14 md:h-11':
        crampedGrids && !helpModal && !currentRow,
      'text-4xl h-14 w-14': helpModal,
      'border-stone-300 dark:border-stone-500': !status,
      'border-stone-500 dark:border-stone-300': value && status === 'null',
      'absent shadowed': status === 'absent',
      'correct shadowed': status === 'correct',
      'present shadowed': status === 'present',
      'incorrect shadowed': status === 'incorrect',
      'cell-fill-animation': isFilled,
      'cell-reveal': shouldReveal,
    }
  )

  return (
    <div className={classes} style={{ animationDelay }}>
      <div className="letter-container" style={{ animationDelay }}>
        {value}
      </div>
    </div>
  )
}
