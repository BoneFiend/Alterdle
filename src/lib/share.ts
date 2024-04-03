import { UAParser } from 'ua-parser-js'

import { MAX_SHARE_WIDTH } from '../constants/settings'
import { GAME_TITLE } from '../constants/strings'
import { getGuessStatuses } from './statuses'
import { getShareUrl } from './urlutils'
import { getGameDate, getIndex, unicodeSplit } from './words'

const webShareApiDeviceTypes: string[] = ['mobile', 'smarttv', 'wearable']
const parser = new UAParser()
const browser = parser.getBrowser()
const device = parser.getDevice()

export const shareStatus = (
  solution: string[],
  guesses: string[],
  lost: boolean,
  isHardMode: boolean,
  isDarkMode: boolean,
  isHighContrastMode: boolean,
  handleShareToClipboard: () => void,
  handleShareFailure: () => void,
  maxChallenges: number,
  numberOfWords: number,
  numberOfLetters: number
) => {
  const gridsPerRow = Math.max(
    Math.floor(MAX_SHARE_WIDTH / (numberOfLetters + 1)),
    1
  )

  const header = `${GAME_TITLE} #${getIndex(
    getGameDate()
  )} ${numberOfWords}x${numberOfLetters} ${
    lost ? 'X' : guesses.length
  }/${maxChallenges}${isHardMode ? '*' : ''}\n`

  const url = getShareUrl(numberOfWords, numberOfLetters)
  var grids = ''
  var numbers = ''

  for (let i = 0; i < numberOfWords; i += gridsPerRow) {
    // Each row of the big grid
    numbers = numbers.concat(
      '\n',
      getEmojiNumber(guesses.indexOf(solution[i]) + 1, maxChallenges)
    )

    var row = generateEmojiGrid(
      solution[i],
      guesses,
      getEmojiTiles(isDarkMode, isHighContrastMode)
    )
    for (let j = i + 1; j < i + gridsPerRow && j < numberOfWords; j += 1) {
      // Subsequent emoji grids in the big grid
      numbers = numbers.concat(
        ' ',
        getEmojiNumber(guesses.indexOf(solution[j]) + 1, maxChallenges)
      )

      row = joinEmojiGrids(
        row,
        generateEmojiGrid(
          solution[j],
          guesses,
          getEmojiTiles(isDarkMode, isHighContrastMode)
        )
      )
    }
    grids = grids.concat('\n', row)
  }
  const textToShare = header.concat(numbers, '\n', url, grids)
  const shareData = { text: textToShare }

  let shareSuccess = false

  try {
    if (attemptShare(shareData)) {
      navigator.share(shareData)
      shareSuccess = true
    }
  } catch (error) {
    shareSuccess = false
  }

  try {
    if (!shareSuccess) {
      if (navigator.clipboard) {
        navigator.clipboard
          .writeText(textToShare)
          .then(handleShareToClipboard)
          .catch(handleShareFailure)
      } else {
        handleShareFailure()
      }
    }
  } catch (error) {
    handleShareFailure()
  }
}

export const generateEmojiGrid = (
  solution: string,
  guesses: string[],
  tiles: string[]
) => {
  const wonIndex = guesses.includes(solution)
    ? guesses.indexOf(solution)
    : guesses.length

  // Main guesses
  const output = guesses
    .slice(0, wonIndex + 1)
    .map((guess) => {
      const status = getGuessStatuses(solution, guess)
      const splitGuess = unicodeSplit(guess)

      return splitGuess
        .map((_, i) => {
          switch (status[i]) {
            case 'correct':
              return tiles[0]
            case 'present':
              return tiles[1]
            default:
              return tiles[2]
          }
        })
        .join('')
    })
    .join('\n')

  // After challenge was won
  const empties = guesses
    .slice(wonIndex + 1, guesses.length)
    .map((guess) => {
      const splitGuess = unicodeSplit(guess)

      return splitGuess
        .map((_, i) => {
          return tiles[3]
        })
        .join('')
    })
    .join('\n')

  return output.concat('\n', empties)
}

const attemptShare = (shareData: object) => {
  return (
    // Deliberately exclude Firefox Mobile, because its Web Share API isn't working correctly
    browser.name?.toUpperCase().indexOf('FIREFOX') === -1 &&
    webShareApiDeviceTypes.indexOf(device.type ?? '') !== -1 &&
    navigator.canShare &&
    navigator.canShare(shareData) &&
    navigator.share
  )
}

const getEmojiTiles = (isDarkMode: boolean, isHighContrastMode: boolean) => {
  let tiles: string[] = []
  tiles.push(isHighContrastMode ? '🟧' : '🟩')
  tiles.push(isHighContrastMode ? '🟦' : '🟨')
  tiles.push('⬜')
  tiles.push('⬛')
  return tiles
}

const joinEmojiGrids = (a: string, b: string) => {
  // Joins 2 multi-line strings side by side. Clips if strings are different amount of rows
  const aLines = a.split('\n')
  const bLines = b.split('\n')

  let combinedLines = []
  for (let i = 0; i < aLines.length; i++) {
    const aLine = aLines[i] || ''
    const bLine = bLines[i] || ''

    combinedLines.push(aLine + '  ' + bLine)
  }
  return combinedLines.join('\n')
}

const getEmojiNumber = (number: number, maxChallenges: number) => {
  const minDigits = maxChallenges.toString().length
  if (number < 1) {
    return '🟥'.repeat(minDigits)
  }
  const emojis: { [key: string]: string } = {
    '0': '0️⃣',
    '1': '1️⃣',
    '2': '2️⃣',
    '3': '3️⃣',
    '4': '4️⃣',
    '5': '5️⃣',
    '6': '6️⃣',
    '7': '7️⃣',
    '8': '8️⃣',
    '9': '9️⃣',
  }
  const output = number
    .toString()
    .split('')
    .map((digit) => emojis[digit])
    .join('')

  return '⬜'.repeat((minDigits * 3 - output.length) / 3) + output
}
