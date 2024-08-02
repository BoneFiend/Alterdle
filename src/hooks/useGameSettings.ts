import { useMemo, useRef } from 'react'

import useClientSettings from '../stores/useClientSettings'
import useGameSettingsStore from '../stores/useGameSettingsStore'
import useModalStore from '../stores/useModalStore'

export function useGameSettings() {
  // A performance wrapper for useGameSettingsStore
  const { numberOfWords, numberOfLetters, gameDate } = useGameSettingsStore()

  const { isPerfMode } = useClientSettings()

  const { isAnyModalOpen } = useModalStore()

  const numberOfWordsRef = useRef<number>(numberOfWords)
  const displayNumberOfWords = useMemo(() => {
    if (isPerfMode && isAnyModalOpen) return numberOfWordsRef.current
    else {
      numberOfWordsRef.current = numberOfWords
      return numberOfWords
    }
  }, [numberOfWords, isPerfMode, isAnyModalOpen])

  const numberOfLettersRef = useRef<number>(numberOfLetters)
  const displayNumberOfLetters = useMemo(() => {
    if (isPerfMode && isAnyModalOpen) return numberOfLettersRef.current
    else {
      numberOfLettersRef.current = numberOfLetters
      return numberOfLetters
    }
  }, [numberOfLetters, isPerfMode, isAnyModalOpen])

  return {
    numberOfWords: displayNumberOfWords,
    numberOfLetters: displayNumberOfLetters,
    gameDate,
  }
}
