import { defaultStats } from '../../lib/stats'
import { Obj2d } from '../../lib/words'
import { Progress } from './Progress'

type Props = {
  gameStats: Obj2d
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
  return isLatestGame && isGameWon && numberOfGuessesMade === i
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
    gameStats[numberOfWords]?.[numberOfLetters]?.winDistribution ??
    defaultStats.winDistribution
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
            value
          )}
          size={90 * (winDistribution[value - 1] / maxValue)}
          label={String(winDistribution[value - 1])}
        />
      ))}
    </div>
  )
}
