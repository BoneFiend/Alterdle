import { GameStats } from '../../lib/localStorage'
import { Progress } from './Progress'

type Props = {
  gameStats: GameStats
  isLatestGame: boolean
  isGameWon: boolean
  numberOfGuessesMade: number
  numberOfWords: number
  numberOfLetters: number
  maxChallenges: number
}

const isCurrentDayStatRow = (
  isLatestGame: boolean,
  isGameWon: boolean,
  numberOfGuessesMade: number,
  i: number
) => {
  return isLatestGame && isGameWon && numberOfGuessesMade === i + 1
}

export const Histogram = ({
  gameStats,
  isLatestGame,
  isGameWon,
  numberOfGuessesMade,
  numberOfWords,
  numberOfLetters,
  maxChallenges,
}: Props) => {
  const winDistribution =
    gameStats.winDistribution[numberOfWords - 1][numberOfLetters - 1]
  const maxValue = Math.max(...winDistribution, 1)
  const histogramBuckets = Array.from(
    {
      length: maxChallenges - numberOfWords + 1,
    },
    (_, i) => numberOfWords + i
  )

  return (
    <div className="justify-left m-2 columns-1 text-sm dark:text-white">
      {histogramBuckets.map((value, i) => (
        <Progress
          key={i}
          index={value}
          isCurrentDayStatRow={isCurrentDayStatRow(
            isLatestGame,
            isGameWon,
            numberOfGuessesMade,
            i
          )}
          size={90 * (winDistribution[value - 1] / maxValue)}
          label={String(winDistribution[value - 1])}
        />
      ))}
    </div>
  )
}
