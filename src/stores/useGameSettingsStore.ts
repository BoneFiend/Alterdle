import { create } from 'zustand'

import {
  loadGameDate,
  loadNumberOfLetters,
  loadNumberOfWords,
  setUrl,
  setWindowTitle,
} from '@lib/urlutils'

interface GameSettings {
  numberOfWords: number
  numberOfLetters: number
  setNumberOfWords: (numberOfWords: number) => void
  setNumberOfLetters: (numberOfLetters: number) => void
  gameDate: Date
  setGameDate: (gameDate: Date) => void
  onUpdate: () => void
}

const useGameSettingsStore = create<GameSettings>((set, get) => {
  let gameSettingsTimer: NodeJS.Timeout | null = null

  return {
    numberOfWords: loadNumberOfWords(),
    numberOfLetters: loadNumberOfLetters(),
    gameDate: loadGameDate(),

    setNumberOfWords: (numberOfWords: number) => {
      set({ numberOfWords })
      get().onUpdate()
    },

    setNumberOfLetters: (numberOfLetters: number) => {
      if (numberOfLetters === 1 && get().numberOfWords > 2) {
        // Ensures only 2 challenges can be played at once with 2 letters
        set({ numberOfWords: 2 })
      }
      set({ numberOfLetters })
      get().onUpdate()
    },

    setGameDate: (gameDate: Date) => {
      set({ gameDate })
      get().onUpdate()
    },

    onUpdate: () => {
      if (gameSettingsTimer) clearTimeout(gameSettingsTimer)
      gameSettingsTimer = setTimeout(() => {
        setUrl(get().numberOfWords, get().numberOfLetters, get().gameDate)
        setWindowTitle(get().numberOfWords, get().numberOfLetters)
      }, 1000)
    },
  }
})

export default useGameSettingsStore
