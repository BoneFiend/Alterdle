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
  gameDate: Date
}

const useGameSettingsStore = create<GameSettings>(() => ({
  numberOfWords: loadNumberOfWords(),
  numberOfLetters: loadNumberOfLetters(),
  gameDate: loadGameDate(),
}))

export function setNumberOfWords(numberOfWords: number) {
  useGameSettingsStore.setState(() => ({ numberOfWords }))
  onUpdate()
}

export function setNumberOfLetters(numberOfLetters: number) {
  useGameSettingsStore.setState((state) => {
    if (numberOfLetters === 1 && state.numberOfWords > 2) {
      // Ensures only 2 challenges can be played at once with 2 letters
      return { numberOfLetters, numberOfWords: 2 }
    }
    return { numberOfLetters }
  })
  onUpdate()
}

export function setGameDate(gameDate: Date) {
  useGameSettingsStore.setState(() => ({ gameDate }))
  onUpdate()
}

let gameSettingsTimer: NodeJS.Timeout | null = null
function onUpdate() {
  if (gameSettingsTimer) clearTimeout(gameSettingsTimer)
  gameSettingsTimer = setTimeout(() => {
    const { numberOfWords, numberOfLetters, gameDate } =
      useGameSettingsStore.getState()
    setUrl(numberOfWords, numberOfLetters, gameDate)
    setWindowTitle(numberOfWords, numberOfLetters)
  }, 1000)
}

export default useGameSettingsStore
