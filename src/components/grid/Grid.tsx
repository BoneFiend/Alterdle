import useFocussedRows from '../../stores/useFocussedRows'
import { Row } from './Row'
import { SolutionRow } from './SolutionRow'

type Props = {
  solution: string
  guesses: string[]
  currentGuess: string
  currentRowClassName: string
  maxChallenges: number
  numberOfLetters: number
  numberOfWords: number
}

export const Grid = ({
  solution,
  guesses,
  currentGuess,
  currentRowClassName,
  maxChallenges,
  numberOfLetters,
  numberOfWords,
}: Props) => {
  const { isRowFocussed } = useFocussedRows()

  return (
    <div className="max-w-full py-3 px-2 sm:px-3">
      {Array.from({ length: maxChallenges }, (_, i) => (
        <Row
          key={`${numberOfLetters}-${numberOfWords}-${i}`}
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
          isFocussed={isRowFocussed(i)}
        />
      ))}
      {!guesses.includes(solution) &&
        guesses.length === maxChallenges &&
        !isRowFocussed(maxChallenges - 1) && (
          <SolutionRow
            solution={solution}
            isRevealing={isRowFocussed(maxChallenges)}
            numberOfLetters={numberOfLetters}
            numberOfWords={numberOfWords}
          />
        )}
    </div>
  )
}
