import {
  MAX_NUMBER_OF_LETTERS,
  MAX_NUMBER_OF_WORDS,
  MIN_NUMBER_OF_LETTERS,
  MIN_NUMBER_OF_WORDS,
} from '../../constants/settings'
import {
  CHALLENGES_DESCRIPTION,
  LENGTH_DESCRIPTION,
} from '../../constants/strings'
import { CharStatus } from '../../lib/statuses'
import useGameSettings from '../../stores/useGameSettings'
import useModalStore from '../../stores/useModalStore'
import { Cell } from '../grid/Cell'
import { BaseModal } from './BaseModal'
import { SettingsSlider } from './SettingsSlider'

type TutorialWords = {
  first: string
  firstCorrect: number[]
  second: string
  secondPresent: number[]
  third: string
  thirdAbsent: number[]
}

const t1: TutorialWords = {
  first: 'I',
  firstCorrect: [0],
  second: '',
  secondPresent: [],
  third: 'A',
  thirdAbsent: [0],
}
const t2: TutorialWords = {
  first: 'um',
  firstCorrect: [1],
  second: 'ta',
  secondPresent: [1],
  third: 'is',
  thirdAbsent: [1],
}
const t3: TutorialWords = {
  first: 'sun',
  firstCorrect: [0],
  second: 'dip',
  secondPresent: [0],
  third: 'emo',
  thirdAbsent: [2],
}
const t4: TutorialWords = {
  first: 'shin',
  firstCorrect: [1],
  second: 'otto',
  secondPresent: [1, 2],
  third: 'deli',
  thirdAbsent: [0],
}
const t5: TutorialWords = {
  first: 'camel',
  firstCorrect: [2, 3],
  second: 'yacht',
  secondPresent: [4],
  third: 'radon',
  thirdAbsent: [1],
}
const t6: TutorialWords = {
  first: 'though',
  firstCorrect: [1, 4],
  second: 'novels',
  secondPresent: [0, 3],
  third: 'wisdom',
  thirdAbsent: [2, 5],
}
const t7: TutorialWords = {
  first: 'gateway',
  firstCorrect: [3],
  second: 'unshift',
  secondPresent: [1, 2, 4, 5],
  third: 'touchup',
  thirdAbsent: [0, 3, 6],
}
const t8: TutorialWords = {
  first: 'midmonth',
  firstCorrect: [2, 5],
  second: 'capybara',
  secondPresent: [],
  third: 'podiatry',
  thirdAbsent: [1, 3, 4, 6],
}
const t9: TutorialWords = {
  first: 'longcloth',
  firstCorrect: [],
  second: 'appraised',
  secondPresent: [0, 1, 2, 3, 4, 5, 6, 7, 8],
  third: 'uncouthly',
  thirdAbsent: [],
}
const t10: TutorialWords = {
  first: 'rabbinical',
  firstCorrect: [0, 9],
  second: 'knickknack',
  secondPresent: [],
  third: 'indicating',
  thirdAbsent: [5],
}
const t11: TutorialWords = {
  first: 'leafhoppers',
  firstCorrect: [2, 5, 8],
  second: 'cisatlantic',
  secondPresent: [3, 4, 6, 7],
  third: 'suppressive',
  thirdAbsent: [0, 1, 2, 3, 4, 6, 7, 8, 9, 10],
}

const tutorials: { [key: number]: TutorialWords } = {
  1: t1,
  2: t2,
  3: t3,
  4: t4,
  5: t5,
  6: t6,
  7: t7,
  8: t8,
  9: t9,
  10: t10,
  11: t11,
}

export const HelpModal = () => {
  const { isHelpModalOpen, setIsHelpModalOpen } = useModalStore()

  const {
    numberOfWords,
    numberOfLetters,
    setNumberOfWords,
    setNumberOfLetters,
  } = useGameSettings()

  const first = tutorials[numberOfLetters].first
  const firstCorrect = tutorials[numberOfLetters].firstCorrect
  const second = tutorials[numberOfLetters].second
  const secondPresent = tutorials[numberOfLetters].secondPresent
  const third = tutorials[numberOfLetters].third
  const thirdAbsent = tutorials[numberOfLetters].thirdAbsent

  const createTutorialSection = (
    word: string,
    indices: number[],
    middleText: string,
    cellStatus: CharStatus
  ) => {
    const wordCells = (
      <div className="mb-1 mt-2 flex justify-center">
        {word.split('').map((c, i) => (
          <Cell
            key={i}
            isRevealing={indices.indexOf(i) > -1}
            value={c.toUpperCase()}
            isCompleted={true}
            status={indices.indexOf(i) > -1 ? cellStatus : 'null'}
            helpModal={true}
          />
        ))}
      </div>
    )
    if (word.length > 0) {
      if (indices.length > 0) {
        const letters = indices.map((i) => word[i].toUpperCase())
        const last = letters.pop()
        return (
          <>
            {wordCells}
            <p className="text-sm text-secondary">
              The letter{indices.length > 1 && 's'} {letters.join(', ')}
              {indices.length > 1 && ' and '}
              {last}
              {indices.length > 1 ? ' are' : ' is'} {middleText} spot
              {indices.length > 1 && 's'}.
            </p>
          </>
        )
      } else {
        return (
          <>
            {wordCells}
            <p className="text-sm text-secondary">
              There are no letters {middleText} spot.
            </p>
          </>
        )
      }
    } else {
      return <p></p>
    }
  }

  const handleClose = () => {
    setIsHelpModalOpen(false)
  }

  return (
    <BaseModal
      title="How to play"
      isOpen={isHelpModalOpen}
      handleClose={handleClose}
    >
      <p className="mt-2 text-sm text-secondary">
        After each guess, the color of the tiles will change to show how close
        your{' '}
        {numberOfWords > 1
          ? 'guesses were to the words.'
          : 'guess was to the word.'}
      </p>
      {createTutorialSection(
        first,
        firstCorrect,
        'in the word and in the correct',
        'correct'
      )}
      {createTutorialSection(
        second,
        secondPresent,
        'in the word but in the wrong',
        'present'
      )}
      {createTutorialSection(
        third,
        thirdAbsent,
        'not in the word in any',
        'absent'
      )}
      <br />
      <p className="text-sm text-secondary">
        The keyboard will display the status of letters that are in words which
        have not been guessed yet, prioritising correct letters.
      </p>

      <div className="flex flex-col divide-y divide-secondary-2">
        <SettingsSlider
          settingName="Word Length"
          value={numberOfLetters}
          handleValue={setNumberOfLetters}
          description={LENGTH_DESCRIPTION}
          minValue={MIN_NUMBER_OF_LETTERS}
          maxValue={MAX_NUMBER_OF_LETTERS}
        />
        <div className="-mb-3">
          <SettingsSlider
            settingName="Challenges"
            value={numberOfWords}
            handleValue={setNumberOfWords}
            description={CHALLENGES_DESCRIPTION}
            minValue={MIN_NUMBER_OF_WORDS}
            maxValue={numberOfLetters === 1 ? 2 : MAX_NUMBER_OF_WORDS}
          />
        </div>
      </div>
    </BaseModal>
  )
}
