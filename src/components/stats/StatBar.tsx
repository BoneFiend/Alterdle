import {
  BEST_STREAK_TEXT,
  CURRENT_STREAK_TEXT,
  SUCCESS_RATE_TEXT,
  TOTAL_TRIES_TEXT,
} from '../../constants/strings'
import { defaultStats } from '../../lib/stats'
import { Obj2d } from '../../lib/words'

type Props = {
  gameStats: Obj2d
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
    <div className="m-1 w-1/4 items-center justify-center text-blank">
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
        value={
          gameStats[numberOfWords]?.[numberOfLetters]?.totalGames ??
          defaultStats.totalGames
        }
      />
      <StatItem
        label={SUCCESS_RATE_TEXT}
        value={`${
          gameStats[numberOfWords]?.[numberOfLetters]?.successRate ??
          defaultStats.successRate
        }%`}
      />
      <StatItem
        label={CURRENT_STREAK_TEXT}
        value={
          gameStats[numberOfWords]?.[numberOfLetters]?.currentStreak ??
          defaultStats.currentStreak
        }
      />
      <StatItem
        label={BEST_STREAK_TEXT}
        value={
          gameStats[numberOfWords]?.[numberOfLetters]?.bestStreak ??
          defaultStats.bestStreak
        }
      />
    </div>
  )
}
