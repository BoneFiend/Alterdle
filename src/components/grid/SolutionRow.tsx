import { unicodeSplit } from '../../lib/words'
import { Cell } from './Cell'

type Props = {
  solution: string
  isRevealing?: boolean
  numberOfLetters: number
  numberOfWords: number
}

export const SolutionRow = ({
  solution,
  isRevealing,
  numberOfLetters,
  numberOfWords,
}: Props) => {
  const splitGuess = unicodeSplit(solution)

  return (
    <div className="flex justify-center">
      {splitGuess.map((letter, i) => (
        <Cell
          key={`${numberOfLetters}-${numberOfWords}-${i}`}
          value={letter}
          status={'incorrect'}
          position={i}
          isRevealing={isRevealing}
          isCompleted
          isFocussed={true}
          numberOfLetters={numberOfLetters}
          numberOfWords={numberOfWords}
        />
      ))}
    </div>
  )
}
