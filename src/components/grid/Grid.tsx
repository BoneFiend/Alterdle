import { CompletedRow } from './CompletedRow'
import { CurrentRow } from './CurrentRow'
import { EmptyRow } from './EmptyRow'
import { SolutionRow } from './SolutionRow'

type Props = {
  solution: string
  guesses: string[]
  currentGuess: string
  isRevealing?: boolean
  currentRowClassName: string
  maxChallenges: number
  numberOfLetters: number
  numberOfWords: number
}

export const Grid = ({
  solution,
  guesses,
  currentGuess,
  isRevealing,
  currentRowClassName,
  maxChallenges,
  numberOfLetters,
  numberOfWords,
}: Props) => {
  const wonIndex = guesses.includes(solution)
    ? guesses.indexOf(solution)
    : guesses.length
  const emptiesOffset = guesses.length - wonIndex // 0 if game was not won
  const empties =
    guesses.length < maxChallenges - 1 || wonIndex !== guesses.length
      ? Array.from(Array(maxChallenges - 1 - guesses.length + emptiesOffset))
      : []

  return (
    <div className="max-w-full py-3 px-2 sm:px-3">
      {guesses.slice(0, wonIndex + 1).map((guess, i) => (
        <CompletedRow
          key={i}
          solution={solution}
          guess={guess}
          isRevealing={isRevealing && guesses.length - 1 === i}
          numberOfLetters={numberOfLetters}
          numberOfWords={numberOfWords}
        />
      ))}
      {wonIndex === guesses.length && (
        <>
          {guesses.length < maxChallenges && (
            <CurrentRow
              guess={currentGuess}
              className={currentRowClassName}
              solution={solution}
              numberOfLetters={numberOfLetters}
              numberOfWords={numberOfWords}
            />
          )}
        </>
      )}
      {empties.map((_, i) => (
        <EmptyRow
          key={i}
          solution={solution}
          numberOfLetters={numberOfLetters}
          numberOfWords={numberOfWords}
        />
      ))}
      {!guesses.includes(solution) && guesses.length === maxChallenges && (
        <SolutionRow
          solution={solution}
          isRevealing={isRevealing}
          numberOfLetters={numberOfLetters}
          numberOfWords={numberOfWords}
        />
      )}
    </div>
  )
}
