import { REVEAL_TIME_MS } from '../../constants/settings'
import { unicodeSplit } from '../../lib/words'
import { Cell } from './Cell'

type Props = {
  solution: string
  isRevealing?: boolean
}

export const SolutionRow = ({ solution, isRevealing }: Props) => {
  const splitGuess = unicodeSplit(solution)
  const animationDelay = `${solution.length * REVEAL_TIME_MS}ms`

  return (
    <div className="mb-1 flex justify-center" style={{ animationDelay }}>
      {splitGuess.map((letter, i) => (
        <Cell
          key={i}
          value={letter}
          status={'incorrect'}
          position={i + solution.length}
          isRevealing={isRevealing}
          isCompleted
        />
      ))}
    </div>
  )
}
