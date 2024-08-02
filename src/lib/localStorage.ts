import { Obj2d } from './words'

const gameStateKey = 'alterdleGameState'
const archiveGameStateKey = 'alterdleArchiveGameState'

const darkModeKey = 'theme'
const highContrastKey = 'highContrast'
const longShareKey = 'longShare'
const gameModeKey = 'gameMode'
const perfModeKey = 'perfMode'

const gameStatKey = 'alterdleGameStats'

export type StoredGameState = {
  guesses: Obj2d
  gameDate: Date
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
  const stateString = localStorage.getItem(key)
  if (stateString) {
    const state = JSON.parse(stateString)
    state.gameDate = new Date(state.gameDate)
    return state as StoredGameState
  } else {
    return null
  }
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

export const setStoredIsDarkMode = (isDarkMode: boolean) => {
  if (
    window.matchMedia('(prefers-color-scheme: dark)').matches === isDarkMode
  ) {
    localStorage.removeItem(darkModeKey)
  } else {
    localStorage.setItem(darkModeKey, isDarkMode ? 'dark' : 'light')
  }
}

export const getStoredIsDarkMode = () => {
  const darkMode = localStorage.getItem(darkModeKey)
  const prefersDarkMode = window.matchMedia(
    '(prefers-color-scheme: dark)'
  ).matches

  const isDarkMode =
    darkMode === 'dark' || (darkMode === null && prefersDarkMode)
  return isDarkMode
}

export const setStoredIsHighContrastMode = (isHighContrast: boolean) => {
  if (isHighContrast) {
    localStorage.setItem(highContrastKey, 'true')
  } else {
    localStorage.removeItem(highContrastKey)
  }
}

export const getStoredIsHighContrastMode = () => {
  const highContrast = localStorage.getItem(highContrastKey)
  return highContrast === 'true' || highContrast === '1'
}

export const setStoredIsLongShare = (isLongShare: boolean) => {
  if (isLongShare) {
    localStorage.setItem(longShareKey, 'true')
  } else {
    localStorage.removeItem(longShareKey)
  }
}

export const getStoredIsLongShare = () => {
  const longShare = localStorage.getItem(longShareKey)
  return longShare === 'true' || longShare === '1'
}

export const setStoredGameMode = (isHardMode: boolean) => {
  localStorage.setItem(gameModeKey, isHardMode ? 'hard' : 'normal')
}

export const getStoredGameMode = () => {
  const hardMode = localStorage.getItem(gameModeKey)
  return hardMode === 'hard'
}

export const setStoredPerfMode = (isPerfMode: boolean) => {
  if (isPerfMode) {
    localStorage.setItem(perfModeKey, 'true')
  } else {
    localStorage.removeItem(perfModeKey)
  }
}

export const getStoredPerfMode = () => {
  const isPerfMode = localStorage.getItem(perfModeKey)
  return isPerfMode === 'true'
}
