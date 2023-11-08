import { CompletedRow } from './CompletedRow'
import { CurrentRow } from './CurrentRow'
import { EmptyRow } from './EmptyRow'

type Props = {
  solution: string
  guesses: string[]
  currentGuess: string
  isRevealing?: boolean
  currentRowClassName: string
  maxChallenges: number
}

export const Grid = ({
  solution,
  guesses,
  currentGuess,
  isRevealing,
  currentRowClassName,
  maxChallenges,
}: Props) => {
  const empties =
    guesses.length < maxChallenges - 1
      ? Array.from(Array(maxChallenges - 1 - guesses.length))
      : []

  return (
    <>
      {guesses.map((guess, i) => (
        <CompletedRow
          key={i}
          solution={solution}
          guess={guess}
          isRevealing={isRevealing && guesses.length - 1 === i}
        />
      ))}
      {guesses.length < maxChallenges && (
        <CurrentRow
          guess={currentGuess}
          className={currentRowClassName}
          solution={solution}
        />
      )}
      {empties.map((_, i) => (
        <EmptyRow key={i} solution={solution} />
      ))}
    </>
  )
}
