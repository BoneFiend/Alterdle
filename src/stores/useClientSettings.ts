import { create } from 'zustand'

import {
  getStoredGameMode,
  getStoredIsDarkMode,
  getStoredIsHighContrastMode,
  getStoredIsLongShare,
  setStoredGameMode,
  setStoredIsDarkMode,
  setStoredIsHighContrastMode,
  setStoredIsLongShare,
} from '../lib/localStorage'

interface clientSettings {
  isDarkMode: boolean
  isHighContrastMode: boolean
  isLongShare: boolean
  isHardModePreferred: boolean
  loadAllSettings: () => void
  setIsDarkMode: (isDarkMode: boolean) => void
  setIsHighContrastMode: (isHighContrastMode: boolean) => void
  setIsLongShare: (isLongShare: boolean) => void
  setIsHardModePreferred: (isHardMode: boolean) => void
}

const useClientSettings = create<clientSettings>((set, get) => ({
  isDarkMode: false,
  isHighContrastMode: false,
  isLongShare: false,
  isHardModePreferred: false,

  loadAllSettings: () => {
    get().setIsDarkMode(getStoredIsDarkMode())
    get().setIsHighContrastMode(getStoredIsHighContrastMode())
    get().setIsLongShare(getStoredIsLongShare())
    get().setIsHardModePreferred(getStoredGameMode())
  },

  setIsDarkMode: (isDarkMode: boolean) => {
    setStoredIsDarkMode(isDarkMode)
    set(() => ({
      isDarkMode: isDarkMode,
    }))
  },

  setIsHighContrastMode: (isHighContrastMode: boolean) => {
    setStoredIsHighContrastMode(isHighContrastMode)
    set(() => ({
      isHighContrastMode: isHighContrastMode,
    }))
  },

  setIsLongShare: (isLongShare: boolean) => {
    setStoredIsLongShare(isLongShare)
    set(() => ({
      isLongShare: isLongShare,
    }))
  },

  setIsHardModePreferred: (isHardMode: boolean) => {
    setStoredGameMode(isHardMode)
    set(() => ({
      isHardModePreferred: isHardMode,
    }))
  },
}))

export default useClientSettings
