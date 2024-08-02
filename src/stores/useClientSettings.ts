import { create } from 'zustand'

import {
  getStoredGameMode,
  getStoredIsDarkMode,
  getStoredIsHighContrastMode,
  getStoredIsLongShare,
  getStoredPerfMode,
  setStoredGameMode,
  setStoredIsDarkMode,
  setStoredIsHighContrastMode,
  setStoredIsLongShare,
  setStoredPerfMode,
} from '../lib/localStorage'

interface ClientSettings {
  isDarkMode: boolean
  isHighContrastMode: boolean
  isLongShare: boolean
  isHardModePreferred: boolean
  isPerfMode: boolean
  loadAllSettings: () => void
  setIsDarkMode: (isDarkMode: boolean) => void
  setIsHighContrastMode: (isHighContrastMode: boolean) => void
  setIsLongShare: (isLongShare: boolean) => void
  setIsHardModePreferred: (isHardMode: boolean) => void
  setIsPerfMode: (isPerfMode: boolean) => void
}

const useClientSettings = create<ClientSettings>((set, get) => ({
  isDarkMode: false,
  isHighContrastMode: false,
  isLongShare: false,
  isHardModePreferred: false,
  isPerfMode: false,

  loadAllSettings: () => {
    get().setIsDarkMode(getStoredIsDarkMode())
    get().setIsHighContrastMode(getStoredIsHighContrastMode())
    get().setIsLongShare(getStoredIsLongShare())
    get().setIsHardModePreferred(getStoredGameMode())
    get().setIsPerfMode(getStoredPerfMode())
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

  setIsPerfMode: (isPerfMode: boolean) => {
    setStoredPerfMode(isPerfMode)
    set(() => ({
      isPerfMode: isPerfMode,
    }))
  },
}))

export default useClientSettings
