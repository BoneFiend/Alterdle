import { Row } from './Row'
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
  return (
    <div className="max-w-full py-3 px-2 sm:px-3">
      {Array.from({ length: maxChallenges }, (_, i) => (
        <Row
          key={i}
          solution={solution}
          guess={
            guesses.length === i
              ? currentGuess
              : guesses.length > i
                ? guesses[i]
                : ''
          }
          numberOfLetters={numberOfLetters}
          numberOfWords={numberOfWords}
          isCurrentRow={guesses.length === i}
          isCompleted={guesses.length > i}
          isNewlyCompleted={guesses.length - 1 === i}
          currentRowClassName={currentRowClassName}
          isRevealing={isRevealing}
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
