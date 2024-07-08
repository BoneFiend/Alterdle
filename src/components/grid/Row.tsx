import { useEffect, useMemo, useRef, useState } from 'react'

import { REVEAL_TIME_MS } from '../../constants/settings'
import { getGuessStatuses } from '../../lib/statuses'
import { isWordInWordList, unicodeSplit } from '../../lib/words'
import { Cell } from './Cell'

type Props = {
  solution: string
  guess: string
  numberOfLetters: number
  numberOfWords: number
  isCurrentRow: boolean
  isCompleted: boolean
  isNewlyCompleted: boolean
  currentRowClassName: string
  isRevealing?: boolean
}

export const Row = ({
  solution,
  guess,
  numberOfLetters,
  numberOfWords,
  isCurrentRow,
  isCompleted,
  isNewlyCompleted,
  currentRowClassName,
  isRevealing: initialIsRevealing,
}: Props) => {
  const [isRevealing, setIsRevealing] = useState(initialIsRevealing)
  const [hasRevealed, setHasRevealed] = useState(isNewlyCompleted)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const statuses = useMemo(() => {
    return guess ? getGuessStatuses(solution, guess) : []
  }, [guess, solution])

  const splitGuess = useMemo(() => {
    return guess ? unicodeSplit(guess) : ''
  }, [guess])

  useEffect(() => {
    // Correctly applies revealing to newly completed rows
    if (!hasRevealed && initialIsRevealing && isNewlyCompleted) {
      setIsRevealing(initialIsRevealing)
      setHasRevealed(true)
      timerRef.current = setTimeout(
        () => {
          setIsRevealing(false)
        },
        REVEAL_TIME_MS * (solution.length + 1)
      )
    }
  }, [solution.length, isNewlyCompleted, initialIsRevealing, hasRevealed])

  useEffect(() => {
    setIsRevealing(false)
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
  }, [numberOfLetters, numberOfWords])

  return (
    <div
      className={`mb-1 flex justify-center ${
        isCurrentRow && currentRowClassName
      }`}
    >
      {Array.from({ length: numberOfLetters }, (_, i) => (
        <Cell
          key={i}
          value={guess ? splitGuess[i] : undefined}
          status={
            !isCurrentRow
              ? statuses[i]
              : guess?.length === solution.length && !isWordInWordList(guess)
                ? 'incorrect'
                : 'null'
          }
          isRevealing={isRevealing}
          isCompleted={isCompleted}
          position={i}
          currentRow={isCurrentRow}
          numberOfLetters={numberOfLetters}
          numberOfWords={numberOfWords}
        />
      ))}
    </div>
  )
}
