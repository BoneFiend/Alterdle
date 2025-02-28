import type { CharStatus } from '@constants/types'

import { unicodeSplit } from './words'

export const getStatuses = (
  solution: string[],
  guesses: string[],
): { [key: string]: CharStatus } => {
  const charObj: { [key: string]: CharStatus } = {}

  for (const word of guesses) {
    for (const sol of solution) {
      if (guesses.includes(sol)) {
        // Make letters from already guessed words absent by default
        for (const letter of unicodeSplit(sol)) {
          if (!charObj[letter]) charObj[letter] = 'absent'
        }
      } else {
        const splitSolution = unicodeSplit(sol)

        unicodeSplit(word).forEach((letter, i) => {
          if (!splitSolution.includes(letter)) {
            // Make status absent if it hasn't already been set
            if (!charObj[letter]) charObj[letter] = 'absent'
          }

          if (letter === splitSolution[i]) {
            // Make status correct
            charObj[letter] = 'correct'
            return
          }

          if (charObj[letter] !== 'correct') {
            // Make status present if it hasn't already been set as correct
            charObj[letter] = 'present'
            return
          }
        })
      }
    }
  }

  return charObj
}

export const getGuessStatuses = (
  solution: string,
  guess: string,
): CharStatus[] => {
  const splitSolution = unicodeSplit(solution)
  const splitGuess = unicodeSplit(guess)

  const solutionCharsTaken = splitSolution.map((_) => false)

  const statuses: CharStatus[] = Array.from(Array(guess.length))

  // handle all correct cases first
  splitGuess.forEach((letter, i) => {
    if (letter === splitSolution[i]) {
      statuses[i] = 'correct'
      solutionCharsTaken[i] = true
      return
    }
  })

  splitGuess.forEach((letter, i) => {
    if (statuses[i]) return

    if (!splitSolution.includes(letter)) {
      // handles the absent case
      statuses[i] = 'absent'
      return
    }

    // now we are left with "present"s
    const indexOfPresentChar = splitSolution.findIndex(
      (x, index) => x === letter && !solutionCharsTaken[index],
    )

    if (indexOfPresentChar > -1) {
      statuses[i] = 'present'
      solutionCharsTaken[indexOfPresentChar] = true
      return
    }

    statuses[i] = 'absent'
    return
  })

  return statuses
}
