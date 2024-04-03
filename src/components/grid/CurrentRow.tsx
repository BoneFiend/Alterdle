import { isWordInWordList, unicodeSplit } from '../../lib/words'
import { Cell } from './Cell'

type Props = {
  guess: string
  className: string
  solution: string
  numberOfLetters: number
  numberOfWords: number
}

export const CurrentRow = ({
  guess,
  className,
  solution,
  numberOfLetters,
  numberOfWords,
}: Props) => {
  const splitGuess = unicodeSplit(guess)
  const emptyCells = Array.from(Array(solution.length - splitGuess.length))
  const classes = `flex justify-center mb-1 ${className}`

  return (
    <div className={classes}>
      {splitGuess.map((letter, i) => (
        <Cell
          key={i}
          value={letter}
          status={
            guess.length === solution.length && !isWordInWordList(guess)
              ? 'incorrect'
              : 'null'
          }
          currentRow={true}
          numberOfLetters={numberOfLetters}
          numberOfWords={numberOfWords}
        />
      ))}
      {emptyCells.map((_, i) => (
        <Cell
          key={i}
          currentRow={true}
          numberOfLetters={numberOfLetters}
          numberOfWords={numberOfWords}
        />
      ))}
    </div>
  )
}
