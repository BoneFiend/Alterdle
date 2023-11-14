import { Obj2d } from './words'

const gameStateKey = 'alterdleGameState'
const archiveGameStateKey = 'alterdleArchiveGameState'
const highContrastKey = 'highContrast'
const gameStatKey = 'alterdleGameStats'

export type StoredGameState = {
  guesses: Obj2d
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

export const saveStatsToLocalStorage = (gameStats: Obj2d) => {
  localStorage.setItem(gameStatKey, JSON.stringify(gameStats))
}

export const loadStatsFromLocalStorage = () => {
  const statsString = localStorage.getItem(gameStatKey)
  if (!statsString) {
    return null
  }
  const stats = JSON.parse(statsString) as Obj2d
  // Resaves strings as Date type
  for (const words in stats) {
    for (const letters in stats[words]) {
      stats[words][letters].latestDate = new Date(
        stats[words][letters].latestDate
      )
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
