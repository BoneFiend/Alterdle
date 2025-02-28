import { addDays, differenceInDays, startOfDay } from 'date-fns'
import { default as GraphemeSplitter } from 'grapheme-splitter'

import {
  ENABLE_ARCHIVED_GAMES,
  GAME_EPOCH,
  MAX_CHALLENGES_BONUS,
} from '@constants/settings'
import { NOT_CONTAINED_MESSAGE, WRONG_SPOT_MESSAGE } from '@constants/strings'
import { WORDS } from '@constants/wordlist'

import { getToday } from './dateutils'
import { loadGameStateFromLocalStorage } from './localStorage'
import { getGuessStatuses } from './statuses'

export const periodInDays = 1

export const checkIsGameWon = (guesses: string[], solution: string[]) => {
  return solution.every((word) => guesses.includes(word))
}

export const countGridsWon = (guesses: string[], solution: string[]) => {
  return solution.reduce((count, word) => {
    return guesses.includes(word) ? count + 1 : count
  }, 0)
}

export const isWordInWordList = (word: string) => {
  return WORDS.includes(localeAwareLowerCase(word))
}

// build a set of previously revealed letters - present and correct
// guess must use correct letters in that space and any other revealed letters
// also check if all revealed instances of a letter are used (i.e. two C's)
export const findFirstUnusedReveal = (
  word: string,
  guesses: string[],
  solution: string,
) => {
  if (guesses.length === 0) {
    return false
  }

  const lettersLeftArray = new Array<string>()
  const guess = guesses[guesses.length - 1]
  const statuses = getGuessStatuses(solution, guess)
  const splitWord = unicodeSplit(word)
  const splitGuess = unicodeSplit(guess)

  for (let i = 0; i < splitGuess.length; i++) {
    if (statuses[i] === 'correct' || statuses[i] === 'present') {
      lettersLeftArray.push(splitGuess[i])
    }
    if (statuses[i] === 'correct' && splitWord[i] !== splitGuess[i]) {
      return WRONG_SPOT_MESSAGE(splitGuess[i], i + 1)
    }
  }

  // check for the first unused letter, taking duplicate letters
  // into account - see issue #198
  let n: number
  for (const letter of splitWord) {
    n = lettersLeftArray.indexOf(letter)
    if (n !== -1) {
      lettersLeftArray.splice(n, 1)
    }
  }

  if (lettersLeftArray.length > 0) {
    return NOT_CONTAINED_MESSAGE(lettersLeftArray[0])
  }
  return false
}

export const unicodeSplit = (word: string) => {
  return new GraphemeSplitter().splitGraphemes(word)
}

export const unicodeLength = (word: string) => {
  return unicodeSplit(word).length
}

const localeAwareLowerCase = (text: string) => {
  return import.meta.env.REACT_APP_LOCALE_STRING
    ? text.toLocaleLowerCase(import.meta.env.REACT_APP_LOCALE_STRING)
    : text.toLowerCase()
}

export const localeAwareUpperCase = (text: string) => {
  return import.meta.env.REACT_APP_LOCALE_STRING
    ? text.toLocaleUpperCase(import.meta.env.REACT_APP_LOCALE_STRING)
    : text.toUpperCase()
}

export const getLastGameDate = (today: Date) => {
  const t = startOfDay(today)
  const daysSinceLastGame = differenceInDays(GAME_EPOCH, t) % periodInDays
  return addDays(t, -daysSinceLastGame)
}

export const getNextGameDate = (today: Date) => {
  return addDays(getLastGameDate(today), periodInDays)
}

export const isValidGameDate = (date: Date) => {
  if (date < GAME_EPOCH || date > getToday()) {
    return false
  }

  return differenceInDays(GAME_EPOCH, date) % periodInDays === 0
}

export const getIndex = (gameDate: Date) => {
  let start = GAME_EPOCH
  let index = -1
  do {
    index++
    start = addDays(start, periodInDays)
  } while (start <= gameDate)

  return index
}

const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

export const getSolution = (
  gameDate: Date,
  numberOfWords: number,
  numberOfLetters: number,
) => {
  const nextGameDate = getNextGameDate(gameDate)
  const index = getIndex(gameDate)

  const seed =
    gameDate.getDate() * Math.E +
    gameDate.getMonth() +
    gameDate.getFullYear() +
    numberOfWords * 1234 +
    numberOfLetters
  const solution: string[] = []

  const availableWords = [
    ...WORDS.filter((word) => word.length === numberOfLetters),
  ]

  for (let i = 0; i < numberOfWords && availableWords.length > 0; i++) {
    const index = Math.floor(seededRandom(seed + i) * availableWords.length)
    solution.push(localeAwareUpperCase(availableWords[index]))
    availableWords.splice(index, 1)
  }

  return {
    newSolution: solution,
    solutionGameDate: gameDate,
    solutionIndex: index,
    tomorrow: nextGameDate.valueOf(),
  }
}

export const getIsLatestGame = (date: Date) => {
  if (!ENABLE_ARCHIVED_GAMES) {
    return true
  }

  return date >= getToday()
}

export const loadGuesses = (gameDate: Date, isLatestGame: boolean) => {
  const loaded = loadGameStateFromLocalStorage(isLatestGame)
  if (loaded?.gameDate.getTime() !== gameDate.getTime()) {
    return {}
  }
  return loaded.guesses
}

export const calculateMaxChallenges = (numberOfWords: number) => {
  return numberOfWords + MAX_CHALLENGES_BONUS
}
