import { useMemo } from 'react'

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
  isFocussed?: boolean
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
  isFocussed,
}: Props) => {
  const statuses = useMemo(() => {
    return guess ? getGuessStatuses(solution, guess) : []
  }, [guess, solution])

  const splitGuess = useMemo(() => {
    return guess ? unicodeSplit(guess) : ''
  }, [guess])

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
          isRevealing={isFocussed && !isCurrentRow}
          isCompleted={isCompleted}
          position={i}
          isFocussed={isFocussed}
          numberOfLetters={numberOfLetters}
          numberOfWords={numberOfWords}
        />
      ))}
    </div>
  )
}