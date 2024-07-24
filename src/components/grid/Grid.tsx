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

  const wonIndex = guesses.includes(solution)
    ? guesses.indexOf(solution)
    : guesses.length

  return (
    <div className="max-w-full px-2 py-3 sm:px-3">
      {Array.from({ length: maxChallenges }, (_, i) => (
        <Row
          key={i}
          solution={solution}
          guess={
            wonIndex < i
              ? ''
              : guesses.length === i
                ? currentGuess
                : guesses.length > i
                  ? guesses[i]
                  : ''
          }
          numberOfLetters={numberOfLetters}
          numberOfWords={numberOfWords}
          isCurrentRow={guesses.length === i}
          isCompleted={guesses.length > i}
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
