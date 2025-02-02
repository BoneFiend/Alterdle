import {
  ClientSettings,
  GameStats,
  Obj2d,
  StoredGameState,
  defaultClientSettings,
} from '@constants/types'

const gameStateKey = 'alterdleGameState'
const archiveGameStateKey = 'alterdleArchiveGameState'
const gameStatKey = 'alterdleGameStats'

const clientSettingsKey = 'alterdleClientSettings'

export const saveGameStateToLocalStorage = (
  isLatestGame: boolean,
  gameState: StoredGameState,
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

export const saveStatsToLocalStorage = (gameStats: Obj2d<GameStats>) => {
  localStorage.setItem(gameStatKey, JSON.stringify(gameStats))
}

export const loadStatsFromLocalStorage = () => {
  const statsString = localStorage.getItem(gameStatKey)
  if (!statsString) {
    return null
  }
  const stats = JSON.parse(statsString) as Obj2d<GameStats>
  // Resaves strings as Date type
  for (const words in stats) {
    for (const letters in stats[words]) {
      stats[words][letters].latestDate = new Date(
        stats[words][letters].latestDate,
      )
    }
  }
  return stats
}

export const saveClientSettingsToLocalStorage = (
  clientSettings: ClientSettings,
) => {
  localStorage.setItem(clientSettingsKey, JSON.stringify(clientSettings))
}

export const loadClientSettingsFromLocalStorage = () => {
  const clientSettingsString = localStorage.getItem(clientSettingsKey)
  if (!clientSettingsString) {
    const prefersDarkMode = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches
    return {
      ...defaultClientSettings,
      isDarkMode: prefersDarkMode,
    } as ClientSettings
  }
  return JSON.parse(clientSettingsString) as ClientSettings
}
