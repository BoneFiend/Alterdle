import { GAME_EPOCH } from '../constants/settings'
import { GameStats, Obj2d } from '../constants/types'
import { getToday } from './dateutils'
import {
  loadStatsFromLocalStorage,
  saveStatsToLocalStorage,
} from './localStorage'

export const defaultStats: GameStats = {
  winDistribution: {},
  gridsWonDistribution: {},
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
  won: boolean,
  gridsWon: number
) => {
  // Count is number of incorrect guesses before end.
  const stats = { ...gameStats }
  // Adding object labels if they don't already exist
  if (!stats[numberOfWords]) {
    stats[numberOfWords] = {}
  }
  if (!stats[numberOfWords][numberOfLetters]) {
    stats[numberOfWords][numberOfLetters] = { ...defaultStats }
  }

  if (stats[numberOfWords][numberOfLetters].latestDate < getToday()) {
    stats[numberOfWords][numberOfLetters].latestDate = getToday()
    stats[numberOfWords][numberOfLetters].totalGames += 1

    const gridsWonDistribution = [
      ...Object.values(
        stats[numberOfWords][numberOfLetters].gridsWonDistribution
      ).map(Number),
    ]
    gridsWonDistribution[gridsWon] = (gridsWonDistribution[gridsWon] || 0) + 1
    stats[numberOfWords][numberOfLetters].gridsWonDistribution =
      gridsWonDistribution

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
