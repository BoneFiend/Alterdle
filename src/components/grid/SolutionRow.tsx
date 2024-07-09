import { REVEAL_TIME_MS } from '../../constants/settings'
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
  const animationDelay = `${solution.length * REVEAL_TIME_MS}ms`

  return (
    <div className="flex justify-center" style={{ animationDelay }}>
      {splitGuess.map((letter, i) => (
        <Cell
          key={`${numberOfLetters}-${numberOfWords}-${i}`}
          value={letter}
          status={'incorrect'}
          position={i + solution.length}
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
