import { fail } from 'node:assert'

import { WORDS } from './wordlist'

// You may not want the list of solutions to be unique. In that case, disable this test
describe('wordlist', () => {
  test('words are unique', () => {
    const uniqueWords = Array.from(new Set(WORDS))

    expect(WORDS.length).toEqual(uniqueWords.length)

    if (uniqueWords.length !== WORDS.length) {
      for (const w of uniqueWords) {
        const ww = WORDS.filter((x) => x === w)
        if (ww.length > 1) {
          fail(`The word ${w} is not unique.`)
        }
      }
    }
  })
})
