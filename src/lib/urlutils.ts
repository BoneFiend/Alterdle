import { formatISO } from 'date-fns'
import { parseISO, startOfDay } from 'date-fns'
import queryString from 'query-string'

import {
  BASE_URL,
  DEFAULT_NUMBER_OF_LETTERS,
  DEFAULT_NUMBER_OF_WORDS,
  GAME_EPOCH,
  MAX_NUMBER_OF_LETTERS,
  MAX_NUMBER_OF_WORDS,
  MIN_NUMBER_OF_LETTERS,
  MIN_NUMBER_OF_WORDS,
} from '../constants/settings'
import { getToday } from './dateutils'
import { getIsLatestGame } from './words'

const getUrl = (numberOfWords: number, numberOfLetters: number, date: Date) => {
  const newUrl = new URL(window.location.href)
  newUrl.searchParams.set('w', numberOfWords.toString())
  newUrl.searchParams.set('l', numberOfLetters.toString())
  if (getIsLatestGame(date)) {
    newUrl.searchParams.delete('d')
  } else {
    newUrl.searchParams.set('d', formatISO(date, { representation: 'date' }))
  }

  return newUrl
}

export const setUrl = (
  numberOfWords: number,
  numberOfLetters: number,
  date: Date
) => {
  const newUrl = getUrl(numberOfWords, numberOfLetters, date)

  window.history.replaceState(
    { path: newUrl.toString() },
    '',
    newUrl.toString()
  )
}

export const getShareUrl = (
  numberOfWords: number,
  numberOfLetters: number,
  d: Date
) => {
  return BASE_URL + '/' + getUrl(numberOfWords, numberOfLetters, d).search
}

export const loadNumberOfWords = () => {
  const urlParams = new URLSearchParams(window.location.search)

  var numberOfWords = Number(urlParams.get('w')) ?? DEFAULT_NUMBER_OF_WORDS
  if (
    numberOfWords > MAX_NUMBER_OF_WORDS ||
    numberOfWords < MIN_NUMBER_OF_WORDS
  ) {
    numberOfWords = DEFAULT_NUMBER_OF_WORDS
  }

  return numberOfWords
}

export const loadNumberOfLetters = () => {
  const urlParams = new URLSearchParams(window.location.search)

  var numberOfLetters = Number(urlParams.get('l')) ?? DEFAULT_NUMBER_OF_LETTERS
  if (
    numberOfLetters > MAX_NUMBER_OF_LETTERS ||
    numberOfLetters < MIN_NUMBER_OF_LETTERS
  ) {
    numberOfLetters = DEFAULT_NUMBER_OF_LETTERS
  }

  return numberOfLetters
}

export const loadGameDate = () => {
  const parsed = queryString.parse(window.location.search)
  try {
    const d = startOfDay(parseISO(parsed.d!.toString()))
    if (d >= getToday() || d < GAME_EPOCH) {
      return getToday()
    }
    return d
  } catch (e) {
    return getToday()
  }
}
