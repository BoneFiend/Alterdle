import {
  BASE_URL,
  DEFAULT_NUMBER_OF_LETTERS,
  DEFAULT_NUMBER_OF_WORDS,
  MAX_NUMBER_OF_LETTERS,
  MAX_NUMBER_OF_WORDS,
  MIN_NUMBER_OF_LETTERS,
  MIN_NUMBER_OF_WORDS,
} from '../constants/settings'

export const getUrl = (numberOfWords: number, numberOfLetters: number) => {
  const newUrl = new URL(window.location.href)
  newUrl.searchParams.set('w', numberOfWords.toString())
  newUrl.searchParams.set('l', numberOfLetters.toString())

  return newUrl
}

export const setUrl = (numberOfWords: number, numberOfLetters: number) => {
  const newUrl = getUrl(numberOfWords, numberOfLetters)

  window.history.replaceState(
    { path: newUrl.toString() },
    '',
    newUrl.toString()
  )
}

export const getShareUrl = (numberOfWords: number, numberOfLetters: number) => {
  return BASE_URL + '/' + getUrl(numberOfWords, numberOfLetters).search
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
