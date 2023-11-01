import {
  BEST_STREAK_TEXT,
  CURRENT_STREAK_TEXT,
  SUCCESS_RATE_TEXT,
  TOTAL_TRIES_TEXT,
} from '../../constants/strings'
import { GameStats } from '../../lib/localStorage'

type Props = {
  gameStats: GameStats
  numberOfWords: number
  numberOfLetters: number
}

const StatItem = ({
  label,
  value,
}: {
  label: string
  value: string | number
}) => {
  return (
    <div className="m-1 w-1/4 items-center justify-center dark:text-white">
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-xs">{label}</div>
    </div>
  )
}

export const StatBar = ({
  gameStats,
  numberOfWords,
  numberOfLetters,
}: Props) => {
  return (
    <div className="my-2 flex justify-center">
      <StatItem
        label={TOTAL_TRIES_TEXT}
        value={gameStats.totalGames[numberOfWords - 1][numberOfLetters - 1]}
      />
      <StatItem
        label={SUCCESS_RATE_TEXT}
        value={`${
          gameStats.successRate[numberOfWords - 1][numberOfLetters - 1]
        }%`}
      />
      <StatItem
        label={CURRENT_STREAK_TEXT}
        value={gameStats.currentStreak[numberOfWords - 1][numberOfLetters - 1]}
      />
      <StatItem
        label={BEST_STREAK_TEXT}
        value={gameStats.bestStreak[numberOfWords - 1][numberOfLetters - 1]}
      />
    </div>
  )
}
