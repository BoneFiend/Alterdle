import { GAME_EPOCH, MAX_NUMBER_OF_WORDS } from '../constants/settings'
import { getToday } from './dateutils'
import {
  GameStats,
  loadStatsFromLocalStorage,
  saveStatsToLocalStorage,
} from './localStorage'
import { create2dArray } from './words'

export const addStatsForCompletedGame = (
  gameStats: GameStats,
  count: number,
  numberOfWords: number,
  numberOfLetters: number,
  maxChallenges: number
) => {
  // Count is number of incorrect guesses before end.
  const stats = { ...gameStats }
  if (stats.latestDate[numberOfWords - 1][numberOfLetters - 1] < getToday()) {
    stats.latestDate[numberOfWords - 1][numberOfLetters - 1] = getToday()
    stats.totalGames[numberOfWords - 1][numberOfLetters - 1] += 1

    if (count >= maxChallenges) {
      // Fail situation
      stats.currentStreak[numberOfWords - 1][numberOfLetters - 1] = 0
      stats.gamesFailed[numberOfWords - 1][numberOfLetters - 1] += 1
    } else {
      // Win situation
      const winDistribution = [
        ...stats.winDistribution[numberOfWords - 1][numberOfLetters - 1],
      ]
      winDistribution[count - 1] += 1
      stats.winDistribution[numberOfWords - 1][numberOfLetters - 1] =
        winDistribution
      stats.currentStreak[numberOfWords - 1][numberOfLetters - 1] += 1

      if (
        stats.bestStreak[numberOfWords - 1][numberOfLetters - 1] <
        stats.currentStreak[numberOfWords - 1][numberOfLetters - 1]
      ) {
        stats.bestStreak[numberOfWords - 1][numberOfLetters - 1] =
          stats.currentStreak[numberOfWords - 1][numberOfLetters - 1]
      }
    }

    stats.successRate[numberOfWords - 1][numberOfLetters - 1] = getSuccessRate(
      stats,
      numberOfWords,
      numberOfLetters
    )
  }
  saveStatsToLocalStorage(stats)
  return stats
}

const defaultStats: GameStats = {
  winDistribution: create2dArray(
    Array.from(new Array(MAX_NUMBER_OF_WORDS + 5), () => 0)
  ),
  gamesFailed: create2dArray(0),
  currentStreak: create2dArray(0),
  bestStreak: create2dArray(0),
  totalGames: create2dArray(0),
  successRate: create2dArray(0),
  latestDate: create2dArray(GAME_EPOCH),
}

export const loadStats = () => {
  return loadStatsFromLocalStorage() || defaultStats
}

const getSuccessRate = (
  gameStats: GameStats,
  numberOfWords: number,
  numberOfLetters: number
) => {
  const { totalGames, gamesFailed } = gameStats

  return Math.round(
    (100 *
      (totalGames[numberOfWords - 1][numberOfLetters - 1] -
        gamesFailed[numberOfWords - 1][numberOfLetters - 1])) /
      Math.max(totalGames[numberOfWords - 1][numberOfLetters - 1], 1)
  )
}
