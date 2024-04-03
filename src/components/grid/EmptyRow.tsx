import { Cell } from './Cell'

type Props = {
  solution: string
  numberOfLetters: number
  numberOfWords: number
}

export const EmptyRow = ({
  solution,
  numberOfLetters,
  numberOfWords,
}: Props) => {
  const emptyCells = Array.from(Array(solution.length))

  return (
    <div className="mb-1 flex justify-center">
      {emptyCells.map((_, i) => (
        <Cell
          key={i}
          numberOfLetters={numberOfLetters}
          numberOfWords={numberOfWords}
        />
      ))}
    </div>
  )
}
