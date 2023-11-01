const gameStateKey = 'alterdleGameState'
const archiveGameStateKey = 'alterdleArchiveGameState'
const highContrastKey = 'highContrast'
const gameStatKey = 'alterdleGameStats'

export type StoredGameState = {
  guesses: string[][]
  solution: string[]
}

export const saveGameStateToLocalStorage = (
  isLatestGame: boolean,
  gameState: StoredGameState
) => {
  const key = isLatestGame ? gameStateKey : archiveGameStateKey
  localStorage.setItem(key, JSON.stringify(gameState))
}

export const loadGameStateFromLocalStorage = (isLatestGame: boolean) => {
  const key = isLatestGame ? gameStateKey : archiveGameStateKey
  const state = localStorage.getItem(key)
  return state ? (JSON.parse(state) as StoredGameState) : null
}

export type GameStats = {
  winDistribution: number[][][]
  gamesFailed: number[][]
  currentStreak: number[][]
  bestStreak: number[][]
  totalGames: number[][]
  successRate: number[][]
  latestDate: Date[][]
}

export const saveStatsToLocalStorage = (gameStats: GameStats) => {
  localStorage.setItem(gameStatKey, JSON.stringify(gameStats))
}

export const loadStatsFromLocalStorage = () => {
  // TODO add check for if storage stats are long enough for max letters/words
  const statsString = localStorage.getItem(gameStatKey)
  if (!statsString) {
    return null
  }
  const stats = JSON.parse(statsString) as GameStats
  for (let i = 0; i < stats.latestDate.length - 1; i++) {
    for (let j = 0; j < stats.latestDate.length - 1; j++) {
      stats.latestDate[i][j] = new Date(stats.latestDate[i][j])
    }
  }
  return stats
}

export const setStoredIsHighContrastMode = (isHighContrast: boolean) => {
  if (isHighContrast) {
    localStorage.setItem(highContrastKey, '1')
  } else {
    localStorage.removeItem(highContrastKey)
  }
}

export const getStoredIsHighContrastMode = () => {
  const highContrast = localStorage.getItem(highContrastKey)
  return highContrast === '1'
}
