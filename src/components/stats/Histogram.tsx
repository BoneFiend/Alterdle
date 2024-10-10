import { GameStats, Obj2d } from '@constants/types'

import { getToday } from '@lib/dateutils'
import { defaultStats } from '@lib/stats'

import { Progress } from './Progress'

type Props = {
  gameStats: Obj2d<GameStats>
  isLatestGame: boolean
  isGameWon: boolean
  numberOfGuessesMade: number
  numberOfWords: number
  numberOfLetters: number
  maxChallenges: number
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
  const winDistribution: { [key: number]: number } =
    gameStats[numberOfWords]?.[numberOfLetters]?.winDistribution ??
    defaultStats.winDistribution
  const maxValue = Math.max(...Object.values(winDistribution), 1)
  const histogramBuckets = Array.from(
    {
      length: maxChallenges - numberOfWords + 1,
    },
    (_, i) => numberOfWords + i,
  )

  return (
    <div className="justify-left m-2 columns-1 text-sm dark:text-white">
      {histogramBuckets.map((value, i) => (
        <Progress
          key={i}
          index={value}
          isCurrentDayStatRow={
            isLatestGame &&
            numberOfGuessesMade === value &&
            gameStats[numberOfWords]?.[
              numberOfLetters
            ]?.latestDate.getTime() === getToday().getTime() &&
            isGameWon
          }
          size={90 * ((winDistribution[value] || 0) / maxValue)}
          label={String(winDistribution[value] || 0)}
        />
      ))}
    </div>
  )
}
