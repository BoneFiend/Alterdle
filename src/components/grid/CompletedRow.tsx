import { useEffect, useState } from 'react'

import { REVEAL_TIME_MS } from '../../constants/settings'
import { getGuessStatuses } from '../../lib/statuses'
import { unicodeSplit } from '../../lib/words'
import { Cell } from './Cell'

type Props = {
  solution: string
  guess: string
  isRevealing?: boolean
  numberOfLetters: number
  numberOfWords: number
}

export const CompletedRow = ({
  solution,
  guess,
  isRevealing: initialIsRevealing,
  numberOfLetters,
  numberOfWords,
}: Props) => {
  const [isRevealing, setIsRevealing] = useState(initialIsRevealing)
  const statuses = getGuessStatuses(solution, guess)
  const splitGuess = unicodeSplit(guess)

  useEffect(() => {
    const timer = setTimeout(
      () => {
        setIsRevealing(false)
      },
      REVEAL_TIME_MS * (solution.length + 1)
    )
    return () => clearTimeout(timer)
  })

  return (
    <div className="mb-1 flex justify-start">
      {splitGuess.map((letter, i) => (
        <Cell
          key={i}
          value={letter}
          status={statuses[i]}
          position={i}
          isRevealing={isRevealing}
          isCompleted
          numberOfLetters={numberOfLetters}
          numberOfWords={numberOfWords}
        />
      ))}
    </div>
  )
}
