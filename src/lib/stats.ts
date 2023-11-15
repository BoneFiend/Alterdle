import { GAME_EPOCH } from '../constants/settings'
import { getToday } from './dateutils'
import {
  loadStatsFromLocalStorage,
  saveStatsToLocalStorage,
} from './localStorage'
import { Obj2d } from './words'

type GameStats = {
  winDistribution: { [key: number]: number }
  gamesFailed: number
  currentStreak: number
  bestStreak: number
  totalGames: number
  successRate: number
  latestDate: Date
}

export const defaultStats: GameStats = {
  winDistribution: {},
  gamesFailed: 0,
  currentStreak: 0,
  bestStreak: 0,
  totalGames: 0,
  successRate: 0,
  latestDate: GAME_EPOCH,
}

export const addStatsForCompletedGame = (
  gameStats: Obj2d,
  count: number,
  numberOfWords: number,
  numberOfLetters: number,
  won: boolean
) => {
  // Count is number of incorrect guesses before end.
  const stats = { ...gameStats }
  if (!stats[numberOfWords]) {
    stats[numberOfWords] = {}
  }
  if (!stats[numberOfWords][numberOfLetters]) {
    stats[numberOfWords][numberOfLetters] = { ...defaultStats }
  }
  if (stats[numberOfWords][numberOfLetters].latestDate < getToday()) {
    stats[numberOfWords][numberOfLetters].latestDate = getToday()
    stats[numberOfWords][numberOfLetters].totalGames += 1

    if (!won) {
      // Lose situation
      stats[numberOfWords][numberOfLetters].currentStreak = 0
      stats[numberOfWords][numberOfLetters].gamesFailed += 1
    } else {
      // Win situation
      const winDistribution = [
        ...Object.values(
          stats[numberOfWords][numberOfLetters].winDistribution
        ).map(Number),
      ]
      winDistribution[count] = (winDistribution[count] || 0) + 1
      stats[numberOfWords][numberOfLetters].winDistribution = winDistribution
      stats[numberOfWords][numberOfLetters].currentStreak += 1

      if (
        stats[numberOfWords][numberOfLetters].bestStreak <
        stats[numberOfWords][numberOfLetters].currentStreak
      ) {
        stats[numberOfWords][numberOfLetters].bestStreak =
          stats[numberOfWords][numberOfLetters].currentStreak
      }
    }

    stats[numberOfWords][numberOfLetters].successRate = getSuccessRate(
      stats,
      numberOfWords,
      numberOfLetters
    )
  }
  saveStatsToLocalStorage(stats)
  return stats
}

export const loadStats = () => {
  return loadStatsFromLocalStorage() || ({} as Obj2d)
}

const getSuccessRate = (
  gameStats: Obj2d,
  numberOfWords: number,
  numberOfLetters: number
) => {
  const { totalGames, gamesFailed } = gameStats[numberOfWords][numberOfLetters]

  return Math.round(
    (100 * (totalGames - gamesFailed)) / Math.max(totalGames, 1)
  )
}
